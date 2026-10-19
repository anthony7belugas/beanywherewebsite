#!/usr/bin/env python3
"""Serve only the prebuilt disconnected draft, on this Mac's loopback interface."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser
import sys

ROOT = Path(__file__).resolve().parent.parent / "dist"
URL = "http://127.0.0.1:4178/"

class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

if not (ROOT / "index.html").is_file():
    raise SystemExit("The built preview is missing. Run npm install and npm run build first.")
try:
    server = ThreadingHTTPServer(("127.0.0.1", 4178), partial(PreviewHandler, directory=str(ROOT)))
except OSError:
    print("Port 4178 is already in use. If the BeAnywhere preview is already running, open " + URL)
    input("Press Return to close this window.")
    raise SystemExit(1)
print("\nBeAnywhere private draft\n" + URL + "\nOnly this computer can connect. No live services are connected.\nKeep this window open. Press Control-C to stop.\n")
if '--no-open' not in sys.argv:
    threading.Timer(0.5, lambda: webbrowser.open(URL)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nPreview stopped. Your files remain saved.")
finally:
    server.server_close()
