import { useEffect, useState } from "react";
import { LoaderCircle, Download, ShieldCheck } from "lucide-react";
import { service } from "../services";
import type { CheckoutResult, Photo, StudioState } from "../lib/types";

export function GalleryRecovery({ email, hasShoots }: { email: string; hasShoots: boolean }) {
  const [value, setValue] = useState(email);
  const [open, setOpen] = useState(!hasShoots);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  return <div className={`gallery-recovery ${hasShoots ? "compact" : ""}`}>
    {hasShoots && !open ? <button className="text-button" onClick={() => setOpen(true)}>Find photos with your email</button>
      : <form onSubmit={async event => {
        event.preventDefault(); if (busy || !service.recoverGalleries) return;
        setBusy(true); setError(""); setMessage("");
        try {
          const count = await service.recoverGalleries(value);
          setMessage(count ? `Found ${count} ${count === 1 ? "photoshoot" : "photoshoots"}.` : "No web photoshoots found for this email yet. Check the address you used at checkout, or choose a shoot below.");
        } catch (e) { setError(e instanceof Error ? e.message : "Couldn’t find your photos. Please try again."); }
        finally { setBusy(false); }
      }}>
        <h2>{hasShoots ? "Looking for another shoot?" : "Find your photos"}</h2>
        <p>Enter the email you used at checkout to open your web galleries.</p>
        <label className="field-label" htmlFor="gallery-email">Checkout email</label>
        <div className="recovery-fields"><input id="gallery-email" type="email" autoComplete="email"
          required maxLength={254} value={value} onChange={event => { setValue(event.target.value); setMessage(""); setError(""); }}
          placeholder="you@example.com" disabled={busy} />
          <button className="button" disabled={busy}>{busy ? "Finding your photos…" : "Find my photos"}</button></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="recovery-message" role="status">{message}</p>}
        {hasShoots && <button type="button" className="text-button" onClick={() => setOpen(false)}>Close</button>}
      </form>}
  </div>;
}

export function StudioImage({ shootId, photo, alt }: { shootId: string; photo: Photo; alt: string }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!photo.path || !service.photoBlob) return;
    let active = true;
    let objectURL = "";
    setUrl(""); setError(false);
    void service.photoBlob(shootId, photo).then(blob => {
      if (!active) return;
      objectURL = URL.createObjectURL(blob); setUrl(objectURL);
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; if (objectURL) URL.revokeObjectURL(objectURL); };
  }, [shootId, photo.path]);
  if (!photo.path) return <img loading="lazy" src={photo.url} alt={alt} />;
  if (url) return <img src={url} alt={alt} />;
  return <span className="photo-developing" role="status">
    {error ? <span>Preview unavailable. Open the photo to try again.</span>
      : <LoaderCircle className="spin" aria-label="Loading your photo" />}
  </span>;
}

export function PaymentReturn({ orderId, shoots }: { orderId: string; shoots: StudioState["shoots"] }) {
  const [checkout, setCheckout] = useState<Extract<CheckoutResult, { kind: "payment" }> | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    let active = true, count = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        if (!/^[A-Za-z0-9_-]{1,128}$/.test(orderId) || !service.payment) throw new Error("Open your checkout from this browser to check its status.");
        const next = await service.payment(orderId);
        if (!active) return;
        setCheckout(next); setError("");
        if (["fulfilled", "expired", "refunded", "needs-support"].includes(next.state)) { setWaiting(false); return; }
      } catch (e) { if (active) setError((e as Error).message); }
      if (active && ++count < 40) timer = setTimeout(poll, count < 10 ? 10000 : 30000);
      else if (active) setWaiting(false);
    };
    setWaiting(true); void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [orderId, attempt]);
  useEffect(() => {
    if (checkout?.state === "fulfilled" && shoots.some(shoot => shoot.id === checkout.jobId)) {
      window.location.hash = `/gallery/${checkout.jobId}`;
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }
  }, [checkout, shoots]);
  const title = checkout?.state === "refunded" ? "This purchase is closed."
    : checkout?.state === "expired" ? "This checkout expired."
    : checkout?.state === "needs-support" ? "Let’s check this purchase."
    : checkout?.state === "fulfilled" ? "Your purchase is confirmed."
    : checkout?.state === "paid" ? "Payment received."
    : checkout?.state === "open" && checkout.url ? "Your checkout is ready."
    : "Checking your payment…";
  return <section className="fatal" aria-live="polite">
    {waiting ? <LoaderCircle className="spin" /> : <ShieldCheck />}
    <h1>{title}</h1>
    <p>{checkout?.state === "refunded" ? "This payment was refunded or disputed, so generation and access to these photos are closed."
      : checkout?.state === "expired" ? "No new payment can be made with this checkout. Return to your selfies to start again."
      : checkout?.state === "needs-support" ? "Contact support with the order reference below. Please do not pay again while we check it."
      : checkout?.state === "fulfilled" ? "Your gallery will open when it is available. If you already deleted these photos, they cannot be restored. Contact support if your gallery does not appear."
      : checkout?.state === "paid" ? "Your shoot is being prepared. You can return to My photos using your checkout email."
      : "We confirm payment securely before any paid generation starts."}</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {checkout?.state === "open" && checkout.url && <a className="button" href={checkout.url}>Continue to secure checkout</a>}
    {checkout?.state === "expired" && <a className="button" href="/studio/#/upload">Review selfies and start again</a>}
    {!waiting && <button className="button secondary" onClick={() => setAttempt(n => n + 1)}>Check again</button>}
    <a className="text-button" href="#/library">My photos</a>
    <p className="small muted">Order reference: {orderId}</p>
    <a href={`mailto:support@beanywhere.app?subject=${encodeURIComponent(`Web order ${orderId}`)}`}>Contact support</a>
  </section>;
}

