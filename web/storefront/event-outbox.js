// Optional business events only. No photos, email addresses or arbitrary URLs belong here.
export function createEventOutbox({
  read,
  write,
  allowed,
  now = Date.now,
  schedule = setTimeout,
  cancel = clearTimeout,
}) {
  let transport,
    flushing = false,
    timer;
  const rows = () => {
    const saved = read();
    return (Array.isArray(saved) ? saved : []).filter(
      (row) =>
        row &&
        typeof row.id === "string" &&
        row.at > now() - 86400000 &&
        row.at <= now() + 300000,
    );
  };
  const prune = (id) => write(rows().filter((row) => row.id !== id));
  async function flush() {
    if (flushing || !transport || !allowed()) return;
    flushing = true;
    try {
      for (let i = 0; i < 20; i++) {
        const row = rows()[0];
        if (!row || !allowed()) break;
        let reply;
        try {
          reply = await transport(row);
        } catch {
          break;
        }
        if (
          !reply ||
          !["accepted", "duplicate", "discard"].includes(reply.disposition)
        )
          break;
        prune(row.id);
      }
    } finally {
      flushing = false;
      cancel(timer);
      if (allowed() && rows().length)
        timer = schedule(() => void flush(), 30000);
    }
  }
  return {
    enqueue(row) {
      if (!allowed()) return;
      const saved = rows();
      if (!saved.some((item) => item.id === row.id)) saved.push(row);
      write(saved.slice(-100));
      void flush();
    },
    setTransport(fn) {
      transport = fn;
      void flush();
    },
    flush,
    clear() {
      cancel(timer);
      write([]);
    },
  };
}
