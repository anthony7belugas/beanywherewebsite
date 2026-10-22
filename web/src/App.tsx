import { analyticsErrorCode } from "./lib/analytics-error";
import { trackWeb } from "../storefront/analytics.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  Images,
  Info,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { service, liveMode } from "./services";
import { studioRouteEvent } from "../integration/studio-events";
import { LiveAccount, LiveInfo, PaymentReturn, StudioImage, GalleryRecovery } from "./components/LiveStudio";
import {
  packs,
  packById,
  cover,
  sceneImage,
  location,
  nextPack,
} from "./lib/catalog";
import { storefrontEntry, withoutStorefrontEntry } from "./lib/storefront-entry";
import { InvalidStoredStateError } from "./lib/stored-state";
import { emptyState, validateDraft } from "./lib/domain";
import { galleryRefreshMessage, galleryState, photoRetryState } from "./lib/gallery-state";
import { suggestedEmail } from "./lib/email";
import { prepareReference, preparePhotoDownload, canSharePhotos, type PreparedPhotos } from "./lib/media";
import type {
  CheckoutProgress,
  Draft,
  Pack,
  Photo,
  Shoot,
  StudioState,
  Styling,
} from "./lib/types";
import { Modal } from "./components/Modal";

const homeHref = (() => {
  if (!liveMode) return "#/";
  let styling = new URLSearchParams(window.location.search).get("styling");
  try { styling ||= localStorage.getItem("beanywhere-public-styling"); } catch { /* Optional preference. */ }
  return styling === "w" || styling === "m" ? `/?styling=${styling}#shoots` : "/#shoots";
})();
function go(path: string) {
  if (liveMode && path === "/") window.location.assign(homeHref);
  else window.location.hash = path;
}
const pathNow = () => window.location.hash.slice(1) || "/";
const money = "$3.99";
const date = (n: number) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    n,
  );
type Dialog = "help" | "settings" | "account" | "privacy" | "terms" | null;

