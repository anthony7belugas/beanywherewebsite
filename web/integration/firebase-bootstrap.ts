import { analyticsContext } from "../storefront/analytics.js";
import type { Acquisition } from "../storefront/acquisition.js";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, getIdTokenResult, indexedDBLocalPersistence, setPersistence,
  signInWithCustomToken } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { studioCallable } from "./studio-callable";
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
  appCheck ??= initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(config.appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  const auth = getAuth(app);
  // Local storage, saved sign-in and browser attestation are independent. Finish
  // all three before contacting the admission service, without serial waits.
  const [secret] = await Promise.all([
    browserIdentity(),
    getToken(appCheck),
    (async () => {
      await setPersistence(auth, indexedDBLocalPersistence);
      await auth.authStateReady();
    })(),
  ]);
  // No anonymous-auth, debug-token, or unenforced fallback when attestation is unavailable.
  const existingUser = auth.currentUser;
  const functions = getFunctions(app, config.functionsRegion);
  const response = await studioCallable<{ secret: string; reuseExistingAuth: boolean },
    WebSession & { customToken?: string; reuseExistingAuth?: true }>(
    functions, "authWithWebSession", 30000,
  )({ secret, reuseExistingAuth: !!existingUser });
  const session = response.data;
  if (!validWebSession(session) || session.webAppId !== config.firebase.appId) {
    throw new Error("The studio could not verify your browser session.");
  }
  let user;
  if (session.reuseExistingAuth === true) {
    if (!existingUser || auth.currentUser !== existingUser || existingUser.uid !== session.uid) {
      throw new Error("The studio could not verify your sign-in.");
    }
    user = existingUser;
  } else {
    if (typeof session.customToken !== "string" || !session.customToken) {
      throw new Error("The studio could not verify your browser session.");
    }
    ({ user } = await signInWithCustomToken(auth, session.customToken));
  }
  const token = await getIdTokenResult(user);
  if (auth.currentUser !== user || !admittedWebClaims(user.uid, token.claims, session)) {
    throw new Error("The studio could not verify your sign-in.");
  }
  const create = studioCallable<{ orderId: string; email: string; attribution?: Acquisition; analytics?: ReturnType<typeof analyticsContext> }, WebCheckout>(
    functions, "createWebCheckout", 95000,
  );
  const status = studioCallable<{ orderId: string }, WebCheckout>(
    functions, "getWebCheckoutStatus", 25000,
  );
  const cancel = studioCallable<{ orderId: string }, WebCheckout>(
    functions, "cancelWebCheckout", 95000,
  );
  return createFirebaseAdapter({
    auth, appCheck, functions, db: getFirestore(app), storage: getStorage(app),
    session: { uid: session.uid, webAppId: session.webAppId, capabilityVersion: 1 },
    checkoutOrigins: ["https://checkout.stripe.com"],
    payments: {
      createCheckout: async (orderId, email, attribution) => (await create({ orderId, email, ...(attribution ? { attribution } : {}), analytics:analyticsContext() })).data,
      getCheckout: async orderId => (await status({ orderId })).data,
      cancelCheckout: async orderId => (await cancel({ orderId })).data,
    },
  });
}
