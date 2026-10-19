/** Pure staging module. No server initialization, credentials, provider calls, or deployments.
 * The eventual HTTPS handler must authenticate the raw provider webhook BEFORE normalizing it.
 * All transaction work below must run in ONE Firestore transaction in its concrete implementation.
 */
export type TrustedPaymentEvent = {
  providerVerified: true;
  eventId: string;
  transactionId: string;
  webAppId: string;
  environment: "sandbox" | "production";
  type: "paid" | "refunded";
  uid: string;
  orderId: string;
  productId: string;
  amountMinor: number;
  currency: string;
};
export type FrozenWebOrder = {
  id: string;
  uid: string;
  productId: string;
  amountMinor: number;
  currency: string;
  store: "WEB";
  expiresAt: number;
  status: "pending" | "paid" | "refunded";
  transactionId?: string;
  privacyBlocked: boolean;
};
export interface PaymentTransaction {
  getOrder(id: string): Promise<FrozenWebOrder | null>;
  hasEvent(id: string): Promise<boolean>;
  transactionOwner(id: string): Promise<string | null>;
  /** Must enqueue through existing purchase authorization + job lifecycle. Never write client-authorized jobs. */
  applyPaid(order: FrozenWebOrder, transactionKey: string): void;
  applyRefund(order: FrozenWebOrder, transactionKey: string): void;
  recordEvent(eventKey: string, transactionKey: string, orderId: string): void;
}
export type PaymentStore = {
  transaction<T>(work: (tx: PaymentTransaction) => Promise<T>): Promise<T>;
};
// The provider normalizer must produce bounded, path-safe string identifiers.
const paymentId = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_.:-]{1,256}$/.test(value);
export async function processTrustedWebPayment(
  event: TrustedPaymentEvent,
  config: { webAppId: string; environment: "sandbox" | "production" },
  store: PaymentStore,
) {
  if (
    event.providerVerified !== true ||
    event.webAppId !== config.webAppId ||
    event.environment !== config.environment
  )
    throw new Error("Payment source is not allowed.");
  if (
    !paymentId(event.eventId) ||
    !paymentId(event.transactionId) ||
    !paymentId(event.uid) ||
    !paymentId(event.orderId) ||
    !paymentId(event.productId) ||
    !paymentId(event.webAppId) ||
    !["sandbox", "production"].includes(event.environment) ||
    typeof event.currency !== "string" ||
    !/^[A-Z]{3}$/.test(event.currency) ||
    !Number.isSafeInteger(event.amountMinor) ||
    event.amountMinor < 0 ||
    !["paid", "refunded"].includes(event.type)
  )
    throw new Error("Malformed payment event.");
  const key = `web:${event.environment}:${event.transactionId}`;
  const eventKey = `web:${event.environment}:${event.eventId}`;
  return store.transaction(async (tx) => {
    if (await tx.hasEvent(eventKey)) return { status: "duplicate" as const };
    const order = await tx.getOrder(event.orderId);
    const owner = await tx.transactionOwner(key);
    if (
      !order ||
      order.id !== event.orderId ||
      order.store !== "WEB" ||
      !["pending", "paid", "refunded"].includes(order.status) ||
      typeof order.privacyBlocked !== "boolean" ||
      order.uid !== event.uid ||
      order.productId !== event.productId ||
      order.amountMinor !== event.amountMinor ||
      order.currency !== event.currency
    )
      throw new Error("Payment does not match the frozen order.");
    if (owner !== null && owner !== order.id)
      throw new Error("Payment already belongs to another order.");
    if (order.status !== "pending" && typeof order.transactionId !== "string")
      throw new Error("Completed order is missing its payment binding.");
    if (order.transactionId !== undefined && order.transactionId !== key)
      throw new Error("Order already has a different payment.");
    if (order.privacyBlocked)
      throw new Error("Order requires privacy-safe recovery or refund review.");
    if (event.type === "paid") {
      // A verified delayed payment remains an obligation even after checkout expiry.
      // Never allow an old payment event to reopen a refunded order.
      if (order.status === "refunded")
        throw new Error("Refunded order cannot be reopened by a paid event.");
      if (order.status === "pending") tx.applyPaid(order, key);
    } else {
      // Refunds may arrive before paid events; mark them terminal without generating.
      if (order.status !== "refunded") tx.applyRefund(order, key);
    }
    tx.recordEvent(eventKey, key, order.id);
    return { status: "applied" as const };
  });
}