export default function App() {
  const [state, setState] = useState<StudioState>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [fatal, setFatal] = useState("");
  const [recoverable, setRecoverable] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [path, setPath] = useState(pathNow);
  const redirectHome = liveMode && path === "/" && !new URLSearchParams(window.location.search).has("checkout");
  const entry = useRef(storefrontEntry(window.location.search, path));
  const [dialog, setDialog] = useState<Dialog>(null);
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(Date.now());
  const [offline, setOffline] = useState(!navigator.onLine);
  const [galleryError, setGalleryError] = useState("");
  const [galleryRetry, setGalleryRetry] = useState(0);
  const [galleryRefreshing, setGalleryRefreshing] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const main = useRef<HTMLElement>(null);
  const notify = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 5500);
  }, []);
  const handle = useCallback(
    async (fn: () => Promise<unknown>) => {
      try {
        await fn();
      } catch (e) {
        notify(
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again.",
        );
      }
    },
    [notify],
  );
  const closeDialog = useCallback(() => setDialog(null), []);
  useEffect(() => {
    if (redirectHome) window.location.replace(homeHref);
  }, [redirectHome]);
  useEffect(() => {
    if (!loaded || !liveMode) return;
    const event = studioRouteEvent(path, state);
    if (event) service.track?.(event.name, event.params);
    // A screen visit is measured once, not on each polling refresh.
  }, [loaded, path]);
  useEffect(() => {
    if (redirectHome) return;
    let alive = true;
    // One validated handoff, shared by refreshes. startDraft preserves selfies and paid checkpoints.
    const initialize = (async () => {
      if (!entry.current) return;
      const chosen = entry.current;
      await service.startDraft(chosen.packId, chosen.styling, chosen.styleId);
      await service.setStyling(chosen.styling);
      service.track?.("pack_opened", { ...chosen, source: "public_catalog" });
      window.history.replaceState(null, "", `${window.location.pathname}${withoutStorefrontEntry(window.location.search)}${window.location.hash}`);
    })();
    const refresh = () => {
      void initialize.then(() => service.read())
        .then((s) => {
          if (alive) {
            setState(s);
            setGalleryError(s.galleryRefreshError || "");
            setLoaded(true);
            setFatal("");
            setRecoverable(false);
          }
        })
        .catch((error: unknown) => {
          if (alive) {
            const savedDataError = error instanceof InvalidStoredStateError;
            trackWeb("web_error", { surface: "studio_startup", error_code: savedDataError ? "stored_state_invalid" : analyticsErrorCode(error) });
            setRecoverable(savedDataError);
            setFatal(
              savedDataError
                ? error.message
                : liveMode && error instanceof Error ? error.message : "This browser is blocking local storage. Allow website storage, or try a regular browser window.",
            );
          }
        });
    };
    refresh();
    const stop = service.subscribe(refresh);
    return () => {
      alive = false;
      stop();
    };
  }, [redirectHome]);
  useEffect(() => {
    const change = () => {
      setPath(pathNow());
      window.scrollTo({ top: 0 });
      main.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!liveMode || !loaded || !(path === "/library" || path.startsWith("/gallery/"))) return;
    setGalleryRefreshing(false);
    let alive = true, running = false;
    const refresh = async (background = false) => {
      if (running || document.hidden) return;
      running = true;
      setGalleryRefreshing(true);
      try {
        if (await service.refreshGalleries?.({ background }) === false) return;
        const next = await service.read();
        if (alive) { setState(next); setGalleryError(next.galleryRefreshError || ""); }
      } catch (error) { if (alive) setGalleryError(galleryRefreshMessage(error)); }
      finally { running = false; if (alive) setGalleryRefreshing(false); }
    };
    if (galleryRetry) void refresh();
    const timer = setInterval(() => void refresh(true), 15000);
    const focus = () => void refresh();
    window.addEventListener("focus", focus);
    return () => { alive = false; clearInterval(timer); window.removeEventListener("focus", focus); };
  }, [path, loaded, galleryRetry]);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    document.title = `${path.startsWith("/library") ? "My photos" : path.startsWith("/shoot/") ? packById(path.split("/")[2])?.title || "Photoshoot" : path === "/upload" ? "Your selfies" : path === "/checkout" ? "Review your shoot" : path.startsWith("/gallery/") ? "Your photos" : "Your personal photo studio"} · BeAnywhere`;
  }, [path]);
  if (fatal)
    return (
      <main className="fatal">
        <Info />
        <h1>
          {recoverable
            ? "Your saved photos need attention."
            : liveMode ? "Your photos need to reconnect." : "Your studio needs browser storage."}
        </h1>
        <p>{fatal}</p>
        <button className="button" onClick={() => window.location.reload()}>
          Try again
        </button>
        {recoverable &&
          (confirmReset ? (
            <div className="prose">
              <p>
                {liveMode ? "This clears your saved draft and its selfies from this browser. Your paid photos and payment records remain available."
                  : "This permanently clears this studio’s saved drafts, reference photos, sample shoots, and demo email from this browser."}
              </p>
              <div className="dialog-actions">
                <button
                  className="button secondary"
                  disabled={resetting}
                  onClick={() => setConfirmReset(false)}
                >
                  Keep saved data
                </button>
                <button
                  className="button danger"
                  disabled={resetting}
                  onClick={async () => {
                    setResetting(true);
                    try {
                      await service.reset();
                      setConfirmReset(false);
                      go("/");
                    } catch {
                      setFatal(
                        "The browser could not clear the saved studio. Check your browser’s storage settings and try again.",
                      );
                    } finally {
                      setResetting(false);
                    }
                  }}
                >
                  Clear saved studio
                </button>
              </div>
            </div>
          ) : (
            <button
              className="button secondary"
              onClick={() => setConfirmReset(true)}
            >
              Reset local studio
            </button>
          ))}
      </main>
    );
  if (!loaded)
    return (
      <>
        <StudioHeader path={path} count={0} />
        <main className="shell main" aria-busy="true">
          <h1>{path === "/library" ? "My photos" : path === "/checkout" ? "Review your photoshoot" : "Your photoshoot"}</h1>
          <GalleryLoading />
        </main>
      </>
    );
  const draft = state.draft;
  const returnedOrder = liveMode ? new URLSearchParams(window.location.search).get("checkout") : null;
  const paymentRoute = liveMode && !!returnedOrder && ["/payment", "/checkout"].includes(path);
  const currentPack = path.startsWith("/shoot/")
    ? packById(path.split("/")[2])
    : null;
  const requestedShootId = /^\/gallery\/([A-Za-z0-9_-]{1,128})$/.exec(path)?.[1];
  const currentShoot = requestedShootId
    ? state.shoots.find((j) => j.id === requestedShootId)
    : null;
  const steps =
    path === "/upload" || path === "/checkout" || path.startsWith("/gallery/");
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      {!liveMode && <div className="draft-banner">
        <span className="status-dot" />
        PRIVATE DRAFT{" "}
        <span className="banner-copy">
          · No charges. No AI calls. Everything stays in this browser.
        </span>
        <button onClick={() => setDialog("help")}>
          About this draft <Info size={12} />
        </button>
      </div>}
      <StudioHeader path={path} count={state.shoots.length} />
      {offline && (
        <div className="offline">
          You’re offline. Saved draft data is available; uncached preview images
          may need a connection.
        </div>
      )}
      <main className="shell main" id="main-content" tabIndex={-1} ref={main}>
        {steps && (
          <div className="steps-nav" aria-label="Photoshoot progress">
            {[
              "Choose a shoot",
              "Your selfies",
              "Review & create",
              "Your photos",
            ].map((label, i) => {
              const active =
                path === "/upload" ? 1 : path === "/checkout" ? 2 : 3;
              return (
                <div
                  key={label}
                  className={
                    i === active ? "current" : i < active ? "complete" : ""
                  }
                >
                  <span>{i < active ? <Check size={12} /> : i + 1}</span>
                  {label}
                </div>
              );
            })}
          </div>
        )}
        {path === "/" && (
          <Explore
            styling={state.preferredStyling}
            setStyling={(v) => void handle(() => service.setStyling(v))}
            draft={draft}
          />
        )}
        {currentPack && (
          <PackDetail
            key={currentPack.packId}
            pack={currentPack}
            initialStyling={state.preferredStyling}
            draft={draft}
            onStart={async (styling, styleId) => {
              await service.startDraft(currentPack.packId, styling, styleId);
              await service.setStyling(styling);
              go("/upload");
            }}
            notify={notify}
          />
        )}
        {path === "/upload" &&
          (draft ? (
            <Upload
              key={draft.checkoutKey}
              draft={draft}
              notify={notify}
              handle={handle}
            />
          ) : (
            <Empty
              title="Start somewhere beautiful."
              body="Choose a photoshoot to begin your next set of photos."
            />
          ))}
        {paymentRoute && <PaymentReturn key={returnedOrder} orderId={returnedOrder!} shoots={state.shoots} />}
        {path === "/checkout" && !paymentRoute &&
          (draft ? (
            <Checkout
              key={draft.checkoutKey}
              draft={draft}
              notify={notify}
              onTerms={() => setDialog("terms")}
              onPrivacy={() => setDialog("privacy")}
            />
          ) : (
            <Empty
              title="Your checkout is clear."
              body="Find your completed shoots in My photos, or start a new one."
            />
          ))}
        {galleryError && (path === "/library" || path.startsWith("/gallery/")) && <div className="notice gallery-status" role="status">
          <Info size={18} aria-hidden="true" />
          <div>
            <p>{galleryError}</p>
            <div className="notice-actions">
              <button className="button secondary" disabled={galleryRefreshing} onClick={() => setGalleryRetry(value => value + 1)}>
                {galleryRefreshing ? "Reconnecting…" : "Retry connection"}
              </button>
            </div>
          </div>
        </div>}
        {path === "/library" && <Library shoots={state.shoots} loading={state.galleryLoading} email={state.recoveryEmail || state.email} now={now} onSettings={() => setDialog("account")} />}
        {currentShoot && (
          <Gallery
            key={currentShoot.id}
            shoot={currentShoot}
            ownedPackIds={state.shoots.map(shoot => shoot.packId)}
            now={now}
            notify={notify}
            handle={handle}
          />
        )}
        {liveMode && requestedShootId && !currentShoot && (
          <section className="shoot-recovery">
            <a className="back-link" href="#/library"><ArrowLeft size={15} />My photos</a>
            <p className="eyebrow">YOUR PERSONAL GALLERY</p>
            <h1>Your photos, <em>right here.</em></h1>
            {state.galleryLoading ? <GalleryLoading /> : <GalleryRecovery key={requestedShootId} email={state.recoveryEmail || state.email} hasShoots={false}
              targetShootId={requestedShootId} onRecovered={() => {}} />}
            <p className="muted small">Your delivery email also has your photos attached, ready to save.</p>
          </section>
        )}
        {!paymentRoute && !["/", "/upload", "/checkout", "/library"].includes(path) &&
          !currentPack &&
          !currentShoot && !(liveMode && requestedShootId) && (
            <Empty
              title="This page has moved on."
              body="Open My photos and enter your photo delivery email to find your galleries. Deleted or refunded shoots are no longer available."
            />
          )}
      </main>
      <footer className="footer shell">
        <a className="footer-brand" href={homeHref}>
          BeAnywhere
        </a>
        <span>12 photos. One payment.</span>
        <div>
          {path !== "/library" && <button onClick={() => setDialog("account")}>Photo settings</button>}
          <button onClick={() => setDialog("help")}>How it works</button>
          <button onClick={() => setDialog("privacy")}>Privacy</button>
          <button onClick={() => setDialog("terms")}>Terms</button>
        </div>
      </footer>
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Info size={17} />
            <span>{toast}</span>
            <button onClick={() => setToast("")} aria-label="Dismiss message">
              <X size={15} />
            </button>
          </>
        )}
      </div>
      {dialog && (
        <Modal
          title={
            dialog === "help"
              ? "A little tour of your studio"
              : dialog === "privacy"
                ? "Your photos, your choice"
                : dialog === "terms"
                  ? liveMode ? "Using BeAnywhere" : "About using this draft"
                  : "Photo settings"
          }
          onClose={closeDialog}
        >
          {liveMode && ["help", "privacy", "terms"].includes(dialog) && <LiveInfo type={dialog as "help" | "privacy" | "terms"} />}
          {!liveMode && dialog === "help" && (
            <div className="prose">
              <p className="lead">
                The complete experience, in a private preview.
              </p>
              <ol>
                <li>Choose a destination and your styling.</li>
                <li>Add 4–6 selfies, or use the supplied demo images.</li>
                <li>
                  Complete a simulated checkout. No payment details are
                  collected.
                </li>
                <li>
                  Explore 12 sample photo slots, save photos, try reshoots,
                  and download previews.
                </li>
              </ol>
              <div className="notice">
                <Info size={19} />
                <p>
                  Results use existing BeAnywhere marketing previews, repeated
                  across 12 slots. They are not generated from your selfies.
                  Reshoots simulate processing and reuse the sample image.
                </p>
              </div>
              <p>
                Your draft and sample shoots are saved only in this browser. You
                can clear everything from Photo settings.
              </p>
              <button className="button" onClick={closeDialog}>
                Let’s explore <ArrowRight size={18} />
              </button>
            </div>
          )}
          {!liveMode && dialog === "privacy" && (
            <div className="prose">
              <p className="lead">Your uploads stay on this device.</p>
              <p>
                This disconnected draft stores reduced-size photo copies and
                your demo email locally in browser storage. No reference photos,
                email addresses, analytics, or payments are sent to a server.
              </p>
              <p>
                Browser data can be cleared by you or your browser. Another
                person using this browser profile can access this draft. This is
                not a signed-in cloud account.
              </p>
              <p>
                Deleting a shoot removes its local record. Clearing all draft
                data removes every shoot, reference photo, and demo email.
                Downloaded files stay wherever you saved them.
              </p>
              <button className="button" onClick={() => setDialog("settings")}>
                Manage local data <ArrowRight size={17} />
              </button>
              <p className="small">
                Production privacy disclosures and provider retention settings
                must be reviewed when live services are connected.
              </p>
            </div>
          )}
          {!liveMode && dialog === "terms" && (
            <div className="prose">
              <p className="lead">This is a private, noncommercial preview.</p>
              <p>
                The displayed US$3.99 is the proposed pack price. Today’s demo
                total is US$0.00. There are no purchases, paid entitlements,
                subscriptions, real AI generations, or email deliveries.
              </p>
              <p>
                Use photos of yourself, or another adult who has explicitly
                consented. Every reference should show the same person.
                BeAnywhere is intended for adults 18 and older.
              </p>
              <p>
                Existing marketing images demonstrate settings and styling. They
                are not customer results or a guarantee of likeness. Live
                service terms, payment processing, refund handling, and privacy
                notices will be reviewed before launch.
              </p>
              <button className="button" onClick={closeDialog}>
                Got it <Check size={17} />
              </button>
            </div>
          )}
          {(dialog === "account" || dialog === "settings") && (
            <Account state={state} notify={notify} onClose={closeDialog} />
          )}
        </Modal>
      )}
    </>
  );
}

