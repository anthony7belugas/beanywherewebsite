import { describe, it, expect } from "vitest";
import {
  processTrustedWebPayment,
  type TrustedPaymentEvent,
  type FrozenWebOrder,
  type PaymentStore,
} from "../integration/web-payment-core";
const event: TrustedPaymentEvent = {
  providerVerified: true,
  eventId: "e1",
  transactionId: "t1",
  webAppId: "app_web",
  environment: "sandbox",
  type: "paid",
  uid: "u1",
  orderId: "o1",
  productId: "photo.pack.standard.web",
  amountMinor: 399,
  currency: "USD",
};
const config = { webAppId: "app_web", environment: "sandbox" as const };
function memory() {
  let order: FrozenWebOrder = {
    id: "o1",
    uid: "u1",
    productId: event.productId,
    amountMinor: 399,
    currency: "USD",
    store: "WEB",
    expiresAt: 0,
    status: "pending",
    privacyBlocked: false,
  };
  const events = new Set<string>();
  let owner: string | null = null;
  let generations = 0;
  const store: PaymentStore = {
    transaction: async (work) =>
      work({
        getOrder: async (id) => (id === order.id ? order : null),
        hasEvent: async (id) => events.has(id),
        transactionOwner: async () => owner,
        applyPaid: (o, key) => {
          order = { ...o, status: "paid", transactionId: key };
          generations++;
        },
        applyRefund: (o, key) => {
          order = { ...o, status: "refunded", transactionId: key };
        },
        recordEvent: (id, _tx, orderId) => {
          events.add(id);
          owner = orderId;
        },
      }),
  };
  return {
    store,
    get order() {
      return order;
    },
    get generations() {
      return generations;
    },
    block: () => {
      order.privacyBlocked = true;
    },
  };
}
describe("staged web payment authorization", () => {
  it("grants one job for duplicate and replayed paid events, even after checkout expiry", async () => {
    const m = memory();
    await processTrustedWebPayment(event, config, m.store);
    expect(
      (await processTrustedWebPayment(event, config, m.store)).status,
    ).toBe("duplicate");
    await processTrustedWebPayment(
      { ...event, eventId: "e2" },
      config,
      m.store,
    );
    expect(m.generations).toBe(1);
  });
  it.each([
    { environment: "production" },
    { webAppId: "wrong" },
    { uid: "someone-else" },
    { amountMinor: 1 },
    { currency: "EUR" },
    { productId: "other" },
    { providerVerified: false },
  ])(
    "rejects mismatched source or frozen payment fields: %j",
    async (patch) => {
      const m = memory();
      await expect(
        processTrustedWebPayment(
          { ...event, ...patch } as TrustedPaymentEvent,
          config,
          m.store,
        ),
      ).rejects.toThrow();
      expect(m.generations).toBe(0);
    },
  );
  it("never regenerates after a refund, even if events arrive out of order", async () => {
    const m = memory();
    await processTrustedWebPayment(
      { ...event, type: "refunded" },
      config,
      m.store,
    );
    await expect(
      processTrustedWebPayment({ ...event, eventId: "e2" }, config, m.store),
    ).rejects.toThrow("Refunded");
    expect(m.generations).toBe(0);
  });
  it("holds deleted-account payments for refund/recovery instead of regenerating private data", async () => {
    const m = memory();
    m.block();
    await expect(
      processTrustedWebPayment(event, config, m.store),
    ).rejects.toThrow("privacy");
    expect(m.generations).toBe(0);
  });
});

it("rejects a second transaction trying to pay an already-paid order", async () => {
  const m = memory();
  await processTrustedWebPayment(event, config, m.store);
  await expect(
    processTrustedWebPayment(
      {
        ...event,
        eventId: "different-event",
        transactionId: "different-payment",
      },
      config,
      m.store,
    ),
  ).rejects.toThrow("different payment");
  expect(m.generations).toBe(1);
});

it("rejects malformed stored order status instead of acknowledging unfulfilled payment", async () => {
  const m = memory();
  (m.order as { status: string }).status = "unexpected";
  await expect(
    processTrustedWebPayment(event, config, m.store),
  ).rejects.toThrow();
  expect(m.generations).toBe(0);
});

it("rejects an order whose stored identifier disagrees with the requested order", async () => {
  const m = memory();
  const inconsistent: PaymentStore = {
    transaction: (work) =>
      m.store.transaction((tx) =>
        work({
          ...tx,
          getOrder: async (id) => {
            const value = await tx.getOrder(id);
            return value && { ...value, id: "other-order" };
          },
        }),
      ),
  };
  await expect(
    processTrustedWebPayment(event, config, inconsistent),
  ).rejects.toThrow();
  expect(m.generations).toBe(0);
});

it.each(["paid", "refunded"] as const)(
  "rejects a %s order with a missing transaction binding",
  async (status) => {
    const m = memory();
    m.order.status = status;
    await expect(
      processTrustedWebPayment({ ...event, type: "refunded" }, config, m.store),
    ).rejects.toThrow();
    expect(m.generations).toBe(0);
  },
);

it.each([true, 7, { toString: () => "t1" }, "bad/path"])(
  "rejects malformed payment transaction IDs: %j",
  async (transactionId) => {
    const m = memory();
    await expect(
      processTrustedWebPayment(
        { ...event, transactionId } as TrustedPaymentEvent,
        config,
        m.store,
      ),
    ).rejects.toThrow();
    expect(m.generations).toBe(0);
  },
);
