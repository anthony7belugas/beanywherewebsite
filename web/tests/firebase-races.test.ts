import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFirebaseAdapter,
  type AdapterDependencies,
  type NativeJobProjection,
} from "../integration/firebase-adapter";

const m = vi.hoisted(() => ({
  token: vi.fn(),
  appCheck: vi.fn(),
  authListener: vi.fn(),
  call: vi.fn(),
  callable: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  upload: vi.fn(),
  getBlob: vi.fn(),
  metadata: vi.fn(),
  orderBy: vi.fn(),
  stopSnapshot: vi.fn(),
  stopAuth: vi.fn(),
  createCheckout: vi.fn(),
  getCheckout: vi.fn(),
}));
vi.mock("firebase/auth", () => ({
  getIdTokenResult: m.token,
  onIdTokenChanged: m.authListener,
}));
vi.mock("firebase/app-check", () => ({ getToken: m.appCheck }));
vi.mock("firebase/functions", () => ({ httpsCallable: m.callable }));
vi.mock("firebase/firestore", () => ({
  doc: (_db: unknown, ...parts: string[]) => parts.join("/"),
  collection: vi.fn(),
  getDocs: m.getDocs,
  getDocFromServer: m.getDoc,
  onSnapshot: m.onSnapshot,
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  orderBy: m.orderBy,
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));
vi.mock("firebase/storage", () => ({
  ref: (_s: unknown, path: string) => path,
  uploadBytesResumable: m.upload,
  getBlob: m.getBlob,
  getMetadata: m.metadata,
}));

const job: NativeJobProjection = {
  uid: "w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  packId: "paris",
  styling: "w",
  styleId: "casual",
  clientVisible: true,
  status: "done",
  reshootsLeft: 3,
  readableOutputPaths: ["outputs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/j/photo.jpg"],
  slots: [
    {
      slotId: "s0",
      sceneId: "s0",
      take: 1,
      status: "done",
      path: "outputs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/j/photo.jpg",
    },
  ],
};
const uploadSession = () => ({
  sessionId: "s",
  uploadStatus: "open",
  fullPaths: [0, 1, 2, 3].map((i) => `refs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/s/${i}.jpg`),
  thumbPaths: [0, 1, 2, 3].map((i) => `refs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/s/${i}_thumb.jpg`),
  expiresAtMs: Date.now() + 60000,
});
const files = () =>
  Array.from(
    { length: 4 },
    () => new Blob([new Uint8Array(2048)], { type: "image/jpeg" }),
  );
const attempt = "persistent-attempt-123";
let auth: { currentUser: { uid: string } | null };
let authChanged: (user: { uid: string } | null) => void;
let snapshot: (value: { data: () => NativeJobProjection }) => void;
let cancel: ReturnType<typeof vi.fn>;
let finishUpload: () => void;
function changeAccount() {
  auth.currentUser = null;
  authChanged?.(null);
}
function adapter(checkoutOrigins = ["https://checkout.example.test"]) {
  return createFirebaseAdapter({
    auth,
    db: {},
    storage: {},
    functions: {},
    appCheck: {},
    session: { uid: "w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", webAppId: "1:151223255006:web:7313193eb6302e7582674f", capabilityVersion: 1 },
    payments: { createCheckout: m.createCheckout, getCheckout: m.getCheckout },
    checkoutOrigins,
  } as unknown as AdapterDependencies);
}
beforeEach(() => {
  vi.resetAllMocks();
  auth = { currentUser: { uid: "w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" } };
  authChanged = () => {};
  m.authListener.mockImplementation((_a, cb) => {
    authChanged = cb;
    return m.stopAuth;
  });
  m.token.mockResolvedValue({
    claims: { platform: "web", webAppId: "1:151223255006:web:7313193eb6302e7582674f", webSessionHandle: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", deviceRestricted: false, deviceHandle: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" },
  });
  m.appCheck.mockResolvedValue({ token: "test" });
  m.callable.mockImplementation(
    (_f, name) => (data: any) => name === "webStudio" ? m.call(data.operation, data.input) : m.call(name, data),
  );
  m.call.mockImplementation(async (name: string) => ({
    data:
      name === "createReferenceUploadSession"
        ? uploadSession()
        : { completed: true, fullPaths: uploadSession().fullPaths },
  }));
  m.getDocs.mockResolvedValue({ docs: [{ id: "j", data: () => job }] });
  m.getDoc.mockResolvedValue({ data: () => job });
  m.getBlob.mockResolvedValue(new Blob(["sample"]));
  m.metadata.mockRejectedValue(Object.assign(new Error("Not uploaded"), { code: "storage/object-not-found" }));
  m.onSnapshot.mockImplementation((_ref, cb) => {
    snapshot = cb;
    return m.stopSnapshot;
  });
  m.upload.mockImplementation(() => {
    let failure: (error: Error) => void;
    cancel = vi.fn(() => {
      failure(new Error("Upload cancelled."));
      return true;
    });
    return {
      cancel,
      on: (
        _event: string,
        _progress: unknown,
        reject: typeof failure,
        done: () => void,
      ) => {
        failure = reject;
        finishUpload = done;
        return () => {};
      },
    };
  });
});

describe("staged Firebase session and cancellation boundaries (all SDK calls mocked)", () => {
  it("does not start a callable if the account changes during App Check", async () => {
    m.appCheck.mockImplementation(async () => {
      changeAccount();
      return {};
    });
    await expect(
      adapter().checkPackReadiness("paris", "w", "casual"),
    ).rejects.toThrow();
    expect(m.call).not.toHaveBeenCalled();
  });
  it("does not return a job list fetched for a signed-out account", async () => {
    m.getDocs.mockImplementation(async () => {
      changeAccount();
      return { docs: [{ id: "j", data: () => job }] };
    });
    await expect(adapter().listJobs()).rejects.toThrow();
  });
  it("clears a watched gallery immediately on sign-out, without waiting for a database update", async () => {
    const next = vi.fn();
    await adapter().watchJob("j", next, vi.fn());
    snapshot({ data: () => job });
    expect(next).toHaveBeenLastCalledWith(job);
    changeAccount();
    expect(next).toHaveBeenLastCalledWith(null);
    expect(m.stopSnapshot).toHaveBeenCalledOnce();
  });
  it("does not allocate an upload session when already cancelled", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      adapter().uploadReferences(
        files(),
        attempt,
        false,
        vi.fn(),
        controller.signal,
      ),
    ).rejects.toThrow();
    expect(m.call).not.toHaveBeenCalled();
  });
  it("does not start upload when cancellation happens during its auth check", async () => {
    const controller = new AbortController();
    m.appCheck.mockResolvedValueOnce({}).mockImplementationOnce(async () => {
      controller.abort();
      return {};
    });
    const result = adapter().uploadReferences(
      files(),
      attempt,
      false,
      vi.fn(),
      controller.signal,
    );
    // The old implementation hangs here by subscribing after the abort event.
    await expect(
      Promise.race([
        result,
        new Promise((resolve) =>
          setTimeout(() => resolve("not-cancelled"), 50),
        ),
      ]),
    ).rejects.toThrow();
    expect(m.upload).not.toHaveBeenCalled();
  });
  it("cancels an active upload on sign-out and never finalizes it", async () => {
    const result = adapter().uploadReferences(files(), attempt, false, vi.fn());
    const rejected = expect(result).rejects.toThrow();
    await vi.waitFor(() => expect(m.upload).toHaveBeenCalledTimes(2));
    changeAccount();
    expect(cancel).toHaveBeenCalledOnce();
    await rejected;
    expect(m.call.mock.calls.map((c) => c[0])).toEqual([
      "createReferenceUploadSession",
    ]);
  });
  it("does not finalize after cancellation at the last upload completion", async () => {
    const controller = new AbortController();
    m.upload.mockImplementation(() => ({
      cancel: vi.fn(),
      on: (_e: string, _p: unknown, _err: unknown, done: () => void) => {
        if (m.upload.mock.calls.length === 4) controller.abort();
        done();
        return () => {};
      },
    }));
    await expect(
      adapter().uploadReferences(
        files(),
        attempt,
        false,
        vi.fn(),
        controller.signal,
      ),
    ).rejects.toThrow();
    expect(m.call.mock.calls.map((c) => c[0])).toEqual([
      "createReferenceUploadSession",
    ]);
  });
  it("does not release downloaded bytes if the account changes during the final access check", async () => {
    m.getDoc
      .mockResolvedValueOnce({ data: () => job })
      .mockImplementationOnce(async () => {
        changeAccount();
        return { data: () => job };
      });
    await expect(
      adapter().download("j", "outputs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/j/photo.jpg"),
    ).rejects.toThrow();
  });
  it("rejects a path from another job even if an inconsistent projection lists it", async () => {
    await expect(
      adapter().download("other-job", "outputs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/j/photo.jpg"),
    ).rejects.toThrow();
    expect(m.getBlob).not.toHaveBeenCalled();
  });
  it("orders the server query before limiting the gallery to its newest 100 jobs", async () => {
    await adapter().listJobs();
    expect(m.orderBy).toHaveBeenCalledWith("createdAt", "desc");
  });
});