function StylingToggle({
  value,
  onChange,
}: {
  value: Styling;
  onChange: (v: Styling) => void;
}) {
  return (
    <div className="segmented" role="group" aria-label="Wardrobe styling">
      <button
        aria-pressed={value === "w"}
        className={value === "w" ? "selected" : ""}
        onClick={() => onChange("w")}
      >
        Women’s styling
      </button>
      <button
        aria-pressed={value === "m"}
        className={value === "m" ? "selected" : ""}
        onClick={() => onChange("m")}
      >
        Men’s styling
      </button>
    </div>
  );
}
function Explore({ styling, setStyling, draft }: { styling: Styling; setStyling: (s: Styling) => void; draft: Draft | null }) {
  return <section className="catalog compact-catalog" id="destinations">
    <h1>Your selfies. A new setting.</h1>
    <p className="lead">Choose a photoshoot, add your selfies, and get your photos by email.</p>
    <p className="muted small">$3.99 USD · 12 photos · 3 reshoots · No subscription</p>
    {draft && <p className="resume"><a href="#/upload">Continue your {packById(draft.packId)?.title} draft →</a></p>}
    <div className="section-heading"><h2>Choose your photoshoot</h2><StylingToggle value={styling} onChange={setStyling} /></div>
    <div className="pack-grid">{packs.map(pack => <a className="pack-card" href={`#/shoot/${pack.packId}`} key={pack.packId}>
      <div className="pack-image"><img src={cover(pack.packId, styling)} alt={`${pack.title} styling preview`} /></div>
      <div className="pack-card-heading"><h3>{pack.title}</h3><span>{money}</span></div><p>{pack.tagline}</p>
    </a>)}</div><p className="preview-caption">AI-generated previews show the setting and styling. Your results will vary.</p>
  </section>;
}

