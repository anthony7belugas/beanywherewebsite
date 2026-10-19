import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, getIdTokenResult, indexedDBLocalPersistence, setPersistence,
  signInWithCustomToken } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { createFirebaseAdapter, type WebCheckout } from "./firebase-adapter";
import { browserIdentity } from "./browser-identity";
import { admittedWebClaims, validWebSession, type WebSession } from "./web-session";

export type StudioFirebaseConfig = {
  firebase: FirebaseOptions;
  appCheckSiteKey: string;
  functionsRegion: string;
};

/** Deliberately named: the web app cannot adopt an existing default/native Firebase auth store. */
const APP_NAME = "beanywhere-web-studio";
let pending: Promise<ReturnType<typeof createFirebaseAdapter>> | undefined;
let startedConfig: string | undefined;
let appCheck: ReturnType<typeof initializeAppCheck> | undefined;

export function validateStudioFirebaseConfig(config: StudioFirebaseConfig) {
  if (config.firebase.projectId !== "bethere-3d7de" ||
      config.firebase.appId !== "1:151223255006:web:7313193eb6302e7582674f" ||
      config.firebase.authDomain !== "bethere-3d7de.firebaseapp.com" ||
      !/^AIza[A-Za-z0-9_-]+$/.test(config.firebase.apiKey || "") ||
      !["bethere-3d7de.firebasestorage.app", "bethere-3d7de.appspot.com"].includes(config.firebase.storageBucket || "") ||
      !/^[A-Za-z0-9_-]{20,200}$/.test(config.appCheckSiteKey) ||
      config.functionsRegion !== "us-central1") {
    throw new Error("The web studio connection is not configured yet.");
  }
}

export function connectWebStudio(config: StudioFirebaseConfig) {
  validateStudioFirebaseConfig(config);
  const key = JSON.stringify(config);
  if (startedConfig && startedConfig !== key) {
    throw new Error("The studio connection changed. Reload this page before continuing.");
  }
  startedConfig = key;
  // One sign-in and adapter per page. A network failure may be retried with the same durable secret.
  return pending ??= connect(config).catch(error => {
    pending = undefined;
    throw error;
  });
}

async function connect(config: StudioFirebaseConfig) {
  const app = getApps().find(value => value.name === APP_NAME) || initializeApp(config.firebase, APP_NAME);
  if (app.options.appId !== config.firebase.appId || app.options.projectId !== config.firebase.projectId) {
    throw new Error("The studio connection does not match this website.");
  }
  const secret = await browserIdentity();
  appCheck ??= initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(config.appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  // No anonymous-auth, debug-token, or unenforced fallback when attestation is unavailable.
  await getToken(appCheck);
  const auth = getAuth(app);
  await setPersistence(auth, indexedDBLocalPersistence);
  const functions = getFunctions(app, config.functionsRegion);
  const response = await httpsCallable<{ secret: string }, WebSession & { customToken: string }>(
    functions, "authWithWebSession", { timeout: 30000 },
  )({ secret });
  const session = response.data;
  if (!validWebSession(session) || session.webAppId !== config.firebase.appId ||
      typeof session.customToken !== "string" || !session.customToken) {
    throw new Error("The studio could not verify your browser session.");
  }
  const { user } = await signInWithCustomToken(auth, session.customToken);
  const token = await getIdTokenResult(user);
  if (!admittedWebClaims(user.uid, token.claims, session)) {
    throw new Error("The studio could not verify your sign-in.");
  }
  const create = httpsCallable<{ orderId: string; email: string }, WebCheckout>(
    functions, "createWebCheckout", { timeout: 95000 },
  );
  const status = httpsCallable<{ orderId: string }, WebCheckout>(
    functions, "getWebCheckoutStatus", { timeout: 25000 },
  );
  return createFirebaseAdapter({
    auth, appCheck, functions, db: getFirestore(app), storage: getStorage(app),
    session: { uid: session.uid, webAppId: session.webAppId, capabilityVersion: 1 },
    checkoutOrigins: ["https://checkout.stripe.com"],
    payments: {
      createCheckout: async (orderId, email) => (await create({ orderId, email })).data,
      getCheckout: async orderId => (await status({ orderId })).data,
    },
  });
}