it("completes a valid reference upload and commits exactly its verified session", async () => {
  m.upload.mockImplementation(() => ({
    cancel: vi.fn(),
    on: (
      _event: string,
      progress: (p: { bytesTransferred: number; totalBytes: number }) => void,
      _reject: unknown,
      done: () => void,
    ) => {
      progress({ bytesTransferred: 2048, totalBytes: 2048 });
      done();
      return () => {};
    },
  }));
  const progress = vi.fn();
  const api = adapter();
  const result = await api.uploadReferences(files(), attempt, false, progress);
  expect(result.fullPaths).toEqual(uploadSession().fullPaths);
  expect(m.call.mock.calls.map((c) => c[0])).toEqual([
    "createReferenceUploadSession",
    "finalizeReferenceUploadSession",
    "commitReferenceMetadata",
  ]);
  expect(progress).toHaveBeenLastCalledWith(1);
  api.dispose();
  expect(m.stopAuth).toHaveBeenCalledOnce();
  await expect(api.listJobs()).rejects.toThrow();
});

it.each(["duplicate", "expired", "other-user"])(
  "rejects a malformed upload destination: %s",
  async (kind) => {
    const session = uploadSession();
    if (kind === "duplicate") session.fullPaths[1] = session.fullPaths[0];
    if (kind === "expired") session.expiresAtMs = 0;
    if (kind === "other-user") session.fullPaths[0] = "refs/other/s/0.jpg";
    m.call.mockResolvedValue({ data: session });
    await expect(
      adapter().uploadReferences(files(), attempt, false, vi.fn()),
    ).rejects.toThrow("destination");
    expect(m.upload).not.toHaveBeenCalled();
  },
);

