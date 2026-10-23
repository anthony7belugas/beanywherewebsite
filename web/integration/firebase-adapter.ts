import { analyticsContext } from "../storefront/analytics.js";
import type { Acquisition } from "../storefront/acquisition.js";
/**
 * SDK operations bound to one server-admitted browser session. Native identities
 * cannot be used by this adapter, even when signed into the same Firebase project.
 */
import { type Auth, getIdTokenResult, onIdTokenChanged } from "firebase/auth";
import { type Functions } from "firebase/functions";
import { studioCallable } from "./studio-callable";
import {
  type Firestore,
  collection,
  doc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  type FirebaseStorage,
  ref,
  uploadBytesResumable,
  getBlob,
  getMetadata,
} from "firebase/storage";
import type { AppCheck } from "firebase/app-check";
import { getToken } from "firebase/app-check";
import type { Pack, Styling, CheckoutCode, ComplimentaryCheckout } from "../src/lib/types";
import { admittedWebClaims, validWebSession, type WebSession } from "./web-session";
export type { WebSession } from "./web-session";

export type NativeJobProjection = {
  uid: string;
  packId: string;
  styling: Styling;
  styleId: string;
  clientVisible: boolean;
  accountDeleted?: boolean;
  deletedByUser?: boolean;
  refundOutputAccessRevoked?: boolean;
  status: string;
  generationState?: string;
  retryWindowEndsAtMs?: number;
  deliveryClosedAt?: unknown;
  deliveryClosed?: boolean;
  reshootsClosedReason?: string;
  emailRequestState?: string;
  emailDeliveryOutcomeUnknown?: boolean;
  emailDeliveryFeedback?: string;
  emailDeliveryFeedbackRequestId?: string;
  emailLatestRequestId?: string;
  emailRequestTo?: string;
  deliveryEmail?: string;
  manualRetriesPerSlot?: number;
  retriesClosedReason?: string;
  generationLimitReached?: boolean;
  automaticWorkPending?: boolean;
  recovering?: boolean;
  generationClaimId?: string;
  recoveryClaimId?: string;
  orderId?: string;
  reshootsLeft: number;
  readableOutputPaths?: string[];
  slots: {
    slotId: string;
    sceneId: string;
    take: number;
    status: string;
    path?: string;
    failureClass?: string;
    reshooting?: boolean;
    retrying?: boolean;
    hasActiveClaim?: boolean;
    manualAttempts?: number;
    claimId?: string;
    prevPath?: string;
  }[];
  createdAt?: { seconds: number };
};
export type GalleryPage = { email: string; jobs: (NativeJobProjection & { id: string })[]; nextCursor: string | null };
export type UploadSession = {
  sessionId: string;
  fullPaths: string[];
  thumbPaths: string[];
  expiresAtMs: number;
  uploadStatus: "open" | "finalizing" | "completed";
  replayed?: boolean;
};
export type ReshootOperation = {
  schemaVersion: 1;
  uid: string;
  jobId: string;
  slotId: string;
  previousPath: string;
  operationId: string;
};
export type WebCheckout = {
  orderId: string;
  checkoutId: string | null;
  checkoutUrl: string | null;
  state: "creating" | "open" | "paid" | "fulfilled" | "expired" | "refunded" | "needs-support";
  jobId: string | null;
  amountMinor: number;
  currency: "usd";
};
export interface WebPayments {
  /** The server owns checkout idempotency, prices, and the payment verdict. */
  createCheckout(orderId: string, email: string, attribution?: Acquisition): Promise<WebCheckout>;
  getCheckout(orderId: string): Promise<WebCheckout>;
  cancelCheckout(orderId: string): Promise<WebCheckout>;
}
export type AdapterDependencies = {
  auth: Auth;
  db: Firestore;
  functions: Functions;
  storage: FirebaseStorage;
  appCheck: AppCheck;
  session: WebSession;
  payments: WebPayments;
  /** Explicit HTTPS origins approved for the selected future payment provider. No wildcards. */
  checkoutOrigins: readonly string[];
};
const documentId = (id: string) => {
  if (typeof id !== "string" || !/^[A-Za-z0-9_:-]{1,128}$/.test(id))
    throw new Error("Invalid record identifier.");
  return id;
};
export function readableJob(
  data: NativeJobProjection | undefined,
  uid: string,
): data is NativeJobProjection {
  return (
    !!data &&
    data.uid === uid &&
    data.clientVisible === true &&
    !data.deletedByUser &&
    !data.accountDeleted &&
    !data.refundOutputAccessRevoked
  );
}
export function authorizedOutput(
  job: NativeJobProjection,
  uid: string,
  path: string,
  jobId: string,
) {
  return (
    readableJob(job, uid) &&
    path.startsWith(`outputs/${uid}/${jobId}/`) &&
    !path.includes("..") &&
    path.split("/").length === 4 &&
    path.split("/").every(Boolean) &&
    job.readableOutputPaths?.includes(path) === true &&
    job.slots.some((s) => s.status === "done" && s.path === path)
  );
}

