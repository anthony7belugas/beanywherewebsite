import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
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
  Sparkles,
  Sun,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { service, liveMode } from "./services";
import { LiveAccount, LiveInfo, PaymentReturn, StudioImage } from "./components/LiveStudio";
import {
  packs,
  packById,
  cover,
  sceneImage,
  category,
  location,
} from "./lib/catalog";
import { InvalidStoredStateError } from "./lib/stored-state";
import { emptyState, validateDraft } from "./lib/domain";
import { prepareReference, downloadPhotos } from "./lib/media";
import type {
  Draft,
  Pack,
  Photo,
  Shoot,
  StudioState,
  Styling,
} from "./lib/types";
import { Modal } from "./components/Modal";

function go(path: string) {
  window.location.hash = path;
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
  const [dialog, setDialog] = useState<Dialog>(null);
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(Date.now());
  const [offline, setOffline] = useState(!navigator.onLine);
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
    let alive = true;
    const refresh = () => {
      void service
        .read()
        .then((s) => {
          if (alive) {
            setState(s);
            setLoaded(true);
            setFatal("");
            setRecoverable(false);
          }
        })
        .catch((error: unknown) => {
          if (alive) {
            const savedDataError = error instanceof InvalidStoredStateError;
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
  }, []);
  useEffect(() => {
    const change = () => {
      setPath(pathNow());
      window.scrollTo({ top: 0 });
      main.current?.focus();
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);
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
        <Sun />
        <h1>
          {recoverable
            ? "Your saved studio needs attention."
            : liveMode ? "Your studio needs to reconnect." : "Your studio needs browser storage."}
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
      <main className="fatal">
        <LoaderCircle className="spin" />
        <p>Opening your studio…</p>
      </main>
    );
  const draft = state.draft;
  const returnedOrder = liveMode ? new URLSearchParams(window.location.search).get("checkout") : null;
  const paymentRoute = liveMode && !!returnedOrder && ["/payment", "/checkout"].includes(path);
  const currentPack = path.startsWith("/shoot/")
    ? packById(path.split("/")[2])
    : null;
  const currentShoot = path.startsWith("/gallery/")
    ? state.shoots.find((j) => j.id === path.split("/")[2])
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
      <header className="header">
        <div className="shell header-inner">
          <a className="wordmark" href="#/" aria-label="BeAnywhere home">
            <span className="brand-icon">
              <Sun size={24} />
            </span>
            BeAnywhere<span className="wordmark-period">.</span>
          </a>
          <nav aria-label="Main navigation">
            <a
              className={
                path === "/" || path.startsWith("/shoot/") ? "active" : ""
              }
              href="#/"
            >
              Explore shoots
            </a>
            <a
              className={
                path === "/library" || path.startsWith("/gallery/")
                  ? "active"
                  : ""
              }
              href="#/library"
            >
              My photos
              {state.shoots.length > 0 && (
                <span className="count">{state.shoots.length}</span>
              )}
            </a>
          </nav>
          <button
            className="account-button"
            aria-label="Open account and privacy"
            onClick={() => setDialog("account")}
          >
            <UserRound size={18} />
            <span>My studio</span>
          </button>
        </div>
      </header>
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
        {path === "/library" && <Library shoots={state.shoots} now={now} />}
        {currentShoot && (
          <Gallery
            key={currentShoot.id}
            shoot={currentShoot}
            now={now}
            notify={notify}
            handle={handle}
          />
        )}
        {!paymentRoute && !["/", "/upload", "/checkout", "/library"].includes(path) &&
          !currentPack &&
          !currentShoot && (
            <Empty
              title="This page has moved on."
              body="This shoot may have been removed from your browser. Explore a new destination or check My photos."
            />
          )}
      </main>
      <footer className="footer shell">
        <a className="footer-brand" href="#/">
          BeAnywhere.
        </a>
        <span>A little imagination. A whole new setting.</span>
        <div>
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
                  : "Your studio"
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
                  Explore 12 sample photo slots, save favorites, try reshoots,
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
                can clear everything from My studio.
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
function Explore({
  styling,
  setStyling,
  draft,
}: {
  styling: Styling;
  setStyling: (v: Styling) => void;
  draft: Draft | null;
}) {
  const [filter, setFilter] = useState("All shoots");
  const [search, setSearch] = useState("");
  const shown = packs.filter(
    (p) =>
      (filter === "All shoots" || category(p.packId) === filter) &&
      `${p.title} ${p.tagline}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            YOUR PERSONAL PHOTO STUDIO
          </p>
          <h1>
            You, somewhere
            <br />
            <em>extraordinary.</em>
          </h1>
          <p className="hero-description">
            A café in Paris. Golden light in Santorini.
            <br />
            Turn your selfies into a photoshoot worth keeping.
          </p>
          <a
            className="button"
            href="#destinations"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("destinations")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Find your next setting <ArrowDown size={17} />
          </a>
          <div className="hero-facts">
            <span>12 photos</span>
            <i />
            <span>3 reshoots</span>
            <i />
            <span>No subscription</span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Illustrative BeAnywhere shoot previews"
        >
          <div className="orbit-label">A CHANGE OF SCENERY</div>
          <figure className="print print-back">
            <img
              src={cover("santorini", styling)}
              alt="Santorini marketing preview"
            />
            <figcaption>
              <span>Santorini</span>36.46° N
            </figcaption>
          </figure>
          <figure className="print print-front">
            <img src={cover("paris", styling)} alt="Paris marketing preview" />
            <figcaption>
              <span>Paris</span>48.86° N
            </figcaption>
          </figure>
          <span className="hero-stamp">
            <Sun size={21} />A little
            <br />
            possibility.
          </span>
        </div>
      </section>
      {draft && (
        <div className="resume">
          <div>
            <span className="status-dot" />
            <strong>
              Your {packById(draft.packId)?.title} shoot is waiting.
            </strong>
            <span>{draft.references.length} of 4–6 selfies selected</span>
          </div>
          <a href="#/upload">
            Continue your draft <ArrowRight size={16} />
          </a>
        </div>
      )}
      <section className="catalog" id="destinations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2>Where will you be?</h2>
          </div>
          <StylingToggle value={styling} onChange={setStyling} />
        </div>
        <div className="catalog-toolbar">
          <div className="filters" role="group" aria-label="Filter shoots">
            {["All shoots", "Escapes", "Everyday & evenings"].map((f) => (
              <button
                className={filter === f ? "selected" : ""}
                aria-pressed={filter === f}
                key={f}
                onClick={() => setFilter(f)}
              >
                {f}
                {f === "All shoots" && <span>06</span>}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={16} />
            <input
              aria-label="Search shoots"
              placeholder="Find a setting"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button aria-label="Clear search" onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        <div className="pack-grid">
          {shown.map((pack, i) => (
            <a
              className="pack-card"
              href={`#/shoot/${pack.packId}`}
              key={pack.packId}
            >
              <div className="pack-image">
                <img
                  src={cover(pack.packId, styling)}
                  alt={`${pack.title} ${styling === "w" ? "women’s" : "men’s"} styling preview`}
                  loading={i > 2 ? "lazy" : "eager"}
                />
                <span className="image-label">
                  <MapPin size={11} />
                  {location(pack.packId)}
                </span>
                <span className="pack-arrow">
                  <ArrowRight size={21} />
                </span>
              </div>
              <div className="pack-card-heading">
                <h3>{pack.title}</h3>
                <span>{money}</span>
              </div>
              <p>{pack.tagline}</p>
              <div className="pack-meta">
                6 scenes <span>·</span> 12 photos <span>·</span> 2 looks
              </div>
            </a>
          ))}
        </div>
        {!shown.length && (
          <div className="no-results">
            <Search />
            <h3>No settings found.</h3>
            <p>Try another search, or explore all six shoots.</p>
            <button
              className="button secondary"
              onClick={() => {
                setSearch("");
                setFilter("All shoots");
              }}
            >
              Show all shoots
            </button>
          </div>
        )}
        <p className="preview-caption">
          {liveMode ? "Collection imagery illustrates the setting and styling. Your AI results will vary." : "Collection imagery is illustrative. Your photos will be unique when live generation is connected."}
        </p>
      </section>
      <section className="how">
        <div>
          <p className="eyebrow">A LITTLE SELFIE MAGIC</p>
          <h2>
            From your camera roll
            <br />
            to your <em>next favorite photo.</em>
          </h2>
        </div>
        <div className="how-steps">
          {[
            [
              "01",
              "Make it your scene.",
              "Choose a destination, then find a look that feels like you.",
            ],
            [
              "02",
              "Bring yourself.",
              "Add 4–6 clear selfies of the same person, from different angles.",
            ],
            [
              "03",
              "Keep your favorites.",
              "Explore your photos, try a reshoot, and save the ones you love.",
            ],
          ].map(([n, title, desc]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="reassurance">
        <ShieldCheck size={20} />
        <span>Your face. Your choice. Your photos stay private.</span>
        <span>One pack, one payment. Always.</span>
      </div>
    </>
  );
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
      <a className="back-link" href="#/">
        <ArrowLeft size={15} />
        All photoshoots
      </a>
      <div className="detail-grid">
        <div className="detail-visual">
          <img
            className="detail-cover"
            src={cover(pack.packId, styling)}
            alt={`${pack.title} illustrative cover`}
          />
          <span className="image-label">
            <MapPin size={12} />
            {location(pack.packId)}
          </span>
          <span className="cover-caption">A preview of the possibilities</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">YOUR NEXT PHOTOSHOOT</p>
          <h1>
            {pack.title}
            <span>.</span>
          </h1>
          <p className="lead">{pack.tagline}</p>
          <div className="detail-facts">
            <span>
              <Images size={17} />
              12 photos
            </span>
            <span>
              <RotateCcw size={16} />3 reshoots
            </span>
            <span>
              <Sun size={17} />6 scenes
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
          <div className="price-row">
            <strong>{money}</strong>
            <span>
              USD per pack
              <br />
              One time. All yours.
            </span>
          </div>
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
                Create my {pack.title} shoot <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="fine-print">
            <LockKeyhole size={12} />
            Private draft · Demo checkout is free
          </p>
        </div>
      </div>
      <section className="scene-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SIX SCENES. ONE STORY.</p>
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
          <span className="muted small">Two takes of every scene</span>
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
            12 photos across six scenes
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
        <a href={`#/shoot/${pack.packId}`}>
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
    preparing.current = true;
    const operation = preparation.current;
    setBusy(true);
    const refs = [...draft.references];
    const errors: string[] = [];
    try {
      for (const file of files) {
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
        <a className="back-link" href={`#/shoot/${draft.packId}`}>
          <ArrowLeft size={15} />
          Back to your shoot
        </a>
        <p className="eyebrow">A FEW PHOTOS. ALL YOU.</p>
        <h1>
          Bring your best <em>selfies.</em>
        </h1>
        <p className="lead">
          Add 4–6 clear photos of the same person.
          <br />
          Different angles help tell the whole story.
        </p>
        <div className="upload-tips">
          <span>
            <CheckCircle2 size={15} />
            One adult in every photo
          </span>
          <span>
            <Sun size={16} />
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
          accept="image/jpeg,image/png,image/webp"
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
            {busy ? "Preparing your photos…" : "Your next chapter starts here."}
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
          <small>JPG, PNG or WebP · Up to 20 MB each</small>
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
              checked={glasses}
              disabled={savingSettings}
              onChange={(e) =>
                void saveSetting("wearsGlasses", e.target.checked)
              }
            />
            <span>I wear glasses. Keep them part of my look.</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={consent}
              disabled={savingSettings}
              onChange={(e) => void saveSetting("consent", e.target.checked)}
            />
            <span>
              {liveMode ? "I’m 18 or older. These photos show me or another adult who has explicitly agreed to this photoshoot."
                : "I’m 18 or older. These are photos of me, an adult who has given permission, or the supplied demo images."}
            </span>
          </label>
        </div>
        <div className="flow-actions">
          <p>
            <LockKeyhole size={14} />
            {liveMode ? "Saved in this browser until checkout." : "Saved only in this browser."}
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
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
    setError("");
    try {
      const shoot = await service.checkout(draft, checked.email);
      if ("kind" in shoot && shoot.kind === "payment") {
        if (shoot.url) { window.location.assign(shoot.url); return; }
        window.history.replaceState(null, "", `${window.location.pathname}?checkout=${encodeURIComponent(shoot.orderId)}${window.location.hash}`);
        go("/payment");
      } else if ("id" in shoot) {
        go(`/gallery/${shoot.id}`);
        notify("Demo shoot created. No payment was taken.");
      }
    } catch (e) {
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
        <p className="eyebrow">ONE LAST LOOK</p>
        <h1>
          Ready for a <em>new setting?</em>
        </h1>
        <p className="lead">Your photoshoot is all set. Let’s make it yours.</p>
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
            Your email
          </label>
          <input
            className="text-input"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            aria-describedby="email-note"
            required
            maxLength={254}
          />
          <p id="email-note" className="input-note">
            {liveMode ? "Use an email you can receive messages at. No Google login is needed." : "Saved locally for this demo. No account is created and no email is sent."}
          </p>
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
            {liveMode ? "Continuing uploads your selfies and opens Stripe checkout. Generation begins only after the server confirms payment. AI results can vary." : "This preview uses sample images, not AI results from your selfies. Your reference photos never leave this browser."}
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button full" type="submit" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle size={17} className="spin" />
                {liveMode ? "Preparing secure checkout…" : "Creating your demo…"}
              </>
            ) : (
              <>
                {liveMode ? `Continue to pay ${money}` : "Create my demo shoot"} <Sparkles size={17} />
              </>
            )}
          </button>
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

function Library({ shoots, now }: { shoots: Shoot[]; now: number }) {
  const [filter, setFilter] = useState("All shoots");
  const filtered = shoots.filter(
    (s) => filter === "All shoots" || s.photos.some((p) => p.favorite),
  );
  return (
    <section className="library">
      <p className="eyebrow">YOUR OWN LITTLE COLLECTION</p>
      <div className="section-heading">
        <h1>
          Good moments.
          <br />
          <em>Worth keeping.</em>
        </h1>
        <a className="button secondary" href="#/">
          <Plus size={16} />
          New photoshoot
        </a>
      </div>
      <div className="library-toolbar">
        <div className="filters">
          {["All shoots", "With favorites"].map((f) => (
            <button
              className={filter === f ? "selected" : ""}
              aria-pressed={filter === f}
              key={f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span>
          {filtered.length}{" "}
          {filtered.length === 1 ? "photoshoot" : "photoshoots"}
        </span>
      </div>
      {filtered.length ? (
        <div className="pack-grid">
          {filtered.map((shoot) => {
            const pack = packById(shoot.packId)!;
            const done = shoot.photos.filter((p) => p.readyAt <= now).length;
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
                    ) : !shoot.sample && ["failed", "finished", "paused", "manual-review", "refund-hold"].some(value => value === shoot.status || value === shoot.generationState) ? (
                      <Info size={13} />
                    ) : (
                      <LoaderCircle className="spin" size={13} />
                    )}{" "}
                    {done === 12 ? "Ready to explore" : !shoot.sample && ["failed", "finished", "paused", "manual-review", "refund-hold"].includes(shoot.generationState || shoot.status || "") ? `${done} photos · Open for details` : `Developing ${done}/12`}
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
                  · {shoot.photos.filter((p) => p.favorite).length} favorites
                </p>
                <div className="pack-meta">
                  {shoot.sample ? "12 sample slots" : `${done} photos ready`} · {shoot.reshootsLeft} reshoots left
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={<Images size={36} strokeWidth={1} />}
          title={
            filter === "All shoots"
              ? "Your story starts here."
              : "Make a few favorites."
          }
          body={
            filter === "All shoots"
              ? liveMode ? "Your paid photoshoots will appear here, including shoots still being prepared." : "Your photoshoots will live here. Pick a setting and take the demo for a spin."
              : "Tap the heart on a photo to add it to your favorites."
          }
        />
      )}
      <p className="preview-caption">
        {liveMode ? "Your web photos are separate from purchases in the mobile app." : "Private draft · Sample shoots are saved to this browser only."}
      </p>
    </section>
  );
}

function Gallery({
  shoot,
  now,
  notify,
  handle,
}: {
  shoot: Shoot;
  now: number;
  notify: (s: string) => void;
  handle: (fn: () => Promise<unknown>) => Promise<void>;
}) {
  const pack = packById(shoot.packId)!;
  const [favorites, setFavorites] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const photos = shoot.photos.filter((p) => !favorites || p.favorite);
  const done = shoot.photos.filter((p) => p.readyAt <= now);
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
  const download = async (list: Photo[]) => {
    if (downloadOperation.current) return;
    const controller = new AbortController();
    downloadOperation.current = controller;
    setBusy(true);
    try {
      await downloadPhotos(list, pack.title.replaceAll(" ", "-"), {
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
      notify(shoot.sample ? "Sample download prepared." : "Your download is ready.");
    } catch (e) {
      if (!controller.signal.aborted) notify((e as Error).message);
    } finally {
      downloadOperation.current = null;
      setBusy(false);
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
            {done.length < 12
              ? "A LITTLE MAGIC IN PROGRESS"
              : "YOUR PHOTOSHOOT"}
          </p>
          <h1>
            {pack.title}, <em>with you.</em>
          </h1>
          <p className="lead">
            {done.length < 12
              ? `${shoot.sample ? "Developing your demo" : shoot.generationState === "finished" ? "Shoot finished" : shoot.status === "failed" ? "This shoot needs attention" : "Preparing your photos"} · ${done.length} of 12 ready`
              : `${shoot.sample ? "12 sample photo slots" : "12 photos ready"} · ${shoot.reshootsLeft} reshoots left`}
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
          Download{" "}
          {visibleSelected.length
            ? "selected"
            : favorites
              ? "favorites"
              : "all"}
        </button>
      </div>
      {done.length < 12 && (
        <div className="progress-panel">
          <div>
            <Sun size={20} />
            <span>Finding the light. Framing the moment.</span>
            <strong>{Math.round((done.length / 12) * 100)}%</strong>
          </div>
          <progress
            value={done.length}
            max={12}
            aria-label={shoot.sample ? "Demo photos completed" : "Photos completed"}
          />
          <p>
            {shoot.sample ? "You can leave this page and return to My photos. Your demo progress is saved." : "Processing continues if you close this page. Return to My photos in this browser to check your shoot."}
          </p>
        </div>
      )}
      {shoot.sample && <div className="notice gallery-notice">
        <Info size={18} />
        <p>
          <strong>Sample gallery.</strong> These six marketing previews repeat
          across 12 slots. They weren’t generated from your selfies. Demo
          reshoots reuse the same image.
        </p>
      </div>}
      {!shoot.sample && ["failed", "finished", "paused", "manual-review", "refund-hold"].some(value => value === shoot.status || value === shoot.generationState) && done.length < 12 && <div className="notice"><Info size={18} /><p>{shoot.generationState === "paused" ? "Generation is temporarily paused." : "Some photos could not be completed."} Your available photos can still be downloaded. <a href={`mailto:support@beanywhere.app?subject=${encodeURIComponent(`Web shoot ${shoot.id}`)}`}>Contact support about this shoot</a>.</p></div>}
      <div className="gallery-toolbar">
        <div className="filters">
          <button
            className={!favorites ? "selected" : ""}
            aria-pressed={!favorites}
            onClick={() => {
              setFavorites(false);
              setSelected([]);
            }}
          >
            All photos <span>12</span>
          </button>
          <button
            className={favorites ? "selected" : ""}
            aria-pressed={favorites}
            onClick={() => {
              setFavorites(true);
              setSelected([]);
            }}
          >
            <Heart size={14} />
            Favorites{" "}
            <span>{shoot.photos.filter((p) => p.favorite).length}</span>
          </button>
        </div>
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
                    <button
                      className={`favorite ${photo.favorite ? "liked" : ""}`}
                      aria-label={`${photo.favorite ? "Unfavorite" : "Favorite"} ${photo.slotId}`}
                      aria-pressed={photo.favorite}
                      onClick={() =>
                        void handle(() =>
                          service.setFavorite(
                            shoot.id,
                            photo.slotId,
                            !photo.favorite,
                          ),
                        )
                      }
                    >
                      <Heart
                        size={16}
                        fill={photo.favorite ? "currentColor" : "none"}
                      />
                    </button>
                  </>
                ) : (
                  <div className="photo-developing">
                    <Sun size={29} className="slow-spin" />
                    <span>
                      {!shoot.sample && ["failed", "finished", "manual-review", "paused"].some(value => value === shoot.status || value === shoot.generationState) ? "Not ready" : photo.revision ? "Reshooting…" : "Developing…"}
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
                <button
                  className="icon-button"
                  aria-label={`Reshoot ${photo.slotId}`}
                  disabled={!ready || shoot.reshootsLeft === 0}
                  onClick={() =>
                    void handle(async () => {
                      await service.reshoot(
                        shoot.id,
                        photo.slotId,
                        crypto.randomUUID(),
                      );
                      notify(
                        shoot.sample ? "Demo reshoot started. The sample image will be reused." : "Your reshoot request has been checked. The gallery updates as it finishes.",
                      );
                    })
                  }
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {!photos.length && (
        <div className="no-results">
          <Heart />
          <h3>Your favorites will be right here.</h3>
          <p>Tap a heart on any photo in your shoot.</p>
          <button
            className="button secondary"
            onClick={() => setFavorites(false)}
          >
            See all photos
          </button>
        </div>
      )}
      <div className="gallery-bottom">
        <div>
          <h3>Another setting. Another side of you.</h3>
          <p>Explore somewhere new whenever the mood strikes.</p>
        </div>
        <a className="button secondary" href="#/">
          Find my next shoot <ArrowRight size={17} />
        </a>
      </div>
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
            <StudioImage shootId={shoot.id} photo={activePhoto} alt={`${activePhoto.label}${shoot.sample ? " sample preview" : ""}`} />
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
              className={`icon-button ${activePhoto.favorite ? "liked" : ""}`}
              aria-label="Toggle favorite photo"
              onClick={() =>
                void handle(() =>
                  service.setFavorite(
                    shoot.id,
                    activePhoto.slotId,
                    !activePhoto.favorite,
                  ),
                )
              }
            >
              <Heart
                fill={activePhoto.favorite ? "currentColor" : "none"}
                size={20}
              />
            </button>
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
              This removes the {pack.title} shoot and its favorites from this
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
          <strong>
            {state.shoots.reduce(
              (n, s) => n + s.photos.filter((p) => p.favorite).length,
              0,
            )}
          </strong>
          <span>Favorites</span>
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
      {icon || <Sun size={34} strokeWidth={1} />}
      <h2>{title}</h2>
      <p>{body}</p>
      <a className="button" href="#/">
        Explore photoshoots <ArrowRight size={17} />
      </a>
    </div>
  );
}