it("does not commit if server finalization returns different references", async () => {
  m.upload.mockImplementation(() => ({
    cancel: vi.fn(),
    on: (
      _event: string,
      _progress: unknown,
      _reject: unknown,
      done: () => void,
    ) => {
      done();
      return () => {};
    },
  }));
  m.call
    .mockResolvedValueOnce({ data: uploadSession() })
    .mockResolvedValueOnce({
      data: { completed: true, fullPaths: ["refs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/wrong/0.jpg"] },
    });
  await expect(
    adapter().uploadReferences(files(), attempt, false, vi.fn()),
  ).rejects.toThrow("unexpected photos");
  expect(m.call.mock.calls.map((c) => c[0])).not.toContain(
    "commitReferenceMetadata",
  );
});

it("releases an authorized download after two fresh server access checks", async () => {
  const blob = await adapter().download("j", "outputs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/j/photo.jpg");
  expect(await blob.text()).toBe("sample");
  expect(m.getDoc).toHaveBeenCalledTimes(2);
});

it("resumes a completed upload after a lost response without rewriting its files", async () => {
  m.call.mockResolvedValueOnce({ data: { ...uploadSession(), uploadStatus: "completed" } })
    .mockResolvedValueOnce({ data: { completed: true, fullPaths: uploadSession().fullPaths } })
    .mockResolvedValueOnce({ data: {} });
  const result = await adapter().uploadReferences(files(), attempt, false, vi.fn());
  expect(result.uploadStatus).toBe("completed");
  expect(m.upload).not.toHaveBeenCalled();
  expect(m.call.mock.calls.map(c => c[0])).toEqual([
    "createReferenceUploadSession", "finalizeReferenceUploadSession", "commitReferenceMetadata",
  ]);
});

