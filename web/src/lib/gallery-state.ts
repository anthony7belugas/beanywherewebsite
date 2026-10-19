import type { Shoot } from "./types";

export function galleryState(shoot: Shoot, now: number) {
  const reshooting = shoot.photos.filter(photo => photo.reshooting ||
    (shoot.sample && photo.revision > 0 && photo.readyAt > now)).length;
  const stopped = !shoot.sample && !reshooting &&
    ["failed", "finished", "paused", "manual-review", "refund-hold"]
      .some(value => value === shoot.status || value === shoot.generationState);
  let reshootUnavailable = "";
  let reshootSummary = `${shoot.reshootsLeft} ${shoot.reshootsLeft === 1 ? "reshoot" : "reshoots"} left`;
  if (reshooting) {
    reshootUnavailable = "Your reshoot is being created. Wait for it to finish before starting another.";
    reshootSummary = "Reshoot in progress";
  } else if (!shoot.sample && shoot.retryWindowEndsAtMs && now > shoot.retryWindowEndsAtMs) {
    reshootUnavailable = "The reshoot window has ended. Your available photos are still here to save.";
    reshootSummary = "Reshoot window ended";
  } else if (!shoot.sample && (shoot.reshootsClosedReason ||
    ["failed", "refunded"].includes(shoot.status || "") ||
    ["manual-review", "refund-hold"].includes(shoot.generationState || "") ||
    (shoot.deliveryClosed && shoot.photos.some(photo => photo.status !== "done")))) {
    reshootUnavailable = "Reshoots are unavailable for this shoot. You can still save your available photos.";
    reshootSummary = "Reshoots unavailable";
  } else if (!shoot.sample && shoot.generationState === "paused") {
    reshootUnavailable = "Generation is temporarily paused. Try your reshoot again later.";
    reshootSummary = "Reshoots paused";
  } else if (!shoot.sample && ["queued", "sending", "pending"].includes(shoot.emailRequestState || "")) {
    reshootUnavailable = "Your photos are being attached to your email. Reshoots will be available when it finishes.";
    reshootSummary = "Reshoots available after email delivery";
  } else if (shoot.reshootsLeft <= 0) {
    reshootUnavailable = "You’ve used your included reshoots. Your photos are still here to save.";
    reshootSummary = "No reshoots left";
  }
  const reshootDeadline = !shoot.sample && !reshootUnavailable &&
    Number.isFinite(shoot.retryWindowEndsAtMs) && Number(shoot.retryWindowEndsAtMs) > 0
    ? new Intl.DateTimeFormat(undefined, {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    }).format(shoot.retryWindowEndsAtMs) : "";
  return { reshooting, stopped, reshootUnavailable, reshootSummary, reshootDeadline };
}
