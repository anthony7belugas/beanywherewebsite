import { useEffect, useState } from "react";
import { LoaderCircle, Download, ShieldCheck } from "lucide-react";
import { service } from "../services";
import type { CheckoutResult, Photo, StudioState } from "../lib/types";

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
      : checkout?.state === "paid" ? "Your shoot is being prepared. You can return to My photos in this browser."
      : "We confirm payment securely before any paid generation starts."}</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {checkout?.state === "open" && checkout.url && <a className="button" href={checkout.url}>Continue to secure checkout</a>}
    {!waiting && <button className="button secondary" onClick={() => setAttempt(n => n + 1)}>Check again</button>}
    <a className="text-button" href="#/library">My photos</a>
    <p className="small muted">Order reference: {orderId}</p>
    <a href={`mailto:support@beanywhere.app?subject=${encodeURIComponent(`Web order ${orderId}`)}`}>Contact support</a>
  </section>;
}

export function LiveInfo({ type }: { type: "help" | "privacy" | "terms" }) {
  return <div className="prose">
    {type === "help" ? <><p className="lead">Upload, pay, and make it yours.</p><ol>
      <li>Choose a destination and a look, then add 4–6 clear selfies of one consenting adult.</li>
      <li>Enter your delivery email and pay once through Stripe. No Google login or subscription is required.</li>
      <li>Watch your photos arrive in My photos. Processing continues when you close this page.</li>
      <li>Download your favorites. If something needs attention, contact support with your order reference.</li>
    </ol><p>AI results can vary. The collection images show the setting and style, rather than a guaranteed result.</p></>
      : type === "privacy" ? <><p className="lead">Your studio uses a private browser sign-in.</p>
        <p>Your browser keeps a secure sign-in so you can return to your photos. Your email alone does not open a gallery.</p>
        <p>After you continue to checkout, your selfies are uploaded for processing. Firebase stores your studio data, Stripe handles payment, and our AI provider generates your photos.</p>
        <p>Use My studio to remove draft selfies or request deletion of all your uploaded and generated photos. Downloaded files remain on your device.</p>
        <a href="/privacy.html" target="_blank" rel="noreferrer">Full privacy policy</a></>
      : <><p className="lead">One photoshoot. One payment.</p>
        <p>The checkout shows the final price in USD. BeAnywhere is for adults 18 and older. Upload only photos of yourself or another adult who explicitly agreed.</p>
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
    <p className="lead">Your BeAnywhere studio</p>
    <p>{state.email || "Your delivery email is collected at checkout."}</p>
    <p>This browser signs you in automatically. Keep its website data to return to your paid photos.</p>
    <p><Download size={16} /> {state.shoots.length} photoshoots in this studio</p>
    <h3>Your photos</h3>
    <button className="button secondary full" disabled={busy || !state.draft}
      onClick={() => void run(() => service.clearReferences(), "Draft selfies removed from this browser.")}>Remove draft selfies</button>
    <p>Deleting cloud photos removes all uploaded and generated photos for this web studio. Payment records and files you already downloaded are retained.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {confirm ? <div className="confirm-clear"><p><strong>Delete all cloud photos?</strong> This cannot be undone, and it also stops unfinished shoots.</p>
      <button className="button secondary" disabled={busy} onClick={() => setConfirm(false)}>Keep my photos</button>{" "}
      <button className="button danger" disabled={busy} onClick={() => void run(() => service.deleteAllPhotos!(),
        "Photo deletion requested. It may take a little time to finish.")}>Delete all photos</button></div>
      : <button className="text-button danger-text" disabled={busy} onClick={() => setConfirm(true)}>Delete all cloud photos</button>}
    <p><a href="mailto:support@beanywhere.app">Contact support</a></p>
  </div>;
}