it("does not overwrite photos while another tab is validating the same upload", async () => {
  m.call.mockResolvedValueOnce({ data: { ...uploadSession(), uploadStatus: "finalizing" } });
  await expect(adapter().uploadReferences(files(), attempt, false, vi.fn())).rejects.toThrow("still being checked");
  expect(m.upload).not.toHaveBeenCalled();
});

it("withholds a download when deletion or refund arrives during transfer", async () => {
  m.getDoc.mockResolvedValueOnce({ data: () => job }).mockResolvedValueOnce({
    data: () => ({ ...job, refundOutputAccessRevoked: true }),
  });
  await expect(
    adapter().download("j", "outputs/w_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/j/photo.jpg"),
  ).rejects.toThrow("access changed");
});

const checkout = () => ({
  orderId: "order_1", checkoutId: "cs_test_123", state: "open", jobId: null,
  amountMinor: 399, currency: "usd", checkoutUrl: "https://checkout.example.test/session?token=opaque",
});
it.each([
  { checkoutUrl: "javascript:alert(1)" },
  { checkoutUrl: "http://checkout.example.test/session" },
  { checkoutUrl: "https://checkout.example.test.evil.test/session" },
  { checkoutUrl: "https://user:password@checkout.example.test/session" },
  { checkoutUrl: "https://checkout.example.test:444/session" },
  { orderId: "different-order" }, { checkoutId: "" },
  { checkoutId: undefined }, { checkoutId: 123 },
  { amountMinor: 3.99 }, { currency: "eur" }, { state: "complete" },
  { state: "fulfilled", jobId: null }, { jobId: "../other" },
])("rejects unsafe or mismatched checkout responses: %j", async (patch) => {
  m.createCheckout.mockResolvedValue({ ...checkout(), ...patch });
  await expect(adapter().beginWebCheckout("order_1", "customer@example.com")).rejects.toThrow();
});
it("accepts the approved HTTPS checkout and passes the email to the server", async () => {
  m.createCheckout.mockResolvedValue(checkout());
  expect(await adapter().beginWebCheckout("order_1", "customer@example.com")).toEqual(checkout());
  expect(m.createCheckout).toHaveBeenCalledWith("order_1", "customer@example.com", undefined);
});
it.each(["creating", "open", "paid", "fulfilled", "expired", "refunded", "needs-support"])(
  "reconciles %s by the frozen order ID, without assuming a redirect proves payment", async state => {
    const value = { ...checkout(), state, checkoutUrl: null, jobId: state === "fulfilled" ? "job_1" : null };
    m.getCheckout.mockResolvedValue(value);
    expect(await adapter().reconcileWebCheckout("order_1")).toEqual(value);
    expect(m.getCheckout).toHaveBeenCalledWith("order_1");
  },
);
it("rejects an unknown payment status during checkout recovery", async () => {
  m.getCheckout.mockResolvedValue({ ...checkout(), state: "complete" });
  await expect(adapter().reconcileWebCheckout("order_1")).rejects.toThrow();
});
it.each([
  { platform: "ios" }, { platform: undefined }, { webAppId: "another:web:app" },
  { webSessionHandle: "unverified" }, { deviceHandle: "another-handle" },
])("does not admit native or mismatched browser claims: %j", async patch => {
  const token = await m.token();
  m.token.mockResolvedValue({ claims: { ...token.claims, ...patch } });
  await expect(adapter().listJobs()).rejects.toThrow("not been admitted");
  expect(m.getDocs).not.toHaveBeenCalled();
});

it("does not create a payment session until approved checkout origins are configured", async () => {
  await expect(
    adapter([]).beginWebCheckout("order_1", "customer@example.com"),
  ).rejects.toThrow("configured");
  expect(m.createCheckout).not.toHaveBeenCalled();
});

