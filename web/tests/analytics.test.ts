import { expect, it } from "vitest";
import { safePage, safeParams, nextIdentity } from "../storefront/analytics.js";
import {
  captureAttribution,
  directAttribution,
} from "../storefront/acquisition.js";
const now = Date.parse("2026-10-20T10:00:00Z");
let sequence = 0;
const uuid = () =>
  `00000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`;
it("preserves a browser across visits and starts a new session after 30 minutes of inactivity", () => {
  const first = nextIdentity(null, {
    now,
    uuid,
    attribution: {
      ...directAttribution(),
      source: "google",
      medium: "organic",
    },
  });
  const second = nextIdentity(first, {
    now: now + 29 * 60000,
    uuid,
    attribution: directAttribution(),
  });
  expect(second.clientId).toBe(first.clientId);
  expect(second.sessionId).toBe(first.sessionId);
  expect(second.sessionAttribution.source).toBe("google");
  const returned = nextIdentity(second, {
    now: now + 60 * 60000,
    uuid,
    attribution: directAttribution(),
  });
  expect(returned.clientId).toBe(first.clientId);
  expect(returned.sessionId).not.toBe(first.sessionId);
  expect(returned.firstAttribution.source).toBe("google");
  expect(returned.sessionAttribution.source).toBe("direct");
  expect(returned.visitNumber).toBe(2);
});
it("never sends gallery ids, email queries, checkout tokens, or arbitrary paths as page URLs", () => {
  expect(
    safePage(
      "https://beanywhere.app/studio/?email=private@example.com&checkout=secret#/gallery/private-id",
    ),
  ).toBe("/studio/gallery");
  expect(safePage("https://beanywhere.app/customer/private@example.com")).toBe(
    "/other",
  );
  expect(
    safePage("https://beanywhere.app/shoots/alpine/?email=private@example.com"),
  ).toBe("/shoots/alpine/");
  const values = safeParams({
    email: "private@example.com",
    url: "https://private",
    jobId: "secret",
    packId: "paris",
    styleId: "chic",
    count: 4,
    durationMs: 1000,
    reason: "unknown",
    campaign: "private@example.com",
  });
  expect(values).toEqual({
    pack_id: "paris",
    style_id: "chic",
    count: 4,
    duration_ms: 1000,
    error_code: "unknown",
  });
});
it("records unfamiliar referring domains without their private path and excludes Stripe returns", () => {
  const referred = captureAttribution({
    url: "https://beanywhere.app/",
    referrer: "https://blog.example/articles/private?email=private@example.com",
    now,
  });
  expect(referred).toMatchObject({
    source: "blog.example",
    medium: "referral",
  });
  expect(JSON.stringify(referred)).not.toContain("private");
  expect(
    captureAttribution({
      url: "https://beanywhere.app/studio/#/payment",
      referrer: "https://checkout.stripe.com/c/pay/secret",
      now,
    }),
  ).toEqual(directAttribution());
});

import {
  createEventOutbox,
  type QueuedEvent,
} from "../storefront/event-outbox.js";
it("retries with the same event id and timestamp, removes acknowledged events, and clears on withdrawal", async () => {
  let stored: QueuedEvent[] = [];
  let allowed = true;
  let retry: () => void = () => {};
  const sent: QueuedEvent[] = [];
  const queue = createEventOutbox({
    read: () => stored,
    write: (rows) => {
      stored = rows;
    },
    allowed: () => allowed,
    now: () => now,
    schedule: (fn) => {
      retry = fn;
      return 1;
    },
    cancel: () => {},
  });
  const row = {
    id: uuid(),
    name: "checkout_viewed",
    params: { packId: "paris" },
    at: now - 100,
  };
  queue.enqueue(row);
  queue.enqueue(row);
  expect(stored).toHaveLength(1);
  queue.setTransport(async (event) => {
    sent.push(event);
    return { disposition: sent.length === 1 ? "retry" : "accepted" };
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(stored).toHaveLength(1);
  retry();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(stored).toHaveLength(0);
  expect(sent[0]).toEqual(sent[1]);
  allowed = false;
  queue.enqueue({ ...row, id: uuid() });
  expect(stored).toHaveLength(0);
  queue.clear();
});

import { createPersistentEventStore } from '../storefront/event-outbox.js';
it('two browser tabs retain separate pending events when one acknowledges a stale snapshot',()=>{
  const data=new Map<string,string>();
  const storage={get length(){return data.size;},key:(i:number)=>[...data.keys()][i],getItem:(key:string)=>data.get(key)||null,
    setItem:(key:string,value:string)=>{data.set(key,value);},removeItem:(key:string)=>{data.delete(key);}} as Storage;
  const a=createPersistentEventStore({prefix:'queue',storage:()=>storage,now:()=>now});
  const b=createPersistentEventStore({prefix:'queue',storage:()=>storage,now:()=>now});
  const first={id:uuid(),name:'page_view',params:{},at:now},second={...first,id:uuid()};
  a.put(first);const stale=a.read();b.put(second);a.remove(stale[0].id);
  expect(b.read()).toEqual([second]);
});
it('campaign names with spaces survive while emails and arbitrary URLs are rejected',()=>{
  expect(captureAttribution({url:'https://beanywhere.app/?utm_source=Instagram&utm_campaign=Fall%20Launch&utm_content=Reel%201',now}))
    .toMatchObject({source:'instagram',campaign:'fall_launch',content:'reel_1'});
  expect(captureAttribution({url:'https://beanywhere.app/?utm_source=instagram&utm_campaign=private%40example.com',now}).campaign).toBe('');
});
