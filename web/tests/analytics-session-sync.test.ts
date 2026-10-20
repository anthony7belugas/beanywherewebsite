import { expect, it, vi } from "vitest";
import { analyticsContext } from "../storefront/analytics.js";
import { LiveStudioService } from "../src/services/live";
import type { createFirebaseAdapter } from "../integration/firebase-adapter";

vi.mock("../storefront/analytics.js", () => ({
  analyticsContext: vi.fn(),
  analyticsAllowed: () => true,
  analyticsPreference: () => null,
  setAnalyticsAllowed: vi.fn(),
  onAnalyticsPreference: vi.fn(),
  trackWeb: vi.fn(),
  queueStudioEvent: vi.fn(),
  setEventTransport: vi.fn(),
}));

it("records a resumed Studio session once and never treats profile synchronization as activity", async () => {
  const surface = new EventTarget();
  vi.stubGlobal("window", surface);
  vi.stubGlobal("document", new EventTarget());
  const context = { enabled: true, version: "test", clientId: "123.1792480000", sessionId: "first" };
  vi.mocked(analyticsContext).mockReturnValue(context);
  const api = {
    getAnalyticsProfile: vi.fn().mockResolvedValue({ analyticsAvailable: true, analytics: true }),
    recordWebObservation: vi.fn().mockResolvedValue({ disposition: "accepted" }),
    recordEvent: vi.fn(),
  };
  try {
    const service = new LiveStudioService(async () => api as unknown as ReturnType<typeof createFirebaseAdapter>);
    service.track("pack_opened", { packId: "paris" });
    await vi.waitFor(() => expect(api.recordWebObservation).toHaveBeenCalledTimes(1));
    vi.mocked(analyticsContext).mockReturnValue({ ...context, sessionId: "returned" });
    surface.dispatchEvent(new Event("beanywhere-analytics-session"));
    await vi.waitFor(() => expect(api.recordWebObservation).toHaveBeenCalledTimes(2));
    expect(api.recordWebObservation.mock.calls[1][0]).toMatchObject({
      kind: "session", context: { clientId: context.clientId, sessionId: "returned" },
    });
    surface.dispatchEvent(new Event("beanywhere-analytics-session"));
    await vi.waitFor(() => expect(api.getAnalyticsProfile).toHaveBeenCalledTimes(3));
    await Promise.resolve();
    expect(api.recordWebObservation).toHaveBeenCalledTimes(2);
    expect(analyticsContext).toHaveBeenLastCalledWith({ active: false });
  } finally { vi.unstubAllGlobals(); }
});
