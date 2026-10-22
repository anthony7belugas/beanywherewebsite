// Optional business events only. No photos, email addresses or arbitrary URLs belong here.
export function createEventOutbox({
  read,
  write,
  allowed,
  put, remove, clearStorage,
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
  const prune = (id) => remove ? remove(id) : write(rows().filter((row) => row.id !== id));
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
      if (put) put(row); else write(saved.slice(-100));
      void flush();
    },
    setTransport(fn) {
      transport = fn;
      void flush();
    },
    flush,
    clear() {
      cancel(timer);
      if (clearStorage) clearStorage(); else write([]);
    },
  };
}

// Each event has its own storage key. Two tabs adding/removing different events
// cannot replace one another's entire queue with a stale array.
export function createPersistentEventStore({ prefix, storage, legacy = () => [], clearLegacy = () => {}, now = Date.now }) {
  const memory = new Map();
  const key = id => prefix + ':' + id;
  const remove = id => { memory.delete(id); try { storage()?.removeItem(key(id)); } catch {} };
  const read = () => {
    const rows = new Map(memory);
    try {
      const saved = storage();
      for (let i=0; saved && i<saved.length; i++) {
        const name=saved.key(i);
        if (name?.startsWith(prefix+':')) {
          try { const row=JSON.parse(saved.getItem(name)); if (row?.id) rows.set(row.id,row); } catch {}
        }
      }
    } catch {}
    const valid = [];
    for (const row of rows.values()) {
      if (row.at > now()-86400000 && row.at <= now()+300000) valid.push(row);
      else remove(row.id);
    }
    return valid.sort((a,b)=>a.at-b.at || a.id.localeCompare(b.id));
  };
  const put = row => {
    try { const saved=storage(); if (!saved) throw Error('No storage'); saved.setItem(key(row.id),JSON.stringify(row)); memory.delete(row.id); }
    catch { memory.set(row.id,row); }
    const rows=read(); for(const old of rows.slice(0,Math.max(0,rows.length-100)))remove(old.id);
  };
  // Upgrade only after collection is permitted, preserving pending old-version events.
  let migrated=false;
  const migrate=()=>{if(migrated)return;migrated=true;const old=legacy();if(Array.isArray(old))for(const row of old)if(row?.id)put(row);clearLegacy();};
  return { read:()=>{migrate();return read();}, put:row=>{migrate();put(row);}, remove,
    clear:()=>{for(const row of read())remove(row.id);clearLegacy();} };
}
