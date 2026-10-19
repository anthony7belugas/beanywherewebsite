import { expect, it } from "vitest";
import { studioCsp, validateStudioBuild } from "../integration/studio-config";

const configured = { VITE_STUDIO_MODE: "live", VITE_FIREBASE_PROJECT_ID: "bethere-3d7de",
  VITE_FIREBASE_APP_ID: "1:151223255006:web:7313193eb6302e7582674f",
  VITE_FIREBASE_AUTH_DOMAIN: "bethere-3d7de.firebaseapp.com",
  VITE_FIREBASE_STORAGE_BUCKET: "bethere-3d7de.firebasestorage.app",
  VITE_FIREBASE_API_KEY: "AIzaTestPublicConfiguration", VITE_APP_CHECK_SITE_KEY: "TestPublicSiteKey1234567890" };

it("cannot publish the demo by omitting or misspelling the production mode", () => {
  for (const env of [{}, { VITE_STUDIO_MODE: "demo" }, { VITE_STUDIO_MODE: "lve" }]) {
    expect(() => validateStudioBuild("build", "production", env)).toThrow("Production builds require");
  }
});
it("cannot publish a live build without App Check or with the wrong Firebase app", () => {
  expect(() => validateStudioBuild("build", "production", { ...configured, VITE_APP_CHECK_SITE_KEY: "" })).toThrow();
  expect(() => validateStudioBuild("build", "production", { ...configured, VITE_FIREBASE_APP_ID: "mobile-app" })).toThrow();
  expect(() => validateStudioBuild("build", "production", configured)).not.toThrow();
});
it("keeps explicit draft builds disconnected", () => {
  expect(() => validateStudioBuild("build", "draft", {})).not.toThrow();
  expect(() => validateStudioBuild("build", "draft", configured)).toThrow();
  const policy = studioCsp(false, false);
  expect(policy).not.toContain("googleapis.com"); expect(policy).not.toContain("cloudfunctions.net");
});
it("allows only the required live origins, with no localhost connections in production", () => {
  const policy = studioCsp(true, false);
  expect(policy).toContain("https://us-central1-bethere-3d7de.cloudfunctions.net");
  expect(policy).toContain("https://firebaseappcheck.googleapis.com");
  expect(policy).not.toMatch(/(?:^|\s)https:(?:\s|;|$)/);
  expect(policy).not.toContain("*"); expect(policy).not.toContain("localhost");
  expect(policy).not.toContain("unsafe-eval"); expect(policy).toContain("form-action 'none'");
});