export function LiveInfo({ type }: { type: "help" | "privacy" | "terms" }) {
  return <div className="prose">
    {type === "help" ? <><p className="lead">Upload, pay, and make it yours.</p><ol>
      <li>Choose a destination and a look, then add 4–6 clear selfies of yourself (18 or older).</li>
      <li>Enter your delivery email and pay once through Stripe. No Google login or subscription is required.</li>
      <li>Watch your photos arrive in My photos. Processing continues when you close this page, and your completed set is emailed to you automatically.</li>
      <li>Download your favorites. If something needs attention, contact support with your order reference.</li>
    </ol><p>AI results can vary. The collection images show the setting and style, rather than a guaranteed result.</p></>
      : type === "privacy" ? <><p className="lead">Your photos, on the web.</p>
        <p>Your browser remembers your galleries. On another browser, enter your checkout email in My photos to find them. Anyone who knows that email can access those web galleries and use their remaining reshoots. We also email your completed photos as attachments.</p>
        <p>After you continue to checkout, your selfies are uploaded for processing. Firebase stores your studio data, Stripe handles payment, and our AI provider generates your photos.</p>
        <p>Use My photos → Photo settings to remove draft selfies or delete photos created in this browser. Contact support to delete a recovered gallery. Downloaded files remain on your device.</p>
        <a href="/privacy.html" target="_blank" rel="noreferrer">Full privacy policy</a></>
      : <><p className="lead">One photoshoot. One payment.</p>
        <p>The checkout shows the final price in USD. BeAnywhere is for adults 18 and older. Upload only photos of yourself, with no other people in them.</p>
        <p>AI photos can contain imperfections. The server checks your payment and enforces the generation and reshoot limits. Contact support if your paid shoot cannot be completed.</p>
        <a href="/terms.html" target="_blank" rel="noreferrer">Full terms of service</a></>}
  </div>;
}

export function LiveAccount({ state, notify }: { state: StudioState; notify: (text: string) => void }) {
  const [busy, setBusy] = useState(false), [confirm, setConfirm] = useState(false), [error, setError] = useState("");
  async function run(fn: () => Promise<void>, success: string) {
    setBusy(true); setError("");
    try { await fn(); notify(success); setConfirm(false); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="prose">
    <p className="lead">Photo settings</p>
    <p>{state.recoveryEmail || state.email || "Your delivery email is collected at checkout."}</p>
    <p>On another browser, open My photos and enter your checkout email to find your galleries.</p>
    <p><Download size={16} /> {state.shoots.length} photoshoots</p>
    <h3>Your photos</h3>
    <button className="button secondary full" disabled={busy || !state.draft}
      onClick={() => void run(() => service.clearReferences(), "Draft selfies removed from this browser.")}>Remove draft selfies</button>
    <p>Cloud deletion removes photos created in this browser. For galleries recovered from another browser, contact support to request deletion. Payment records and files you already downloaded are retained.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {confirm ? <div className="confirm-clear"><p><strong>Delete photos created in this browser?</strong> This cannot be undone, and it also stops unfinished shoots.</p>
      <button className="button secondary" disabled={busy} onClick={() => setConfirm(false)}>Keep my photos</button>{" "}
      <button className="button danger" disabled={busy} onClick={() => void run(() => service.deleteAllPhotos!(),
        "Photo deletion requested. It may take a little time to finish.")}>Delete all photos</button></div>
      : <button className="text-button danger-text" disabled={busy} onClick={() => setConfirm(true)}>Delete photos created here</button>}
    <p><a href="mailto:support@beanywhere.app">Contact support</a></p>
  </div>;
}