function PackDetail({
  pack,
  initialStyling,
  draft,
  onStart,
  notify,
}: {
  pack: Pack;
  initialStyling: Styling;
  draft: Draft | null;
  onStart: (s: Styling, id: string) => Promise<void>;
  notify: (s: string) => void;
}) {
  const [styling, setStyling] = useState<Styling>(
    draft?.packId === pack.packId ? draft.styling : initialStyling,
  );
  const [styleId, setStyleId] = useState(
    draft?.packId === pack.packId
      ? draft.styleId
      : pack.styleDirections[initialStyling][0].id,
  );
  const [busy, setBusy] = useState(false);
  const [scene, setScene] = useState<number | null>(null);
  const close = useCallback(() => setScene(null), []);
  const selectStyling = (v: Styling) => {
    setStyling(v);
    setStyleId(pack.styleDirections[v][0].id);
  };
  return (
    <div className="detail">
      <a className="back-link" href={homeHref}>
        <ArrowLeft size={15} />
        All photoshoots
      </a>
      <div className="detail-grid">
      <section className="scene-section detail-scenes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">12 PHOTOS TOTAL · 2 PER SCENE</p>
            <h2>
              A day in{" "}
              {pack.title === "Elevated Everyday"
                ? "your life"
                : pack.title === "Night Out"
                  ? "the city"
                  : pack.title}
              .
            </h2>
          </div>
          <span className="muted small">6 scenes included</span>
        </div>
        <div className="scene-grid">
          {pack.scenes.map((s, i) => (
            <button
              className="scene-card"
              key={s.sceneId}
              onClick={() => setScene(i)}
            >
              <img
                loading="lazy"
                src={sceneImage(pack, styling, styleId, i)}
                alt={`${s.label} illustrative preview`}
              />
              <span>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <p className="preview-caption">
          Illustrative style previews, not verified results from uploaded
          selfies.
        </p>
      </section>
        <div className="detail-copy">
          <p className="eyebrow">YOUR NEXT PHOTOSHOOT</p>
          <h1>
            {pack.title}
          </h1>
          <p className="lead">{pack.tagline}</p>
          <div className="price-row">
            <strong>{money}</strong>
            <span>
              USD per pack
              <br />
              One time. All yours.
            </span>
          </div>
          <div className="detail-facts">
            <span>
              <Images size={17} />
              12 photos total
            </span>
            <span>
              <Images size={17} />2 per scene
            </span>
            <span>
              <RotateCcw size={16} />3 reshoots
            </span>
          </div>
          <hr />
          <label className="field-label">Make the look yours</label>
          <StylingToggle value={styling} onChange={selectStyling} />
          <div className="style-options">
            {pack.styleDirections[styling].map((s) => (
              <button
                className={styleId === s.id ? "selected" : ""}
                key={s.id}
                aria-pressed={styleId === s.id}
                onClick={() => setStyleId(s.id)}
              >
                <span className="radio-dot">
                  {styleId === s.id && <span />}
                </span>
                <div>
                  <strong>{s.label}</strong>
                  <p>{s.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="detail-action">
          <button
            className="button full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onStart(styling, styleId);
              } catch (e) {
                notify((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <>
                Add your selfies <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="fine-print">
            <LockKeyhole size={12} />
            {liveMode ? "Secure checkout · One payment, no subscription" : "Private draft · Demo checkout is free"}
          </p>
        </div>
      </div>
      {scene !== null && (
        <Modal title={pack.scenes[scene].label} onClose={close} wide>
          <div className="scene-preview">
            <img
              src={sceneImage(pack, styling, styleId, scene)}
              alt={`${pack.scenes[scene].label} preview`}
            />
            <p className="muted small">Illustrative scene preview</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ShootSummary({ draft }: { draft: Draft }) {
  const pack = packById(draft.packId)!;
  return (
    <aside className="shoot-summary">
      <img
        src={cover(pack.packId, draft.styling)}
        alt={`${pack.title} preview`}
      />
      <div className="summary-body">
        <p className="eyebrow">YOUR PHOTOSHOOT</p>
        <h3>{pack.title}</h3>
        <p>
          {draft.styling === "w" ? "Women’s" : "Men’s"} styling ·{" "}
          {
            pack.styleDirections[draft.styling].find(
              (s) => s.id === draft.styleId,
            )?.label
          }
        </p>
        <ul>
          <li>
            <Check size={14} />
            12 photos total · 2 per scene
          </li>
          <li>
            <Check size={14} />3 individual reshoots
          </li>
          <li>
            <Check size={14} />
            No subscription or watermark
          </li>
        </ul>
        <div className="summary-price">
          <span>Pack price</span>
          <strong>{money} USD</strong>
        </div>
        <a href={liveMode ? `/shoots/${draft.packId}/?styling=${draft.styling}&look=${draft.styleId}` : `#/shoot/${pack.packId}`}>
          Edit your shoot <SlidersHorizontal size={13} />
        </a>
      </div>
    </aside>
  );
}
function Upload({
  draft,
  notify,
  handle,
}: {
  draft: Draft;
  notify: (s: string) => void;
  handle: (fn: () => Promise<unknown>) => Promise<void>;
}) {
  const pack = packById(draft.packId)!;
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [preparingPhoto, setPreparingPhoto] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const preparing = useRef(false);
  const preparation = useRef(0);
  useEffect(
    () => () => {
      preparation.current++;
    },
    [],
  );
  async function add(files: File[]) {
    if (preparing.current || !files.length) return;
    const analyticsStart=performance.now();
    service.track?.("reference_selection_started",{packId:draft.packId,styling:draft.styling,count:files.length});
    preparing.current = true;
    const operation = preparation.current;
    setBusy(true);
    const refs = [...draft.references];
    const errors: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setPreparingPhoto(index + 1);
        if (refs.length >= 6) {
          errors.push("You can use up to six photos.");
          break;
        }
        try {
          const ref = await prepareReference(file);
          if (operation !== preparation.current) return;
          if (refs.some((r) => r.id === ref.id)) {
            errors.push(`${file.name} is already selected.`);
            continue;
          }
          refs.push(ref);
        } catch (e) {
          errors.push((e as Error).message);
        }
      }
      if (operation !== preparation.current) return;
      if (refs.length !== draft.references.length)
        await service.updateDraft(draft, { references: refs });
      if (refs.length > draft.references.length) service.track?.("reference_selection_completed",{packId:draft.packId,styling:draft.styling,count:refs.length-draft.references.length,durationMs:Math.round(performance.now()-analyticsStart)});
      if(errors.length)trackWeb("reference_selection_failed",{packId:draft.packId,count:errors.length,error_code:"preparation_or_validation"});
      if (errors.length) notify(errors.join(" "));
    } catch (e) {
      notify((e as Error).message);
    } finally {
      preparing.current = false;
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  const [consent, setConsent] = useState(draft.consent);
  const [glasses, setGlasses] = useState(draft.wearsGlasses);
  const [savingSettings, setSavingSettings] = useState(false);
  const savingSetting = useRef(false);
  const latestDraft = useRef(draft);
  latestDraft.current = draft;
  useEffect(
    () => setConsent(draft.consent),
    [draft.consent, draft.referenceVersion],
  );
  useEffect(() => setGlasses(draft.wearsGlasses), [draft.wearsGlasses]);
  async function saveSetting(
    field: "consent" | "wearsGlasses",
    value: boolean,
  ) {
    if (savingSetting.current) return;
    savingSetting.current = true;
    setSavingSettings(true);
    if (field === "consent") setConsent(value);
    else setGlasses(value);
    try {
      await service.updateDraft(draft, { [field]: value });
    } catch (error) {
      setConsent(latestDraft.current.consent);
      setGlasses(latestDraft.current.wearsGlasses);
      notify(
        error instanceof Error
          ? error.message
          : "Your change could not be saved. Please try again.",
      );
    } finally {
      savingSetting.current = false;
      setSavingSettings(false);
    }
  }
  const ready = draft.references.length >= 4 && consent;
  return (
    <div className="flow-grid">
      <section>
        <a className="back-link" href={liveMode ? `/shoots/${draft.packId}/?styling=${draft.styling}&look=${draft.styleId}` : `#/shoot/${draft.packId}`}>
          <ArrowLeft size={15} />
          Back to your shoot
        </a>
        <h1>Add your selfies</h1>
        {draft.reusedSelfies && <p className="notice">Your previous selfies are ready to use. Keep these or choose new photos below.</p>}
        <p className="mobile-recipe">{pack.title} · {draft.styling === "w" ? "Women’s" : "Men’s"} styling · {pack.styleDirections[draft.styling].find(s => s.id === draft.styleId)?.label}</p>
        <p className="lead">
          Add 4–6 clear photos of the same person.
          <br />
          Use different angles and good lighting.
        </p>
        <div className="upload-tips">
          <span>
            <CheckCircle2 size={15} />
            One adult in every photo
          </span>
          <span>
            <CheckCircle2 size={16} />
            Good, natural light
          </span>
          <span>
            <UserRound size={15} />
            Face clearly visible
          </span>
        </div>
        <input
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          ref={input}
          aria-label="Choose reference photos"
          onChange={(e) => void add(Array.from(e.target.files || []))}
        />
        <div
          className={`drop-zone ${drag ? "drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void add(Array.from(e.dataTransfer.files));
          }}
        >
          <ImagePlus size={32} strokeWidth={1.2} />
          <h3>
            {busy ? `Preparing photo ${preparingPhoto}…` : "Choose 4–6 photos"}
          </h3>
          <p>Drag photos here, or choose from your camera roll.</p>
          <button
            className="button secondary"
            disabled={busy || draft.references.length >= 6}
            onClick={() => input.current?.click()}
          >
            {busy ? (
              <LoaderCircle size={17} className="spin" />
            ) : (
              <Plus size={17} />
            )}
            Choose photos
          </button>
          <small>JPG, PNG, WebP or HEIC · Up to 20 MB each</small>
        </div>
        <div className="upload-count">
          <strong>{draft.references.length} / 6 photos selected</strong>
          <span>
            {Math.max(0, 4 - draft.references.length) > 0
              ? `${4 - draft.references.length} more to get started`
              : "Looking good. You’re ready."}
          </span>
        </div>
        {!!draft.references.length && (
          <div className="reference-grid">
            {draft.references.map((r, i) => (
              <div className="reference" key={r.id}>
                <img
                  src={r.url}
                  alt={`Selected reference ${i + 1}: ${r.name}`}
                />
                <button
                  className="remove-photo"
                  disabled={busy}
                  aria-label={`Remove reference ${i + 1}`}
                  onClick={() =>
                    void handle(() =>
                      service.updateDraft(draft, {
                        references: draft.references.filter(
                          (v) => v.id !== r.id,
                        ),
                      }),
                    )
                  }
                >
                  <X size={14} />
                </button>
                <span>{r.sample ? "Demo" : i + 1}</span>
              </div>
            ))}
          </div>
        )}
        {!liveMode && (<button
          className="text-button demo-photos"
          disabled={busy}
          onClick={() =>
            void handle(async () => {
              await service.updateDraft(draft, {
                references: Array.from({ length: 4 }, (_, i) => ({
                  id: `sample-${pack.packId}-${draft.styling}-${draft.styleId}-${i}`,
                  name: `Demo preview ${i + 1}`,
                  url: sceneImage(pack, draft.styling, draft.styleId, i),
                  width: 720,
                  height: 1080,
                  sample: true,
                })),
                consent: false,
              });
              notify(
                "Demo images selected. These test the flow; no AI generation will run.",
              );
            })
          }
        >
          Just looking around? Use demo photos <ArrowRight size={14} />
        </button>)}
        <div className="consents">
          <label className="checkbox">
            <input
              type="checkbox"
              aria-labelledby="glasses-label"
              aria-describedby="glasses-help"
              checked={glasses}
              disabled={savingSettings}
              onChange={(e) =>
                void saveSetting("wearsGlasses", e.target.checked)
              }
            />
            <span>
              <span id="glasses-label">I’m wearing prescription glasses in these photos.</span>
              <span className="checkbox-help" id="glasses-help">Turn this on to help avoid adding sunglasses or goggles over your glasses.</span>
            </span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={consent}
              disabled={savingSettings}
              onChange={(e) => void saveSetting("consent", e.target.checked)}
            />
            <span>
              {liveMode ? "I’m 18 or older. These photos show only me. I consent to processing them to create and deliver my AI photos."
                : "I’m 18 or older. These are photos of me, an adult who has given permission, or the supplied demo images."}
            </span>
          </label>
        </div>
        <div className="flow-actions">
          <p>
            <LockKeyhole size={14} />
            {liveMode ? "Saved in this browser for your next shoot." : "Saved only in this browser."}
          </p>
          <button
            className="button"
            disabled={!ready || busy || savingSettings}
            onClick={() =>
              void handle(async () => {
                const current = (await service.read()).draft;
                if (
                  !current ||
                  current.checkoutKey !== draft.checkoutKey ||
                  current.referenceVersion !== draft.referenceVersion ||
                  current.consent !== consent ||
                  current.wearsGlasses !== glasses
                )
                  throw new Error(
                    "Your draft changed. Please review your photos and permission again.",
                  );
                go("/checkout");
              })
            }
          >
            Review my shoot <ArrowRight size={17} />
          </button>
        </div>
      </section>
      <ShootSummary draft={draft} />
    </div>
  );
}

function Checkout({
  draft,
  notify,
  onTerms,
  onPrivacy,
}: {
  draft: Draft;
  notify: (s: string) => void;
  onTerms: () => void;
  onPrivacy: () => void;
}) {
  const [email, setEmail] = useState(draft.email);
  const emailSuggestion = suggestedEmail(email);
  const [busy, setBusy] = useState(false);
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [progress, setProgress] = useState<CheckoutProgress>({ stage: "preparing" });
  const [takingLonger, setTakingLonger] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setTakingLonger(false);
    if (!busy) return;
    const timer = window.setTimeout(() => setTakingLonger(true), 15000);
    return () => window.clearTimeout(timer);
  }, [busy]);
  const progressLabel = progress.stage === "uploading" ? "Uploading your selfies…"
    : progress.stage === "checking" ? "Checking your photoshoot…"
    : progress.stage === "opening" ? "Opening secure checkout…" : "Preparing your photoshoot…";
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const checked = { ...draft, email: email.trim() };
    const invalid = validateDraft(checked);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setAttemptStarted(true);
    setError("");
    try {
      service.track?.("delivery_email_submitted",{packId:draft.packId,styling:draft.styling});
      trackWeb("begin_checkout",{packId:draft.packId,styleId:draft.styleId,styling:draft.styling});
      const shoot = await service.checkout(draft, checked.email, setProgress);
      if ("kind" in shoot && shoot.kind === "payment") {
        if (shoot.url) { window.location.assign(shoot.url); return; }
        window.history.replaceState(null, "", `${window.location.pathname}?checkout=${encodeURIComponent(shoot.orderId)}${window.location.hash}`);
        go("/payment");
      } else if ("id" in shoot) {
        go(`/gallery/${shoot.id}`);
        notify("Demo shoot created. No payment was taken.");
      }
    } catch (e) {
      service.track?.("purchase_failed",{packId:draft.packId,styling:draft.styling,reason:analyticsErrorCode(e)});
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flow-grid">
      <section>
        <a className="back-link" href="#/upload">
          <ArrowLeft size={15} />
          Back to your selfies
        </a>
        <h1>Review your photoshoot</h1>
        <p className="lead">{packById(draft.packId)?.title} · {draft.styling === "w" ? "Women’s" : "Men’s"} styling · {packById(draft.packId)?.styleDirections[draft.styling].find(s => s.id === draft.styleId)?.label}</p>
        <div className="checkout-refs">
          {draft.references.map((r, i) => (
            <img
              key={r.id}
              src={r.url}
              alt={`Your selected reference ${i + 1}`}
            />
          ))}
          <a href="#/upload">Edit photos</a>
        </div>
        <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="email">
            Photo delivery email
          </label>
          <input
            className="text-input"
            id="email"
            type="email"
            disabled={busy}
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onBlur={() => void service.updateDraft(draft, { email: email.trim() }).catch(error => setError((error as Error).message))}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            aria-describedby="email-note"
            required
            maxLength={254}
          />
          <p id="email-note" className="input-note">
            {liveMode ? "We’ll send your finished photos here. Use this email to find your photos later. You can edit it before paying." : "Saved locally for this demo. No account is created and no email is sent."}
          </p>
          {emailSuggestion && <p className="email-suggestion">Did you mean{" "}
            <button type="button" className="text-button" disabled={busy} onClick={() => {
              trackWeb("delivery_email_changed",{action:"suggestion_accepted"});
              setEmail(emailSuggestion); setError("");
              void service.updateDraft(draft, { email: emailSuggestion }).catch(error => setError((error as Error).message));
            }}>{emailSuggestion}</button>?
          </p>}
          <div className="payment-preview">
            <div className="payment-title">
              <LockKeyhole size={19} />
              <div>
                <strong>{liveMode ? "Secure checkout" : "Demo checkout"}</strong>
                <span>{liveMode ? "Pay securely with Stripe" : "No card details needed"}</span>
              </div>
              <span className="pill">{liveMode ? "ONE TIME" : "SIMULATED"}</span>
            </div>
            <div className="receipt-line">
              <span>BeAnywhere photoshoot</span>
              <span>{money}</span>
            </div>
            {!liveMode && <div className="receipt-line">
              <span>Private preview adjustment</span>
              <span>−{money}</span>
            </div>}
            <div className="receipt-total">
              <span>Due today</span>
              <strong>
                {liveMode ? money : "$0.00"} <small>USD</small>
              </strong>
            </div>
          </div>
          <p className="checkout-disclosure">
            {liveMode ? "We’ll use the photo delivery email above, even if your payment account uses another address. Continuing uploads your selfies and opens Stripe. AI results can vary." : "This preview uses sample images, not AI results from your selfies. Your reference photos never leave this browser."}
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {error && attemptStarted && service.editCheckout && <button type="button" className="text-button" disabled={busy} onClick={async () => {
            setBusy(true);
            try { await service.editCheckout!({ review: draft }); notify("Update your email or selfies, then continue to checkout."); }
            catch (e) { setError((e as Error).message); }
            finally { setBusy(false); }
          }}>Close unpaid checkout and edit</button>}
          <button className="button full" type="submit" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle size={17} className="spin" />
                {liveMode ? progressLabel : "Creating your demo…"}
              </>
            ) : (
              <>
                {liveMode ? `Continue to pay ${money}` : "Create my demo shoot"} <ArrowRight size={17} />
              </>
            )}
          </button>
          {busy && liveMode && <div className="checkout-progress">
            <span className="sr-only" role="status">{progressLabel}</span>
            {progress.stage === "uploading" && <div className="upload-progress">
              <progress aria-label="Selfie upload" max={1} value={progress.fraction || 0} />
              <span>{Math.round((progress.fraction || 0) * 100)}%</span>
            </div>}
            {takingLonger && <p className="input-note" role="status">This is taking a little longer. Keep this page open while we finish preparing checkout.</p>}
          </div>}
          <p className="fine-print terms-line">
            By continuing, you agree to the{" "}
            <button type="button" onClick={onTerms}>
              {liveMode ? "terms" : "draft terms"}
            </button>{" "}
            and{" "}
            <button type="button" onClick={onPrivacy}>
              privacy notice
            </button>
            .
          </p>
        </form>
      </section>
      <ShootSummary draft={draft} />
    </div>
  );
}

function StudioHeader({ path, count }: { path: string; count: number }) {
  return <header className="header"><div className="shell header-inner">
    <a className="wordmark" href={homeHref} aria-label="BeAnywhere home">BeAnywhere</a>
    <nav aria-label="Main navigation">
      <a className="android-link" href="https://play.google.com/store/apps/details?id=com.besties.photo">Google Play ↗</a>
      <a className={path === "/library" || path.startsWith("/gallery/") ? "active" : ""} href="#/library">
        My photos{count > 0 && <span className="count">{count}</span>}
      </a>
    </nav>
  </div></header>;
}

function GalleryLoading() {
  return <div className="gallery-loading" role="status">
    <p><LoaderCircle size={18} className="spin" aria-hidden="true" /> Loading your photoshoot…</p>
    <div className="gallery-placeholder" aria-hidden="true" />
  </div>;
}

function Library({ shoots, loading, email, now, onSettings }: { shoots: Shoot[]; loading?: boolean; email: string; now: number; onSettings: () => void }) {
  return (
    <section className="library">

      <div className="section-heading">
        <h1>My photos</h1>
        <a className="button secondary" href={homeHref}>
          <Plus size={16} />
          New photoshoot
        </a>
      </div>
      <div className="library-guidance"><p>{liveMode ? "Your photoshoots, all in one place. Open a gallery to download photos or use a reshoot." : "Your saved sample photoshoots in this browser."}</p></div>
      {liveMode && (!loading || shoots.length > 0) && <GalleryRecovery email={email} hasShoots={shoots.length > 0} onRecovered={() => {}} />}
      {shoots.length > 0 && <div className="library-toolbar">
        <span>
          {shoots.length}{" "}
          {shoots.length === 1 ? "photoshoot" : "photoshoots"}
        </span>
      </div>}
      {shoots.length ? (
        <div className="pack-grid">
          {shoots.map((shoot) => {
            const pack = packById(shoot.packId)!;
            const done = shoot.photos.filter((p) => p.readyAt <= now).length;
            const { reshootSummary, reshootDeadline, retrying, reshooting, stopped } = galleryState(shoot, now);
            return (
              <a
                className="pack-card library-card"
                key={shoot.id}
                href={`#/gallery/${shoot.id}`}
              >
                <div className="pack-image">
                  <img
                    src={cover(pack.packId, shoot.styling)}
                    alt={`${pack.title} photoshoot`}
                  />
                  <span className="library-state">
                    {done === 12 ? (
                      <Check size={13} />
                    ) : stopped ? (
                      <Info size={13} />
                    ) : (
                      <LoaderCircle className="spin" size={13} />
                    )}{" "}
                    {done === 12 ? "Ready to explore" : retrying ? "Retrying your photo" : reshooting ? "Reshoot in progress" : stopped ? `${done} photos · Open for details` : `Developing ${done}/12`}
                  </span>
                </div>
                <div className="pack-card-heading">
                  <h3>{pack.title}</h3>
                  <span>{date(shoot.createdAt)}</span>
                </div>
                <p>
                  {
                    pack.styleDirections[shoot.styling].find(
                      (s) => s.id === shoot.styleId,
                    )?.label
                  }{" "}
                </p>
                <div className="pack-meta">
                  {shoot.sample ? "12 sample slots" : `${done} photos ready`} · {reshootSummary}
                  {reshootDeadline && <span className="reshoot-deadline">Use reshoots by {reshootDeadline}.</span>}
                </div>
              </a>
            );
          })}
        </div>
      ) : loading ? <GalleryLoading /> : !liveMode || shoots.length > 0 ? (
        <Empty
          icon={<Images size={36} strokeWidth={1} />}
          title="Your photos will appear here."
          body={liveMode ? "Your paid photoshoots will appear here, including shoots still being prepared." : "Your photoshoots will live here. Pick a setting and take the demo for a spin."}
        />
      ) : <div className="new-shoot-prompt"><p>Your next setting is waiting.</p><a className="text-button" href={homeHref}>Choose a photoshoot →</a></div>}
      <div className="library-settings"><button className="text-button" onClick={onSettings}>Photo settings</button><a href="mailto:support@beanywhere.app">Get help</a></div>
      <p className="preview-caption">
        {liveMode ? "Your web photos are separate from purchases in the mobile app." : "Private draft · Sample shoots are saved to this browser only."}
      </p>
    </section>
  );
}

function Gallery({
  shoot,
  ownedPackIds,
  now,
  notify,
  handle,
}: {
  shoot: Shoot;
  ownedPackIds: string[];
  now: number;
  notify: (s: string) => void;
  handle: (fn: () => Promise<unknown>) => Promise<void>;
}) {
  const pack = packById(shoot.packId)!;
  const suggested = nextPack(shoot.packId, ownedPackIds);
  const [selected, setSelected] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const photos = shoot.photos;
  const done = shoot.photos.filter((p) => p.readyAt <= now);
  useEffect(()=>{trackWeb("gallery_opened",{packId:shoot.packId,styleId:shoot.styleId,styling:shoot.styling,count:done.length});},[shoot.id]);
  const measuredMilestones=useRef(new Set<string>());
  useEffect(()=>{for(const threshold of [6,12]){const key=shoot.id+":"+threshold;if(done.length>=threshold&&!measuredMilestones.current.has(key)){measuredMilestones.current.add(key);service.track?.(threshold===6?"results_revealed":"results_completed",{jobId:shoot.id,packId:shoot.packId,styling:shoot.styling,count:done.length});}}},[done.length,shoot.id,shoot.packId,shoot.styling]);
  const shootFailed = !shoot.sample && shoot.status === "failed";
  const providerFailed = ["bounced", "failed", "suppressed"].includes(shoot.emailDeliveryFeedback || "");
  const emailFailed = shoot.emailDeliveryFeedback !== "delivered" && (providerFailed || shoot.emailRequestState === "failed");
  const { reshooting, retrying, stopped, reshootUnavailable, reshootDeadline } = galleryState(shoot, now);
  const [retryPending, setRetryPending] = useState<string[]>([]);
  const retryRequests = useRef(new Set<string>());
  const [reshootPending, setReshootPending] = useState(false);
  const [reshootConfirmation, setReshootConfirmation] = useState<{ shootId: string; photo: Photo } | null>(null);
  const reshootRequest = useRef(false);
  const [preparedPhotos, setPreparedPhotos] = useState<(PreparedPhotos & { sources: Photo[] }) | null>(null);
  const [shareError, setShareError] = useState("");
  const [sharing, setSharing] = useState(false);
  const failedPreviews = useRef(new Set<string>());
  const [recoveredPreviews, setRecoveredPreviews] = useState<Record<string, { path: string; blob: Blob }>>({});
  const markPreviewError = useCallback((photo: Photo) => {
    if (photo.path) failedPreviews.current.add(photo.path);
  }, []);
  const recoverPreview = useCallback((photo: Photo, blob: Blob) => {
    if (photo.path && failedPreviews.current.delete(photo.path)) {
      // The viewer already recovered this exact version. Reuse its checked bytes
      // so the failed tile updates without another download or a page refresh.
      const path = photo.path;
      setRecoveredPreviews(previous => ({ ...previous, [photo.slotId]: { path, blob } }));
    }
  }, []);
  const shareAvailable = canSharePhotos();
  useEffect(() => {
    // Only invalidate bytes for photos in this save operation. Other photos can
    // finish or be reshot without dismissing a customer's prepared download.
    if (preparedPhotos?.sources.some(source => !photos.some(photo =>
      photo.slotId === source.slotId && photo.path === source.path &&
      photo.revision === source.revision && photo.url === source.url && photo.readyAt <= now))) {
      setPreparedPhotos(null);
    }
  }, [photos, now, preparedPhotos]);
  const visibleReady = photos.filter((p) => p.readyAt <= now);
  const visibleSelected = selected.filter((id) =>
    photos.some((p) => p.slotId === id),
  );
  const downloadable = visibleSelected.length
    ? visibleReady.filter((p) => visibleSelected.includes(p.slotId))
    : visibleReady;
  const activePhoto = visibleReady.find((p) => p.slotId === lightbox);
  useEffect(() => {
    if (lightbox && !activePhoto) setLightbox(null);
  }, [lightbox, activePhoto]);
  const downloadOperation = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      downloadOperation.current?.abort();
    },
    [],
  );
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const closeDelete = useCallback(() => setDeleteOpen(false), []);
  const closeReshoot = useCallback(() => setReshootConfirmation(null), []);
  const confirmationPhoto = reshootConfirmation?.photo;
  const confirmationChanged = !!reshootConfirmation && (
    reshootConfirmation.shootId !== shoot.id || !shoot.photos.some(photo =>
      photo.slotId === confirmationPhoto?.slotId && photo.path === confirmationPhoto.path &&
      photo.revision === confirmationPhoto.revision && photo.readyAt <= now)
  );
  const confirmationUnavailable = reshootUnavailable || (confirmationChanged
    ? "This photo changed. Close this message and review the latest version before reshooting." : "");
  const confirmReshoot = async () => {
    if (!reshootConfirmation || confirmationUnavailable || reshootRequest.current || busy) return;
    const { shootId, photo } = reshootConfirmation;
    trackWeb("reshoot_requested",{packId:shoot.packId,styleId:shoot.styleId,styling:shoot.styling});
    reshootRequest.current = true;
    setReshootPending(true);
    setReshootConfirmation(null);
    try {
      // Recheck persisted state in case another tab changed the shoot while the dialog was open.
      const current = (await service.read()).shoots.find(s => s.id === shootId);
      if (!current || !current.photos.some(fresh => fresh.slotId === photo.slotId &&
        fresh.path === photo.path && fresh.revision === photo.revision && fresh.readyAt <= Date.now())) {
        throw new Error("This photo changed. Review the latest version before reshooting.");
      }
      const unavailable = galleryState(current, Date.now()).reshootUnavailable;
      if (unavailable) throw new Error(unavailable);
      await service.reshoot(shootId, photo.slotId, crypto.randomUUID());
      trackWeb("reshoot_accepted",{packId:shoot.packId,styling:shoot.styling});
      notify(shoot.sample ? "Demo reshoot started. The sample image will be reused."
        : "Your reshoot request has been checked. The gallery updates as it finishes.");
    } catch(error) {
      trackWeb("reshoot_failed",{packId:shoot.packId,error_code:"request_failed"});
      throw error;
    } finally {
      reshootRequest.current = false;
      setReshootPending(false);
    }
  };
  const download = async (list: Photo[]) => {
    if (downloadOperation.current) return;
    const controller = new AbortController();
    const downloadStarted=performance.now();
    trackWeb("download_started",{packId:shoot.packId,count:list.length});
    downloadOperation.current = controller;
    setBusy(true);
    try {
      const prepared = await preparePhotoDownload(list, pack.title.replaceAll(" ", "-"), {
        signal: controller.signal,
        sample: shoot.sample,
        loadPhoto: service.photoBlob ? photo => service.photoBlob!(shoot.id, photo) : undefined,
        beforeSave: async () => {
          await service.assertPhotos?.(shoot.id, list);
          const current = (await service.read()).shoots.find(
            (s) => s.id === shoot.id,
          );
          if (
            !current ||
            list.some(
              (p) =>
                !current.photos.some(
                  (fresh) =>
                    fresh.slotId === p.slotId &&
                    fresh.revision === p.revision && fresh.path === p.path &&
                    fresh.readyAt <= Date.now(),
                ),
            )
          )
            throw new Error(
              "This shoot changed or was removed while downloading. Review it before trying again.",
            );
        },
      });
      if (canSharePhotos(prepared.files)) {
        setLightbox(null); setShareError("");
        setPreparedPhotos({ ...prepared, sources: list.map(photo => ({ ...photo })) });
      } else {
        prepared.download();
        service.track?.(list.length===1?"photo_saved":"save_all",{packId:shoot.packId,styling:shoot.styling,count:list.length,durationMs:Math.round(performance.now()-downloadStarted)});
        notify(shoot.sample ? "Sample download prepared." : "Your download is ready.");
      }
    } catch (e) {
      if (!controller.signal.aborted) { service.track?.("download_failed",{packId:shoot.packId,count:list.length,reason:"unknown"}); notify((e as Error).message); }
    } finally {
      downloadOperation.current = null;
      setBusy(false);
    }
  };
  const retryPhoto = async (photo: Photo) => {
    if (!service.retryPhoto || retryRequests.current.has(photo.slotId)) return;
    retryRequests.current.add(photo.slotId);
    setRetryPending(current => [...current, photo.slotId]);
    try { await service.retryPhoto(shoot.id, photo.slotId); }
    catch (error) { notify((error as Error).message); }
    finally {
      retryRequests.current.delete(photo.slotId);
      setRetryPending(current => current.filter(id => id !== photo.slotId));
    }
  };
  const changePhoto = (direction: number) => {
    const i = visibleReady.findIndex((p) => p.slotId === lightbox);
    setLightbox(
      visibleReady[(i + direction + visibleReady.length) % visibleReady.length]
        ?.slotId || null,
    );
  };
  return (
    <section className="gallery">
      <a className="back-link" href="#/library">
        <ArrowLeft size={15} />
        My photos
      </a>
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {reshooting ? "YOUR RESHOOT IS BEING CREATED" : retrying || retryPending.length ? "RETRYING YOUR PHOTO" : done.length < 12 && !stopped
              ? "YOUR PHOTOS ARE BEING CREATED"
              : "YOUR PHOTOSHOOT"}
          </p>
          <h1>
            {pack.title}, <em>with you.</em>
          </h1>
          <p className="lead">
            {reshooting ? `Reshooting ${reshooting} ${reshooting === 1 ? "photo" : "photos"} · ${done.length} of 12 ready` : retrying || retryPending.length ? `Retrying your photo · ${done.length} of 12 ready` : done.length < 12
              ? `${shoot.sample ? "Developing your demo" : shootFailed ? "This shoot needs attention" : shoot.generationState === "finished" ? "Shoot finished" : "Preparing your photos"} · ${done.length} of 12 ready`
              : `${shoot.sample ? "12 sample photo slots" : "12 photos ready"}${reshootUnavailable ? "" : ` · ${shoot.reshootsLeft} reshoots left`}`}
          </p>
        </div>
        <button
          className="button"
          disabled={!downloadable.length || busy}
          onClick={() => void download(downloadable)}
        >
          {busy ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Download size={17} />
          )}
          {busy ? "Preparing" : shareAvailable ? "Save" : "Download"}{" "}
          {visibleSelected.length
            ? "selected"
            : "all"}
        </button>
      </div>
      {!shoot.sample && shoot.deliveryEmail && <p className="delivery-destination">
        Photo delivery email:{" "}
        <strong>{shoot.deliveryEmail}</strong>
      </p>}
      {!shootFailed && <div className="reshoot-guide">
        <RotateCcw size={19} aria-hidden="true" />
        <p><strong>3 individual reshoots included.</strong>{" "}
          {reshootPending && !reshooting ? "Checking your reshoot request…" : reshootUnavailable ||
            "Want a different take? Use the reshoot button beneath a photo to create a new version."}
          {reshootDeadline && <span className="reshoot-deadline">Use reshoots by {reshootDeadline}.</span>}</p>
      </div>}
      {!shoot.sample && emailFailed && <div className="notice gallery-status" role="status" aria-label="Email delivery update">
        <Info size={18} aria-hidden="true" />
        <div>
          <p><strong>{shoot.emailDeliveryOutcomeUnknown && !providerFailed ? "We couldn’t confirm your email delivery." : "We couldn’t deliver your email."}</strong>{" "}
            Your photos are still available here to view and save.</p>
          <div className="notice-actions">
            <button className="button secondary" disabled={!done.length || busy} onClick={() => void download(done)}>
              {busy ? "Preparing…" : shareAvailable ? "Save photos" : "Download photos"}
            </button>
            <a className="text-button" href={`mailto:support@beanywhere.app?subject=${encodeURIComponent(`Web shoot ${shoot.id}`)}`}>Get help</a>
          </div>
        </div>
      </div>}
      {!shoot.sample && !shootFailed && <p className="order-support">Questions or problems with your order?{" "}
        <a href={`mailto:support@beanywhere.app?subject=${encodeURIComponent(`Web shoot ${shoot.id}`)}`}>Email support@beanywhere.app</a>.
      </p>}
      {reshooting > 0 && <div className="notice" role="status"><LoaderCircle size={18} className="spin" /><p>Your new version is being created. Your other photos are ready to save.</p></div>}
      {done.length < 12 && !stopped && !reshooting && !retrying && !retryPending.length && (
        <div className="progress-panel">
          <div>
            <Images size={20} />
            <span>Your photos are being created.</span>
            <strong>{Math.round((done.length / 12) * 100)}%</strong>
          </div>
          <progress
            value={done.length}
            max={12}
            aria-label={shoot.sample ? "Demo photos completed" : "Photos completed"}
          />
          <p>
            {shoot.sample ? "You can leave this page and return to My photos. Your demo progress is saved." : "You can close this page. We’ll email your finished photos. Return anytime through My photos using your photo delivery email."}
          </p>
        </div>
      )}
      {(retrying > 0 || retryPending.length > 0) && <div className="notice" role="status"><LoaderCircle size={18} className="spin" /><p>Retrying your missing photo. When ready, it will appear here to save.</p></div>}
      {!shoot.sample && shoot.photos.some(photo => photoRetryState(shoot, photo, now).available) && <p className="retry-guide">
        Retry a missing photo for free. It won’t use a reshoot. When ready, your photo will appear here to save.
      </p>}
      {shoot.sample && <div className="notice gallery-notice">
        <Info size={18} />
        <p>
          <strong>Sample gallery.</strong> These six marketing previews repeat
          across 12 slots. They weren’t generated from your selfies. Demo
          reshoots reuse the same image.
        </p>
      </div>}
      {stopped && done.length < 12 && <div className="notice"><Info size={18} /><p>{shootFailed
        ? <>We couldn’t complete your shoot. <a href={`mailto:support@beanywhere.app?subject=${encodeURIComponent(`Web shoot ${shoot.id}`)}`}>Contact support for help</a>.{" "}
          {done.length ? `You can still save the ${done.length} ${done.length === 1 ? "photo that is" : "photos that are"} ready. This shoot won’t be emailed.` : "No photos were completed, so there’s no delivery email to wait for."}</>
        : `${shoot.generationState === "paused" ? "Generation is temporarily paused." : "Some photos could not be completed."}${done.length > 0 ? " You can still save your available photos." : ""}`}</p></div>}
      <div className="gallery-toolbar">
        <span>{done.length} of 12 photos ready</span>
        <div>
          <button
            className="text-button"
            onClick={() =>
              setSelected(
                visibleSelected.length
                  ? []
                  : photos.filter((p) => p.readyAt <= now).map((p) => p.slotId),
              )
            }
          >
            {visibleSelected.length
              ? `Clear ${visibleSelected.length} selected`
              : "Select all"}
          </button>
          {shoot.sample && (<button
            className="icon-button"
            aria-label="Delete this shoot"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={17} />
          </button>)}
        </div>
      </div>
      <div className="gallery-grid">
        {photos.map((photo) => {
          const ready = photo.readyAt <= now;
          const retry = photoRetryState(shoot, photo, now);
          const requestingRetry = retryPending.includes(photo.slotId);
          const developing = photo.reshooting || (shoot.sample && photo.revision) || requestingRetry || photo.retrying || retry.working || (!stopped && !["retryable", "closed", "failed", "blocked"].includes(photo.status || ""));
          return (
            <article
              className={`photo-tile ${selected.includes(photo.slotId) ? "is-selected" : ""}`}
              key={photo.slotId}
            >
              <div className="photo-frame">
                {ready ? (
                  <>
                    <button
                      className="photo-open"
                      aria-label={`Open ${photo.label}, take ${photo.take}`}
                      onClick={() => setLightbox(photo.slotId)}
                    >
                      <StudioImage shootId={shoot.id} photo={photo}
                        previewBlob={recoveredPreviews[photo.slotId]?.path === photo.path ? recoveredPreviews[photo.slotId]?.blob : undefined}
                        onPreviewError={markPreviewError}
                        alt={`${photo.label}, take ${photo.take}${shoot.sample ? " — sample preview" : ""}`} />
                    </button>
                    <label className="select-photo">
                      <input
                        type="checkbox"
                        aria-label={`Select ${photo.slotId}`}
                        checked={selected.includes(photo.slotId)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, photo.slotId]
                              : selected.filter((id) => id !== photo.slotId),
                          )
                        }
                      />
                      <span>
                        <Check size={12} />
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="photo-developing">
                    {developing ? <LoaderCircle size={29} className="spin" /> : <Info size={29} />}
                    <span>
                      {photo.reshooting || (shoot.sample && photo.revision) ? "Reshooting…" : requestingRetry ? "Retrying…" : photo.retrying || ["retryable", "blocked", "closed", "failed"].includes(photo.status || "") || stopped ? retry.label : "Developing…"}
                    </span>
                  </div>
                )}
              </div>
              <div className="photo-caption">
                <div>
                  <strong>{photo.label}</strong>
                  <span>
                    Take {photo.take}
                    {photo.revision ? ` · Reshoot ${photo.revision}` : ""}
                  </span>
                </div>
                {ready ? (<button
                  className="reshoot-button"
                  aria-label={`Reshoot ${photo.slotId}`}
                  disabled={!ready || !!reshootUnavailable || reshootPending}
                  title={reshootUnavailable || undefined}
                  onClick={(event) => {
                    // Safari does not focus clicked buttons; retain the dialog's return point.
                    event.currentTarget.focus();
                    setReshootConfirmation({ shootId: shoot.id, photo });
                  }}
                >
                  <RotateCcw size={14} aria-hidden="true" /> Reshoot
                </button>) : retry.available && service.retryPhoto ? (
                  <button className="reshoot-button retry-button" disabled={requestingRetry}
                    aria-label={`Retry ${photo.label}, take ${photo.take} for free`}
                    onClick={() => void retryPhoto(photo)}>
                    <RotateCcw size={14} aria-hidden="true" /> {requestingRetry ? "Retrying…" : "Retry photo — free"}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      {done.length === 12 && suggested && !["failed", "refunded"].includes(shoot.status || "") && shoot.generationState !== "refund-hold" && (
        <aside className="gallery-bottom" aria-label="Your next photoshoot">
          <img className="next-shoot-cover" src={cover(suggested.packId, shoot.styling)} alt={`${suggested.title} photoshoot preview`} loading="lazy" />
          <div className="next-shoot-copy">
            <p className="eyebrow">WHEN YOU’RE READY</p>
            <h2>Next, {suggested.title}.</h2>
            <p>Another setting. Another side of you.</p>
            <p className="next-shoot-price">{money} USD · 12 new photos · 3 reshoots included</p>
            <a className="button secondary" href={liveMode ? `/shoots/${suggested.packId}/?styling=${shoot.styling}` : `#/shoot/${suggested.packId}`}>
              Explore {suggested.title} <ArrowRight size={17} />
            </a>
          </div>
        </aside>
      )}
      {reshootConfirmation && confirmationPhoto && !preparedPhotos && <Modal title="Create a new take?" onClose={closeReshoot}>
        <div className="reshoot-confirmation">
          <div className="reshoot-preview">
            <StudioImage shootId={reshootConfirmation.shootId} photo={confirmationPhoto} alt={`${confirmationPhoto.label}, take ${confirmationPhoto.take} — current photo`} />
            <div>
              <strong>{confirmationPhoto.label}</strong>
              <p className="muted small">Take {confirmationPhoto.take} · Current photo</p>
              <button className="text-button" disabled={busy || confirmationChanged} onClick={() => void download([confirmationPhoto])}>
                {busy ? <LoaderCircle size={15} className="spin" /> : <Download size={15} />}
                {busy ? "Preparing photo…" : "Save current photo"}
              </button>
            </div>
          </div>
          {!confirmationUnavailable && <p className="reshoot-cost">{shoot.reshootsLeft === 1 ? "This uses your last remaining reshoot." : `This uses 1 of your ${shoot.reshootsLeft} remaining reshoots.`}</p>}
          <p>When the new version is ready, it replaces this photo in your gallery. Save this version first if you want to keep it.</p>
          {confirmationUnavailable && <p className="form-error" role="alert">{confirmationUnavailable}</p>}
          <div className="dialog-actions">
            <button className="button secondary" onClick={closeReshoot}>Keep this photo</button>
            <button className="button" disabled={busy || reshootPending || !!confirmationUnavailable} onClick={() => void handle(confirmReshoot)}>Use 1 reshoot</button>
          </div>
        </div>
      </Modal>}
      {preparedPhotos && <Modal title="Save your photos" onClose={() => { if (!sharing) setPreparedPhotos(null); }}>
        <div className="save-photos-panel">
          <p>{preparedPhotos.files.length === 1 ? "Your photo is ready." : `Your ${preparedPhotos.files.length} photos are ready.`} Choose where to save or share them.</p>
          <p className="muted small">On iPhone, choose <strong>Save Image</strong> or <strong>Save Images</strong> to add them to Photos.</p>
          <button className="button full" disabled={sharing} onClick={async () => {
            setSharing(true); setShareError("");
            try {
              // Invoke directly from this tap: preparation/network work must not consume
              // the transient user activation required by Safari's native share sheet.
              await navigator.share({ files: preparedPhotos.files });
              trackWeb("photo_saved",{packId:shoot.packId,count:preparedPhotos.files.length,action:"share_sheet_completed"});
              setPreparedPhotos(null);
            } catch (e) {
              if ((e as Error).name !== "AbortError") setShareError("Sharing isn’t available right now. You can download your photos below.");
            } finally { setSharing(false); }
          }}>{sharing ? "Opening…" : "Save or share photos"}</button>
          {shareError && <p className="form-error" role="alert">{shareError}</p>}
          <button className="text-button" disabled={sharing} onClick={() => { preparedPhotos.download(); trackWeb("save_all",{packId:shoot.packId,count:preparedPhotos.sources.length,action:"download_handed_to_browser"}); setPreparedPhotos(null); }}>
            {preparedPhotos.files.length === 1 ? "Download photo instead" : "Download ZIP instead"}
          </button>
        </div>
      </Modal>}
      {activePhoto && (
        <Modal
          title={`${activePhoto.label} · Take ${activePhoto.take}`}
          onClose={closeLightbox}
          wide
        >
          <div className="lightbox">
            <button
              className="icon-button prev"
              aria-label="Previous photo"
              onClick={() => changePhoto(-1)}
            >
              <ChevronLeft />
            </button>
            <StudioImage shootId={shoot.id} photo={activePhoto} onPreviewReady={recoverPreview}
              alt={`${activePhoto.label}${shoot.sample ? " sample preview" : ""}`} />
            <button
              className="icon-button next"
              aria-label="Next photo"
              onClick={() => changePhoto(1)}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="lightbox-actions">
            <span className="muted small">
              {shoot.sample ? "Illustrative sample · " : "Your photo · "}
              {visibleReady.findIndex((p) => p.slotId === activePhoto.slotId) +
                1}{" "}
              / {visibleReady.length}
            </span>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void download([activePhoto])}
            >
              <Download size={16} />
              {shoot.sample ? "Save sample" : "Save photo"}
            </button>
          </div>
        </Modal>
      )}
      {deleteOpen && (
        <Modal title="Delete this sample shoot?" onClose={closeDelete}>
          <div className="prose">
            <p>
              This removes the {pack.title} shoot from this
              browser. Downloaded files stay on your device.
            </p>
            <div className="dialog-actions">
              <button className="button secondary" onClick={closeDelete}>
                Keep shoot
              </button>
              <button
                className="button danger"
                onClick={() =>
                  void handle(async () => {
                    await service.deleteShoot(shoot.id);
                    go("/library");
                    notify("Sample shoot deleted.");
                  })
                }
              >
                <Trash2 size={16} />
                Delete shoot
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Account({
  state,
  notify,
  onClose,
}: {
  state: StudioState;
  notify: (s: string) => void;
  onClose: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const act = async (fn: () => Promise<void>, message: string) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      notify(message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  if (liveMode) return <LiveAccount state={state} notify={notify} />;
  return (
    <div className="prose">
      <div className="account-card">
        <div className="avatar">
          <UserRound size={24} />
        </div>
        <div>
          <strong>Your private preview</strong>
          <p>{state.email || "No demo email saved"}</p>
          <span className="small muted">
            Local browser profile · Not a cloud account
          </span>
        </div>
      </div>
      <div className="account-stats">
        <div>
          <strong>{state.shoots.length}</strong>
          <span>Sample shoots</span>
        </div>
        <div>
          <strong>$0</strong>
          <span>Charged</span>
        </div>
      </div>
      <h3>Photo privacy</h3>
      <p>
        Your reference photos are saved only while preparing a shoot. They are
        discarded from the local draft after demo checkout.
      </p>
      <button
        className="button secondary full"
        disabled={busy || !state.draft}
        onClick={() =>
          void act(
            () => service.clearReferences(),
            "Reference photos removed from the draft.",
          )
        }
      >
        <Trash2 size={16} />
        Remove draft reference photos
      </button>
      <h3>Start fresh</h3>
      <p>
        Clear every sample shoot, selected photo, and demo email saved by this
        studio.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {confirm ? (
        <div className="confirm-clear">
          <p>
            <strong>Clear all local draft data?</strong> This cannot be undone.
          </p>
          <div className="dialog-actions">
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setConfirm(false)}
            >
              Keep my data
            </button>
            <button
              className="button danger"
              disabled={busy}
              onClick={() =>
                void act(async () => {
                  await service.reset();
                  onClose();
                  go("/");
                }, "All local draft data cleared.")
              }
            >
              <Trash2 size={16} />
              Clear everything
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-button danger-text"
          onClick={() => setConfirm(true)}
        >
          Clear all local data <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
function Empty({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="empty">
      {icon || <Images size={34} strokeWidth={1} />}
      <h2>{title}</h2>
      <p>{body}</p>
      <a className="button" href={homeHref}>
        Explore photoshoots <ArrowRight size={17} />
      </a>
    </div>
  );
}
