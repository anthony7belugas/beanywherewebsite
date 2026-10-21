import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { studioCsp, validateStudioBuild } from "./integration/studio-config";
export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  validateStudioBuild(command, mode, env);
  const live = env.VITE_STUDIO_MODE === "live";
  const csp = studioCsp(live, command === "serve");
  return {
  plugins: [react(), {
    name: "studio-security-policy",
    transformIndexHtml: (html: string) => html.replace("__STUDIO_CSP__", csp)
      .replace("__STUDIO_DESCRIPTION__", live ? "Your personal AI photoshoot. Choose a destination, upload selfies, and pay once."
        : "The BeAnywhere web studio — a private, disconnected draft."),
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "_headers", source:
        `/studio/*\n  Content-Security-Policy: ${csp}; frame-ancestors 'none'\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n/owner-browser/*\n  Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src https://us-central1-bethere-3d7de.cloudfunctions.net; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'\n  Referrer-Policy: no-referrer\n  Cache-Control: no-store\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n` });
    },
  }],
  base: "./",
  server: { port: 4178, strictPort: true },
  preview: { port: 4178, strictPort: true },
  build: { sourcemap: false },
}; });
