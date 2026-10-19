import type { Acquisition } from "../storefront/acquisition.js";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, getIdTokenResult, indexedDBLocalPersistence, setPersistence,
  signInWithCustomToken } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { createFirebaseAdapter, type WebCheckout } from "./firebase-adapter";
import { browserIdentity } from "./browser-identity";
import { admittedWebClaims, validWebSession, type WebSession } from "./web-session";

import { validateStudioFirebaseConfig, type StudioFirebaseConfig } from "./studio-config";
export { validateStudioFirebaseConfig, type StudioFirebaseConfig } from "./studio-config";

/** Deliberately named: the web app cannot adopt an existing default/native Firebase auth store. */
const APP_NAME = "beanywhere-web-studio";
let pending: Promise<ReturnType<typeof createFirebaseAdapter>> | undefined;
let startedConfig: string | undefined;
let appCheck: ReturnType<typeof initializeAppCheck> | undefined;

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
  const create = httpsCallable<{ orderId: string; email: string; attribution?: Acquisition }, WebCheckout>(
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
      createCheckout: async (orderId, email, attribution) => (await create({ orderId, email, ...(attribution ? { attribution } : {}) })).data,
      getCheckout: async orderId => (await status({ orderId })).data,
    },
  });
}
