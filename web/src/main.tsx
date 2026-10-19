import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { currentAttribution } from "../storefront/acquisition.js";
currentAttribution();

class Boundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="fatal">
        <h1>Let’s try that again.</h1>
        <p>
          The studio couldn’t display this screen. Your saved draft is still on
          this browser.
        </p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload studio
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Boundary>
      <App />
    </Boundary>
  </React.StrictMode>,
);
