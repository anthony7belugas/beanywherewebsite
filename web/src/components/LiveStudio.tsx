import { analyticsErrorCode } from "../lib/analytics-error";
import { trackWeb } from "../../storefront/analytics.js";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Download, ShieldCheck } from "lucide-react";
import { service } from "../services";
import type { CheckoutResult, Photo, StudioState } from "../lib/types";

export function GalleryRecovery({ email, hasShoots, onRecovered, targetShootId }: { email: string; hasShoots: boolean; onRecovered: () => void; targetShootId?: string }) {
  // Suggest the saved email once; background refreshes must not overwrite edits.
  const [value, setValue] = useState(email);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(!hasShoots);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState("");
  const edit = (next: string) => { setValue(next); setMessage(""); setError(""); setInvalid(false); };
  return <div className={`gallery-recovery ${hasShoots ? "compact" : ""}`}>
    {hasShoots && !open ? <button className="text-button" onClick={() => setOpen(true)}>Find photos with your email</button>
      : <form noValidate aria-busy={busy} onSubmit={async event => {
        event.preventDefault(); if (busy || !service.recoverGalleries) return;
        const email = value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
          setError("Enter your photo delivery email, like you@example.com."); setInvalid(true); setMessage("");
          input.current?.focus(); return;
        }
        setValue(email);
        setBusy(true); setError(""); setMessage("");
        try {
          const count = await service.recoverGalleries(email);
          const foundTarget = targetShootId ? (await service.read()).shoots.some(shoot => shoot.id === targetShootId) : false;
          onRecovered();
          setMessage(targetShootId
            ? foundTarget ? "Opening your photos…" : "This shoot wasn’t found for that email. Check your photo delivery email, or open My photos to see your other shoots. Deleted or refunded shoots are no longer available."
            : count ? `Found ${count} ${count === 1 ? "photoshoot" : "photoshoots"}. Open a gallery below.` : "No web photoshoots found. Check that this is the photo delivery email you chose on this website.");
        } catch (e) { setError(e instanceof Error ? e.message : "Couldn’t find your photos. Please try again."); }
        finally { setBusy(false); }
      }}>
        <h2>{targetShootId ? "Open this shoot" : hasShoots ? "Looking for another shoot?" : "Find your photos"}</h2>
        <p id="gallery-email-note">{targetShootId ? "Enter your photo delivery email. We’ll take you straight to this shoot." : "Enter your photo delivery email to open your web galleries."}</p>
        <label className="field-label" htmlFor="gallery-email">Photo delivery email</label>
        <div className="recovery-fields">
          <div className="recovery-email">
            <input ref={input} id="gallery-email" type="email" inputMode="email" autoComplete="email"
              autoCapitalize="none" autoCorrect="off" spellCheck={false}
              required maxLength={254} value={value} onChange={event => edit(event.target.value)}
              aria-invalid={invalid || undefined} aria-describedby={`gallery-email-note${error ? " gallery-email-error" : ""}`}
              placeholder="you@example.com" disabled={busy} />
            {value && <button type="button" className="clear-email" aria-label="Clear email" disabled={busy}
              onClick={() => { edit(""); input.current?.focus(); }}>Clear</button>}
          </div>
          <button type="submit" className="button" disabled={busy}>{busy ? "Finding your photos…" : targetShootId ? "View my photos" : "Find my photos"}</button>
        </div>
        {error && <p id="gallery-email-error" className="form-error" role="alert">{error}</p>}
        {message && <p className="recovery-message" role="status">{message}</p>}
        {hasShoots && <button type="button" className="text-button" disabled={busy} onClick={() => setOpen(false)}>Close</button>}
      </form>}
  </div>;
}