it("clears watched data when a token refresh restricts the same signed-in user", async () => {
  const next = vi.fn();
  const api = adapter();
  await api.watchJob("j", next, vi.fn());
  snapshot({ data: () => job });
  m.token.mockResolvedValue({
    claims: { deviceRestricted: true, deviceHandle: "valid-handle" },
  });
  authChanged(auth.currentUser);
  await vi.waitFor(() => expect(next).toHaveBeenLastCalledWith(null));
  expect(m.stopSnapshot).toHaveBeenCalledOnce();
  await expect(api.listJobs()).rejects.toThrow();
});

it("cancels an active upload when refreshed session claims cannot be verified", async () => {
  const api = adapter();
  const upload = api.uploadReferences(files(), attempt, false, vi.fn());
  const rejected = expect(upload).rejects.toThrow();
  await vi.waitFor(() => expect(m.upload).toHaveBeenCalledTimes(2));
  m.token.mockRejectedValue(new Error("Token unavailable"));
  authChanged(auth.currentUser);
  await vi.waitFor(() => expect(cancel).toHaveBeenCalledOnce());
  await rejected;
  expect(m.call.mock.calls.map((c) => c[0])).toEqual([
    "createReferenceUploadSession",
  ]);
});

it("keeps an admitted refreshed session working and removes its observer on disposal", async () => {
  const next = vi.fn();
  const api = adapter();
  await api.watchJob("j", next, vi.fn());
  snapshot({ data: () => job });
  authChanged(auth.currentUser);
  await vi.waitFor(() => expect(m.token).toHaveBeenCalledTimes(2));
  expect(await api.listJobs()).toHaveLength(1);
  expect(m.stopSnapshot).not.toHaveBeenCalled();
  api.dispose();
  expect(next).toHaveBeenLastCalledWith(null);
  expect(m.stopAuth).toHaveBeenCalledOnce();
  expect(m.stopSnapshot).toHaveBeenCalledOnce();
});

it("overlaps only two uploads, reports aggregate progress, and finalizes once both workers finish", async () => {
  const pending: { done: () => void; progress: (s: { bytesTransferred: number; totalBytes: number }) => void }[] = [];
  let active = 0, peak = 0;
  m.upload.mockImplementation(() => {
    active++; peak = Math.max(peak, active);
    return { cancel: vi.fn(), on: (_event: string, progress: any, _fail: any, done: () => void) => {
      pending.push({ progress, done: () => { active--; done(); } });
    } };
  });
  const progress = vi.fn();
  const upload = adapter().uploadReferences(files(), attempt, false, progress);
  await vi.waitFor(() => expect(pending).toHaveLength(2));
  pending[0].progress({ bytesTransferred: 1024, totalBytes: 2048 });
  expect(progress).toHaveBeenLastCalledWith(0.125);
  pending[0].done();
  await vi.waitFor(() => expect(pending).toHaveLength(3));
  expect(m.call.mock.calls.map(c => c[0])).not.toContain('finalizeReferenceUploadSession');
  pending[1].done();
  await vi.waitFor(() => expect(pending).toHaveLength(4));
  pending[2].done(); pending[3].done();
  await expect(upload).resolves.toMatchObject({ uploadStatus: 'completed' });
  expect(peak).toBe(2); expect(active).toBe(0);
  expect(progress).toHaveBeenLastCalledWith(1);
  expect(m.call.mock.calls.filter(c => c[0] === 'finalizeReferenceUploadSession')).toHaveLength(1);
});

it("a failed transfer cancels its sibling and never finalizes a partial upload", async () => {
  const failures: ((error: Error) => void)[] = [];
  const cancellations: ReturnType<typeof vi.fn>[] = [];
  m.upload.mockImplementation(() => {
    let fail!: (error: Error) => void;
    const cancel = vi.fn(() => fail(new Error('Cancelled sibling')));
    cancellations.push(cancel);
    return { cancel, on: (_event: string, _progress: unknown, reject: typeof fail) => {
      fail = reject; failures.push(reject);
    } };
  });
  const upload = adapter().uploadReferences(files(), attempt, false, vi.fn());
  const rejected = expect(upload).rejects.toThrow('Network interrupted');
  await vi.waitFor(() => expect(failures).toHaveLength(2));
  failures[0](new Error('Network interrupted'));
  await rejected;
  expect(cancellations[1]).toHaveBeenCalledOnce();
  expect(m.upload).toHaveBeenCalledTimes(2);
  expect(m.call.mock.calls.map(c => c[0])).toEqual(['createReferenceUploadSession']);
});

