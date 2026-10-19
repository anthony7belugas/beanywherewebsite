import type { Shoot } from "./types";

export function galleryState(shoot: Shoot, now: number) {
  const reshooting = shoot.photos.filter(photo => photo.reshooting ||
    (shoot.sample && photo.revision > 0 && photo.readyAt > now)).length;
  const stopped = !shoot.sample && !reshooting &&
    ["failed", "finished", "paused", "manual-review", "refund-hold"]
      .some(value => value === shoot.status || value === shoot.generationState);
  let reshootUnavailable = "";
  if (reshooting) reshootUnavailable = "Your reshoot is being created. Wait for it to finish before starting another.";
  else if (!shoot.sample && shoot.retryWindowEndsAtMs && now > shoot.retryWindowEndsAtMs)
    reshootUnavailable = "The reshoot window has ended. Your available photos are still here to save.";
  else if (!shoot.sample && (shoot.reshootsClosedReason ||
    ["failed", "refunded"].includes(shoot.status || "") ||
    ["manual-review", "refund-hold"].includes(shoot.generationState || "") ||
    (shoot.deliveryClosed && shoot.photos.some(photo => photo.status !== "done"))))
    reshootUnavailable = "Reshoots are unavailable for this shoot. You can still save your available photos.";
  else if (!shoot.sample && shoot.generationState === "paused")
    reshootUnavailable = "Generation is temporarily paused. Try your reshoot again later.";
  else if (!shoot.sample && ["queued", "sending", "pending"].includes(shoot.emailRequestState || ""))
    reshootUnavailable = "Your photos are being attached to your email. Reshoots will be available when it finishes.";
  else if (shoot.reshootsLeft <= 0)
    reshootUnavailable = "You’ve used your included reshoots. Your photos are still here to save.";
  return { reshooting, stopped, reshootUnavailable };
}
