import { beforeEach, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  apps: [] as { name: string; options: Record<string, unknown> }[],
  app: vi.fn(), appCheck: vi.fn(), token: vi.fn(), persistence: vi.fn(),
  signin: vi.fn(), claims: vi.fn(), callable: vi.fn(), call: vi.fn(),
  identity: vi.fn(), adapter: vi.fn(),
}));
vi.mock("firebase/app", () => ({ getApps: () => m.apps, initializeApp: m.app }));
vi.mock("firebase/auth", () => ({ getAuth: (app: unknown) => ({ app }),
  getIdTokenResult: m.claims, indexedDBLocalPersistence: "indexedDB",
  setPersistence: m.persistence, signInWithCustomToken: m.signin,
}));
vi.mock("firebase/app-check", () => ({ initializeAppCheck: m.appCheck,
  ReCaptchaEnterpriseProvider: class {}, getToken: m.token,
}));
vi.mock("firebase/firestore", () => ({ getFirestore: () => ({}) }));
vi.mock("firebase/storage", () => ({ getStorage: () => ({}) }));
vi.mock("firebase/functions", () => ({ getFunctions: () => ({}), httpsCallable: m.callable }));
vi.mock("../integration/browser-identity", () => ({ browserIdentity: m.identity }));
vi.mock("../integration/firebase-adapter", () => ({ createFirebaseAdapter: m.adapter }));
const uid = `w_${"a".repeat(40)}`;
const appId = "1:151223255006:web:7313193eb6302e7582674f";
const session = { uid, webAppId: appId, capabilityVersion: 1, customToken: "server-custom-token" };
const config = {
  firebase: { apiKey: "AIza-public-web-key", projectId: "bethere-3d7de", appId,
    authDomain: "bethere-3d7de.firebaseapp.com", storageBucket: "bethere-3d7de.appspot.com" },
  appCheckSiteKey: "public-site-key-configured", functionsRegion: "us-central1",
};
beforeEach(() => {
  vi.resetModules(); vi.resetAllMocks(); m.apps = [];
  m.app.mockImplementation((options, name) => { const app = { name, options }; m.apps.push(app); return app; });
  m.appCheck.mockReturnValue({}); m.token.mockResolvedValue({ token: "app-check-token" });
  m.identity.mockResolvedValue("a".repeat(64));
  m.callable.mockImplementation((_fn, name) => (data: unknown) => m.call(name, data));
  m.call.mockResolvedValue({ data: session });
  m.signin.mockResolvedValue({ user: { uid } });
  m.claims.mockResolvedValue({ claims: { platform: "web", webAppId: appId,
    webSessionHandle: "b".repeat(40), deviceHandle: "b".repeat(40), deviceRestricted: false } });
  m.adapter.mockReturnValue({ session: { uid } });
});

it("uses separate Firebase auth and one authenticated bootstrap for concurrent consumers", async () => {
  m.apps.push({ name: "[DEFAULT]", options: { appId: "native-default" } });
  const { connectWebStudio } = await import("../integration/firebase-bootstrap");
  const [a, b] = await Promise.all([connectWebStudio(config), connectWebStudio(config)]);
  expect(a).toBe(b);
  expect(m.app).toHaveBeenCalledExactlyOnceWith(config.firebase, "beanywhere-web-studio");
  expect(m.call).toHaveBeenCalledExactlyOnceWith("authWithWebSession", { secret: "a".repeat(64) });
  expect(m.signin).toHaveBeenCalledTimes(1);
  const dependencies = m.adapter.mock.calls[0][0];
  expect(dependencies.session).not.toHaveProperty("customToken");
  expect(dependencies.checkoutOrigins).toEqual(["https://checkout.stripe.com"]);
  await dependencies.payments.createCheckout("order-1", "customer@example.com");
  expect(m.call).toHaveBeenLastCalledWith("createWebCheckout", { orderId: "order-1", email: "customer@example.com", analytics:{enabled:false,version:"web-20261021-11"} });
  await dependencies.payments.getCheckout("order-1");
  expect(m.call).toHaveBeenLastCalledWith("getWebCheckoutStatus", { orderId: "order-1" });
});

it("does not authenticate or continue if App Check cannot verify the browser", async () => {
  m.token.mockRejectedValue(new Error("Attestation unavailable"));
  const { connectWebStudio } = await import("../integration/firebase-bootstrap");
  await expect(connectWebStudio(config)).rejects.toThrow("Attestation unavailable");
  expect(m.call).not.toHaveBeenCalled(); expect(m.signin).not.toHaveBeenCalled();
});

it("retries a temporary connection failure with the same saved identity", async () => {
  m.call.mockRejectedValueOnce(new Error("offline"));
  const { connectWebStudio } = await import("../integration/firebase-bootstrap");
  await expect(connectWebStudio(config)).rejects.toThrow("offline");
  await connectWebStudio(config);
  expect(m.call.mock.calls[0][1]).toEqual(m.call.mock.calls[1][1]);
  expect(m.appCheck).toHaveBeenCalledTimes(1);
});

it.each([{ uid: "native-user" }, { webAppId: "1:151223255006:web:000000" },
  { capabilityVersion: 2 }, { customToken: "" }])("rejects an invalid server session: %j", async patch => {
  m.call.mockResolvedValue({ data: { ...session, ...patch } });
  const { connectWebStudio } = await import("../integration/firebase-bootstrap");
  await expect(connectWebStudio(config)).rejects.toThrow("could not verify");
  expect(m.signin).not.toHaveBeenCalled(); expect(m.adapter).not.toHaveBeenCalled();
});

it("refuses a returned token whose claims do not prove the admitted web identity", async () => {
  m.claims.mockResolvedValue({ claims: { deviceHandle: "b".repeat(40), deviceRestricted: false } });
  const { connectWebStudio } = await import("../integration/firebase-bootstrap");
  await expect(connectWebStudio(config)).rejects.toThrow("could not verify your sign-in");
  expect(m.adapter).not.toHaveBeenCalled();
});

it("rejects the old web app and incomplete configuration before any network work", async () => {
  const { connectWebStudio } = await import("../integration/firebase-bootstrap");
  expect(() => connectWebStudio({ ...config, firebase: { ...config.firebase,
    appId: "1:151223255006:web:76deb7b1d38f351582674f" } })).toThrow("not configured");
  expect(() => connectWebStudio({ ...config, appCheckSiteKey: "" })).toThrow("not configured");
  expect(m.identity).not.toHaveBeenCalled(); expect(m.app).not.toHaveBeenCalled();
});