it("resumes a partial immutable upload by sending only missing selfies", async () => {
  const saved = new Set(uploadSession().fullPaths.slice(0, 2));
  m.call.mockImplementation(async name => ({ data: name === 'createReferenceUploadSession'
    ? { ...uploadSession(), replayed: true }
    : { completed: true, fullPaths: uploadSession().fullPaths } }));
  m.metadata.mockImplementation(async path => {
    if (!saved.has(path)) throw Object.assign(new Error('Missing'), {code:'storage/object-not-found'});
    return { fullPath: path, size: 2048, contentType: 'image/jpeg' };
  });
  m.upload.mockImplementation(path => ({ cancel: vi.fn(), on: (_e: string, _p: unknown, fail: (e: Error) => void, done: () => void) => {
    if (saved.has(path)) fail(Object.assign(new Error('Immutable object cannot be overwritten'), {code:'storage/unauthorized'}));
    else { saved.add(path); done(); }
    return () => {};
  } }));
  const result = await adapter().uploadReferences(files(), attempt, false, vi.fn());
  expect(result.uploadStatus).toBe('completed');
  expect(m.upload.mock.calls.map(call => call[0])).toEqual(uploadSession().fullPaths.slice(2));
  expect(saved.size).toBe(4);
});

it.each(['storage/unauthorized', 'storage/retry-limit-exceeded'])(
  'recovers a lost upload acknowledgement only after Storage confirms it (%s)', async code => {
    m.upload.mockImplementation(() => ({ cancel: vi.fn(),
      on: (_e: string, _p: unknown, fail: (e: Error) => void) => {
        fail(Object.assign(new Error('Lost acknowledgement'), { code })); return () => {};
      } }));
    m.metadata.mockImplementation(async path => ({ fullPath: path, size: 2048, contentType: 'image/jpeg' }));
    expect((await adapter().uploadReferences(files(), attempt, false, vi.fn())).uploadStatus).toBe('completed');
    expect(m.upload).toHaveBeenCalledTimes(4);
    expect(m.metadata).toHaveBeenCalledTimes(4);
  },
);

it.each(['mismatch', 'denied', 'signed-out'])(
  'does not overwrite or finalize an unverifiable saved selfie (%s)', async failure => {
    m.call.mockResolvedValue({ data: { ...uploadSession(), replayed: true } });
    m.metadata.mockImplementation(async path => {
      if (failure === 'denied') throw Object.assign(new Error('Access denied'), {code:'storage/unauthorized'});
      if (failure === 'signed-out') changeAccount();
      return { fullPath: path, size: failure === 'mismatch' ? 4096 : 2048, contentType: 'image/jpeg' };
    });
    await expect(adapter().uploadReferences(files(), attempt, false, vi.fn())).rejects.toThrow();
    expect(m.upload).not.toHaveBeenCalled();
    expect(m.call.mock.calls.map(call => call[0])).toEqual(['createReferenceUploadSession']);
  },
);

it('reports transferred bytes correctly when the selfies have different sizes', async () => {
  const tasks: { progress: (value: {bytesTransferred:number;totalBytes:number}) => void; done: () => void }[] = [];
  m.upload.mockImplementation(() => ({ cancel: vi.fn(), on: (_e: string, progress: typeof tasks[number]['progress'], _fail: unknown, done: () => void) => {
    tasks.push({progress, done}); return () => {};
  } }));
  const sizes = [2048, 8192, 4096, 2048];
  const progress = vi.fn();
  const request = adapter().uploadReferences(sizes.map(size => new Blob([new Uint8Array(size)], {type:'image/jpeg'})), attempt, false, progress);
  await vi.waitFor(() => expect(tasks).toHaveLength(2));
  tasks[0].progress({bytesTransferred:2048,totalBytes:2048});
  expect(progress).toHaveBeenLastCalledWith(2048 / 16384);
  tasks[0].done(); tasks[1].done();
  await vi.waitFor(() => expect(tasks).toHaveLength(4));
  tasks[2].done(); tasks[3].done(); await request;
  expect(progress).toHaveBeenLastCalledWith(1);
});