export function createFirebaseAdapter(deps: AdapterDependencies) {
  const { auth, db, functions, storage, appCheck, session, payments } = deps;
  if (!validWebSession(session))
    throw new Error("A verified web-capable backend is required.");
  // Bind this adapter to one admitted auth session. Recreate it after sign-in.
  const admittedUser = auth.currentUser;
  let invalidated = false;
  const teardown = new Set<() => void>();
  function invalidate() {
    invalidated = true;
    for (const stop of [...teardown]) {
      try {
        stop();
      } catch {
        /* A consumer callback must not prevent other privacy cleanup. */
      }
    }
    teardown.clear();
  }
  function assertSession(signal?: AbortSignal) {
    if (signal?.aborted) throw new Error("Upload cancelled.");
    if (
      invalidated ||
      !admittedUser ||
      auth.currentUser !== admittedUser ||
      admittedUser.uid !== session.uid
    ) {
      invalidate();
      throw new Error("The account changed. Sign in again before continuing.");
    }
  }
  // Same-user token refreshes can revoke admission without a sign-out event.
  const stopAuth = onIdTokenChanged(auth, (user) => {
    if (user !== admittedUser || user?.uid !== session.uid) {
      invalidate();
      return;
    }
    void checkAdmission().catch(() => invalidate());
  });
  async function checkAdmission(signal?: AbortSignal) {
    assertSession(signal);
    const token = await getIdTokenResult(admittedUser!);
    assertSession(signal);
    if (
      !admittedWebClaims(admittedUser!.uid, token.claims, session)
    ) {
      invalidate();
      throw new Error(
        "This session has not been admitted by the BeAnywhere identity service.",
      );
    }
  }
  async function ready(signal?: AbortSignal) {
    await checkAdmission(signal);
    await getToken(appCheck);
    assertSession(signal);
  }
  async function call<T>(
    name: string,
    data: unknown,
    timeout = 120000,
    signal?: AbortSignal,
  ) {
    await ready(signal);
    assertSession(signal);
    const result = await studioCallable<unknown, T>(functions, name, timeout)(data);
    assertSession(signal);
    return result.data;
  }
  function validateCheckout(result: WebCheckout, orderId: string): WebCheckout {
    if (!result || result.orderId !== orderId ||
        !["creating", "open", "paid", "fulfilled", "expired", "refunded", "needs-support"].includes(result.state) ||
        !Number.isSafeInteger(result.amountMinor) || result.amountMinor < 50 || result.currency !== "usd" ||
        !(result.checkoutId === null || /^cs_(test|live)_[A-Za-z0-9]+$/.test(result.checkoutId)) ||
        !(result.jobId === null || (typeof result.jobId === "string" && /^[A-Za-z0-9_:-]{1,128}$/.test(result.jobId))) ||
        (result.state === "fulfilled" && !result.jobId)) {
      throw new Error("Checkout does not match this order.");
    }
    if (result.checkoutUrl !== null) {
      if (typeof result.checkoutUrl !== "string" || result.state !== "open" || !result.checkoutId) {
        throw new Error("Checkout does not match this order.");
      }
      const destination = new URL(result.checkoutUrl);
      if (destination.protocol !== "https:" || destination.username || destination.password ||
          !deps.checkoutOrigins.includes(destination.origin)) {
        throw new Error("This checkout destination is not approved.");
      }
    }
    return result;
  }
  return {
    session: { uid: session.uid, webAppId: session.webAppId, capabilityVersion: 1 as const },
    /** Required on session teardown/unmount. Clears subscriptions and cancels uploads. */
    dispose() {
      stopAuth();
      invalidate();
    },
    async recordEvent(name: string, params: Record<string, string | number | boolean>, eventId: string, occurredAtMs = Date.now(), context?: import("../storefront/analytics.js").AnalyticsContext) {
      return call<{ disposition?: string }>("recordClientEvent", { name, params, eventId, expectedUid: session.uid,
        occurredAtMs, ...(context?.enabled ? { context } : {}) }, 10000);
    },
    getAnalyticsProfile() { return call<{analyticsAvailable:boolean;analytics:boolean;preferenceRevisions:{analytics:number}}>("getLaunchProfile",{}); },
    setAnalyticsPreference(enabled:boolean, revision:number) { return call<{applied:boolean;analytics:boolean;preferenceRevisions:{analytics:number}}>("setLaunchPreferences",{analytics:enabled,expectedUid:session.uid,noticeVersion:2,expectedRevisions:{analytics:revision}}); },
    recordWebObservation(data:Record<string,unknown>) { return call<{disposition?:string}>("recordWebObservation",data,10000); },
    async catalog(): Promise<Pack[]> {
      await ready();
      assertSession();
      const snapshot = await getDocs(collection(db, "packs"));
      assertSession();
      return snapshot.docs
        .filter((d) => d.data().active !== false)
        .map((d) => {
          const p = d.data();
          return {
            packId: d.id,
            title: String(p.title),
            tagline: String(p.tagline),
            productId: String(p.productId),
            sort: Number(p.sort) || 0,
            stripVersion: Number(p.stripVersion) || 1,
            scenes: p.scenes.map((s: { sceneId: string; label: string }) => ({
              sceneId: s.sceneId,
              label: s.label,
            })),
            styleDirections: p.styleDirections,
          };
        })
        .sort((a, b) => a.sort - b.sort);
    },
    checkPackReadiness(packId: string, styling: Styling, styleId: string) {
      return call<{ ok: boolean; reason?: string; productId?: string }>(
        "checkPackReadiness",
        { packId: documentId(packId), styling, styleId: documentId(styleId) },
      );
    },
    async recordConsent(styling: Styling, wearsGlasses: boolean) {
      await ready();
      assertSession();
      await setDoc(
        doc(db, "users", session.uid),
        {
          consentAt: serverTimestamp(),
          consentVersion: 1,
          styling,
          wearsGlasses,
        },
        { merge: true },
      );
      assertSession();
    },
    async uploadReferences(
      files: Blob[],
      attemptId: string,
      wearsGlasses: boolean,
      onProgress: (value: number) => void,
      signal?: AbortSignal,
    ): Promise<UploadSession> {
      assertSession(signal);
      if (
        files.length < 4 ||
        files.length > 6 ||
        files.some(
          (f) =>
            f.type !== "image/jpeg" ||
            f.size < 1024 ||
            f.size >= 8 * 1024 * 1024,
        )
      )
        throw new Error("Prepare 4–6 JPEG files of 1 KB–8 MB each.");
      if (!/^[A-Za-z0-9_-]{16,128}$/.test(attemptId))
        throw new Error("Persist a valid upload attempt ID before starting.");
      const upload = await call<UploadSession>(
        "createReferenceUploadSession",
        {
          count: files.length,
          clientAttemptId: attemptId,
          wearsGlasses,
        },
        120000,
        signal,
      );
      if (
        !upload ||
        !/^[A-Za-z0-9_-]{1,128}$/.test(upload.sessionId) ||
        !Number.isFinite(upload.expiresAtMs) ||
        upload.expiresAtMs <= Date.now() ||
        !["open", "finalizing", "completed"].includes(upload.uploadStatus) ||
        !Array.isArray(upload.fullPaths) ||
        !Array.isArray(upload.thumbPaths) ||
        upload.thumbPaths.length !== files.length ||
        upload.thumbPaths.some(
          (p, i) =>
            p !== `refs/${session.uid}/${upload.sessionId}/${i}_thumb.jpg`,
        ) ||
        upload.fullPaths.length !== files.length ||
        upload.fullPaths.some(
          (p, i) => p !== `refs/${session.uid}/${upload.sessionId}/${i}.jpg`,
        )
      )
        throw new Error("Unexpected upload destination.");
      if (upload.uploadStatus === "finalizing") {
        throw new Error("Your photos are still being checked. Try again shortly.");
      }
      // Two transfers overlap network waits without flooding mobile connections.
      // On any failure, cancel and await the other transfer before allowing retry.
      const fractions = files.map(() => 0);
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      const reportProgress = () => onProgress(fractions.reduce((sum, fraction, i) =>
        sum + fraction * files[i].size, 0) / totalBytes);
      const alreadyUploaded = async (i: number) => {
        assertSession(signal);
        try {
          const metadata = await getMetadata(ref(storage, upload.fullPaths[i]));
          assertSession(signal);
          if (metadata.fullPath !== upload.fullPaths[i] || metadata.size !== files[i].size ||
              metadata.contentType !== "image/jpeg") {
            throw new Error("A saved selfie does not match this upload. Edit your selfies before trying again.");
          }
          return true;
        } catch (error) {
          assertSession(signal);
          if ((error as { code?: string }).code === "storage/object-not-found") return false;
          throw error;
        }
      };
      const active = new Set<() => void>();
      let cursor = 0, failed = false;
      let failure: unknown;
      const uploadNext = async () => {
        while (upload.uploadStatus === "open" && cursor < files.length && !failed) {
          const i = cursor++;
          try {
            await ready(signal);
            assertSession(signal);
            if (failed) return;
            // Objects are create-only. A replay must reuse acknowledged files,
            // including those completed before another transfer failed.
            if (upload.replayed && await alreadyUploaded(i)) {
              fractions[i] = 1;
              if (!failed) reportProgress();
              continue;
            }
            if (failed) return;
            const task = uploadBytesResumable(ref(storage, upload.fullPaths[i]), files[i],
              { contentType: "image/jpeg", cacheControl: "private,max-age=86400" });
            let cancelled = false;
            const abort = () => { if (!cancelled) { cancelled = true; task.cancel(); } };
            active.add(abort); teardown.add(abort);
            signal?.addEventListener("abort", abort, { once: true });
            try {
              await new Promise<void>((resolve, reject) => task.on("state_changed", s => {
                if (!signal?.aborted && !invalidated && !failed && auth.currentUser === admittedUser) {
                  fractions[i] = s.bytesTransferred / s.totalBytes;
                  reportProgress();
                }
              }, reject, resolve));
            } catch (error) {
              // Another tab, or a lost success reply, may have completed this
              // immutable object. Confirm it exists before accepting that result.
              assertSession(signal);
              if (!['storage/unauthorized', 'storage/retry-limit-exceeded', 'storage/unknown']
                .includes((error as { code?: string }).code || '') || !await alreadyUploaded(i)) throw error;
            } finally {
              signal?.removeEventListener("abort", abort);
              active.delete(abort); teardown.delete(abort);
            }
            assertSession(signal);
            if (!failed) {
              fractions[i] = 1;
              reportProgress();
            }
          } catch (error) {
            if (!failed) {
              failed = true; failure = error;
              for (const abort of active) abort();
            }
          }
        }
      };
      await Promise.all([uploadNext(), uploadNext()]);
      if (failed) throw failure;
      // Completed sessions are immutable; retries skip rewriting their files.
      onProgress(1);
      const result = await call<{ completed: boolean; fullPaths: string[] }>(
        "finalizeReferenceUploadSession",
        { sessionId: upload.sessionId },
        120000,
        signal,
      );
      if (!result.completed)
        throw new Error(
          "Reference validation is still pending. Retry with the same upload attempt ID.",
        );
      if (
        !Array.isArray(result.fullPaths) ||
        result.fullPaths.length !== files.length ||
        result.fullPaths.some((path, i) => path !== upload.fullPaths[i])
      )
        throw new Error("Reference validation returned unexpected photos.");
      await call(
        "commitReferenceMetadata",
        { sessionId: upload.sessionId },
        120000,
        signal,
      );
      onProgress(1);
      return { ...upload, uploadStatus: "completed" as const };
    },
    createOrder(input: {
      packId: string;
      productId: string;
      styleId: string;
      styling: Styling;
      wearsGlasses: boolean;
      uploadSessionId: string;
    }) {
      return call<{ orderId: string }>("createOrder", input);
    },
    getWebCheckoutCode(checkoutKey: string) {
      return call<CheckoutCode | null>("getWebCheckoutCode", { checkoutKey });
    },
    claimWebCheckoutCode(checkoutKey: string, code: string) {
      return call<CheckoutCode>("claimWebCheckoutCode", { checkoutKey, code });
    },
    async startWebComplimentaryCheckout(checkoutKey: string, orderId: string, email: string) {
      const result = await call<ComplimentaryCheckout>("startWebComplimentaryCheckout", { checkoutKey, orderId, email }, 95000);
      if (result?.kind !== "complimentary" || result.orderId !== orderId
          || typeof result.jobId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(result.jobId)) {
        throw new Error("Your complimentary photoshoot could not be verified. Try again.");
      }
      return result;
    },
    async beginWebCheckout(orderId: string, email: string, attribution?: Acquisition) {
      if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("Enter a valid delivery email address.");
      if (!deps.checkoutOrigins?.length)
        throw new Error("Approved checkout origins must be configured first.");
      await ready();
      assertSession();
      const result = await payments.createCheckout(
        documentId(orderId),
        email,
        attribution,
      );
      assertSession();
      return validateCheckout(result, orderId);
    },
    async reconcileWebCheckout(orderId: string) {
      await ready();
      assertSession();
      const result = await payments.getCheckout(documentId(orderId));
      assertSession();
      return validateCheckout(result, orderId);
    },
    async cancelWebCheckout(orderId: string) {
      await ready();
      assertSession();
      const result = await payments.cancelCheckout(documentId(orderId));
      assertSession();
      return validateCheckout(result, orderId);
    },
    async watchJob(
      jobId: string,
      next: (job: NativeJobProjection | null) => void,
      error: (error: Error) => void,
    ) {
      await ready();
      assertSession();
      let stopped = false;
      let stopSnapshot = () => {};
      const stop = () => {
        if (stopped) return;
        stopped = true;
        stopSnapshot();
        teardown.delete(stop);
        next(null);
      };
      teardown.add(stop);
      stopSnapshot = onSnapshot(
        doc(db, "jobs", documentId(jobId)),
        (snapshot) => {
          if (stopped) return;
          try {
            assertSession();
            const data = snapshot.data() as NativeJobProjection | undefined;
            next(readableJob(data, session.uid) ? data : null);
          } catch (e) {
            stop();
            error(e as Error);
          }
        },
        (e) => {
          if (!stopped) {
            stop();
            error(e);
          }
        },
      );
      if (stopped) stopSnapshot();
      return stop;
    },
    recoverGalleries(email: string) {
      return call<GalleryPage>("recoverWebGalleries", { email, analytics:analyticsContext(),eventId:crypto.randomUUID() });
    },
    listWebGalleries(cursor?: string) {
      return call<GalleryPage>("listWebGalleries", cursor ? { cursor } : {});
    },
    async galleryPhoto(jobId: string, path: string) {
      const result = await call<{ base64: string; contentType: string }>("getWebGalleryPhoto",
        { jobId: documentId(jobId), path }, 60000);
      if (result.contentType !== "image/jpeg" || typeof result.base64 !== "string") throw new Error("Photo unavailable.");
      const bytes = Uint8Array.from(atob(result.base64), c => c.charCodeAt(0));
      return new Blob([bytes], { type: "image/jpeg" });
    },
    async assertGalleryPhotos(jobId: string, paths: string[]) {
      await call("assertWebGalleryPhotos", { jobId: documentId(jobId), paths });
    },
    async listJobs() {
      await ready();
      assertSession();
      const result = await getDocs(
        query(
          collection(db, "jobs"),
          where("uid", "==", session.uid),
          where("clientVisible", "==", true),
          orderBy("createdAt", "desc"),
          limit(100),
        ),
      );
      assertSession();
      return result.docs
        .map((d) => ({ ...(d.data() as NativeJobProjection), id: d.id }))
        .filter((j) => readableJob(j, session.uid))
        .sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
    },
    async watchJobs(next: (jobs: (NativeJobProjection & { id: string })[]) => void, error: (error: Error) => void) {
      await ready();
      assertSession();
      let stopped = false;
      let stopSnapshot = () => {};
      const stop = () => {
        if (stopped) return;
        stopped = true;
        stopSnapshot();
        teardown.delete(stop);
        next([]);
      };
      teardown.add(stop);
      stopSnapshot = onSnapshot(query(collection(db, "jobs"), where("uid", "==", session.uid),
        where("clientVisible", "==", true), orderBy("createdAt", "desc"), limit(100)), snapshot => {
        if (stopped) return;
        try {
          assertSession();
          next(snapshot.docs.map(d => ({ ...(d.data() as NativeJobProjection), id: d.id }))
            .filter(job => readableJob(job, session.uid)));
        } catch (e) { stop(); error(e as Error); }
      }, e => { if (!stopped) { stop(); error(e); } });
      if (stopped) stopSnapshot();
      return stop;
    },
    async assertPhotos(jobId: string, paths: string[]) {
      await ready();
      const fresh = (await getDocFromServer(doc(db, "jobs", documentId(jobId)))).data() as NativeJobProjection;
      assertSession();
      if (!fresh || !paths.length || !paths.every(path => authorizedOutput(fresh, session.uid, path, jobId))) {
        throw new Error("These photos are no longer available. Refresh your gallery.");
      }
    },
    async download(jobId: string, path: string) {
      await ready();
      assertSession();
      const snapshot = await getDocFromServer(
        doc(db, "jobs", documentId(jobId)),
      );
      assertSession();
      const job = snapshot.data() as NativeJobProjection;
      if (!job || !authorizedOutput(job, session.uid, path, jobId))
        throw new Error("This photo is no longer available.");
      const blob = await getBlob(ref(storage, path), 20 * 1024 * 1024);
      await ready();
      assertSession();
      const fresh = (
        await getDocFromServer(doc(db, "jobs", jobId))
      ).data() as NativeJobProjection;
      assertSession();
      if (!fresh || !authorizedOutput(fresh, session.uid, path, jobId))
        throw new Error("Photo access changed while downloading.");
      return blob;
    },
    reshoot(operation: ReshootOperation) {
      if (operation.uid !== session.uid) throw new Error("Account mismatch.");
      return call("reshootSlot", operation, 180000);
    },
    reshootStatus(operation: ReshootOperation) {
      if (operation.uid !== session.uid) throw new Error("Account mismatch.");
      return call("getReshootOperationStatus", operation, 15000);
    },
    retrySlot(jobId: string, slotId: string) {
      return call(
        "retrySlot",
        { jobId: documentId(jobId), slotId: documentId(slotId) },
        180000,
      );
    },
    /** Existing endpoint deletes all user photos, not one job. Do not map the demo's per-shoot deletion to it. */
    deleteAllPhotos() {
      return call("deleteMyPhotos", {});
    },
  };
}
