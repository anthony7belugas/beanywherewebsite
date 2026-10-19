import type { FirebaseOptions } from "firebase/app";

export type StudioFirebaseConfig = {
  firebase: FirebaseOptions;
  appCheckSiteKey: string;
  functionsRegion: string;
};

export function validateStudioFirebaseConfig(config: StudioFirebaseConfig) {
  if (config.firebase.projectId !== "bethere-3d7de" ||
      config.firebase.appId !== "1:151223255006:web:7313193eb6302e7582674f" ||
      config.firebase.authDomain !== "bethere-3d7de.firebaseapp.com" ||
      !/^AIza[A-Za-z0-9_-]+$/.test(config.firebase.apiKey || "") ||
      !["bethere-3d7de.firebasestorage.app", "bethere-3d7de.appspot.com"].includes(config.firebase.storageBucket || "") ||
      !/^[A-Za-z0-9_-]{20,200}$/.test(config.appCheckSiteKey || "") ||
      config.functionsRegion !== "us-central1") {
    throw new Error("The web studio connection is not configured yet.");
  }
}

export function studioConfigFromEnv(env: Record<string, string | undefined>): StudioFirebaseConfig {
  return { firebase: { apiKey: env.VITE_FIREBASE_API_KEY, appId: env.VITE_FIREBASE_APP_ID,
    projectId: env.VITE_FIREBASE_PROJECT_ID, authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET },
  appCheckSiteKey: env.VITE_APP_CHECK_SITE_KEY || "", functionsRegion: "us-central1" };
}

/** A deployment build cannot silently fall back to the disconnected demonstration. */
export function validateStudioBuild(command: string, mode: string, env: Record<string, string | undefined>) {
  if (command === "build" && mode !== "draft" && env.VITE_STUDIO_MODE !== "live") {
    throw new Error("Production builds require VITE_STUDIO_MODE=live and verified Firebase settings. Use build:draft for a disconnected preview.");
  }
  if (mode === "draft" && env.VITE_STUDIO_MODE === "live") {
    throw new Error("A draft build cannot connect to live services.");
  }
  if (env.VITE_STUDIO_MODE === "live") validateStudioFirebaseConfig(studioConfigFromEnv(env));
}

export function studioCsp(live: boolean, dev: boolean) {
  const development = dev ? " ws://127.0.0.1:4178 ws://localhost:4178" : "";
  const script = live ? " https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/" : "";
  const connect = live ? " https://content-firebaseappcheck.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://us-central1-bethere-3d7de.cloudfunctions.net https://www.google.com/recaptcha/" : "";
  return `default-src 'self'; script-src 'self'${script}; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'${connect}${development}; frame-src ${live ? "https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/" : "'none'"}; object-src 'none'; base-uri 'self'; form-action 'none'${dev ? "" : "; upgrade-insecure-requests"}`;
}