export function StudioImage({ shootId, photo, alt, previewBlob, onPreviewReady, onPreviewError, loadWhenVisible = false }: {
  shootId: string;
  photo: Photo;
  alt: string;
  previewBlob?: Blob;
  onPreviewReady?: (photo: Photo, blob: Blob) => void;
  onPreviewError?: (photo: Photo) => void;
  loadWhenVisible?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [nearby, setNearby] = useState(() => !loadWhenVisible || typeof IntersectionObserver === "undefined");
  const placeholder = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (nearby || !loadWhenVisible || !photo.path || !placeholder.current) return;
    // Observe before fetching the private blob: loading="lazy" on the final
    // object URL would still download every full-size photo upfront.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: "400px" });
    observer.observe(placeholder.current);
    return () => observer.disconnect();
  }, [nearby, loadWhenVisible, photo.path]);
  useEffect(() => {
    if (!photo.path || !service.photoBlob || (loadWhenVisible && !nearby)) return;
    let active = true;
    let objectURL = "";
    setUrl(""); setError(false);
    const request = previewBlob ? Promise.resolve(previewBlob) : service.photoBlob(shootId, photo);
    void request.then(blob => {
      if (!active) return;
      objectURL = URL.createObjectURL(blob); setUrl(objectURL);
      onPreviewReady?.(photo, blob);
    }).catch(() => {
      if (active) { setError(true); onPreviewError?.(photo); }
    });
    return () => { active = false; if (objectURL) URL.revokeObjectURL(objectURL); };
  }, [shootId, photo.path, previewBlob, onPreviewReady, onPreviewError, loadWhenVisible, nearby]);
  if (!photo.path) return <img loading="lazy" src={photo.url} alt={alt} />;
  if (url) return <img src={url} alt={alt} />;
  return <span ref={placeholder} className="photo-developing" role="status">
    {error ? <span>Preview unavailable. Open the photo to try again.</span>
      : <LoaderCircle className="spin" aria-label="Loading your photo" />}
  </span>;
}

export function PaymentReturn({ orderId, shoots }: { orderId: string; shoots: StudioState["shoots"] }) {
  useEffect(()=>{trackWeb("payment_return");},[]);
  const [checkout, setCheckout] = useState<Extract<CheckoutResult, { kind: "payment" }> | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    let active = true, count = 0, lastFailure = "";
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        if (!/^[A-Za-z0-9_-]{1,128}$/.test(orderId) || !service.payment) throw new Error("Open your checkout from this browser to check its status.");
        const next = await service.payment(orderId);
        if (!active) return;
        setCheckout(next); setError(""); lastFailure = "";
        if (["fulfilled", "expired", "refunded", "needs-support"].includes(next.state)) { setWaiting(false); return; }
      } catch (e) { if (active) {
        const code = analyticsErrorCode(e);
        if (code !== lastFailure) trackWeb("web_error", { surface: "payment_status", error_code: code });
        lastFailure = code; setError((e as Error).message);
      } }
      if (active && ++count < 40) timer = setTimeout(poll, count < 10 ? 10000 : 30000);
      else if (active) { trackWeb("web_error", { surface: "payment_status", error_code: "polling_timeout" }); setWaiting(false); }
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
      : checkout?.state === "paid" ? "Your shoot is being prepared. You can return to My photos using your photo delivery email."
      : "We confirm payment securely before any paid generation starts."}</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {checkout?.state === "open" && checkout.url && !editing && <a className="button" href={checkout.url}>Continue to secure checkout</a>}
    {checkout?.state === "open" && service.editCheckout && <button className="button secondary" disabled={editing} onClick={async () => {
      setEditing(true); setError("");
      try {
        await service.editCheckout!({ orderId });
        window.history.replaceState(null, "", `${window.location.pathname}#/checkout`);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      } catch (e) { setError((e as Error).message); setAttempt(n => n + 1); }
      finally { setEditing(false); }
    }}>{editing ? "Closing unpaid checkout…" : "Edit email or selfies"}</button>}
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
      <li>Save your photos. If something needs attention, contact support with your order reference.</li>
    </ol><p>AI results can vary. The collection images show the setting and style, rather than a guaranteed result.</p></>
      : type === "privacy" ? <><p className="lead">Your photos, on the web.</p>
        <p>Your browser remembers your galleries. On another browser, enter your photo delivery email in My photos to find them. Anyone who knows that email can access those web galleries and use their remaining reshoots. We also email your completed photos as attachments.</p>
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
    <p>On another browser, open My photos and enter your photo delivery email to find your galleries.</p>
    <p><Download size={16} /> {state.shoots.length} photoshoots</p>
    <h3>Your photos</h3>
    <button className="button secondary full" disabled={busy || (!state.draft && !state.savedSelfies)}
      onClick={() => void run(() => service.clearReferences(), "Saved selfies removed from this browser.")}>Remove saved selfies</button>
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
