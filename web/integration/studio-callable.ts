import { httpsCallable, type Functions } from "firebase/functions";

// These small operations reuse one service that scales to zero. Photo decoding stays isolated;
// all operations still execute their original server admission/payment checks.
const shared = new Set([
  "authWithWebSession", "listWebGalleries", "recoverWebGalleries",
  "checkPackReadiness", "createReferenceUploadSession", "commitReferenceMetadata",
  "createOrder", "createWebCheckout", "getWebCheckoutStatus", "cancelWebCheckout",
]);

export function studioCallable<Input, Output>(functions: Functions, operation: string, timeout: number) {
  if (!shared.has(operation)) return httpsCallable<Input, Output>(functions, operation, { timeout });
  const call = httpsCallable<{ operation: string; input: Input }, Output>(functions, "webStudio", { timeout });
  return (input: Input) => call({ operation, input });
}
