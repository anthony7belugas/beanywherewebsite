// Allowlisted categories only: never send error messages, URLs or customer data.
export function analyticsErrorCode(error: unknown): string {
  const value = error as { code?: string; name?: string; details?: { reason?: string } } | null;
  const reason = value?.details?.reason;
  if (['browser_auth_rate', 'network_new_rate', 'global_new_limit'].includes(reason || '')) return reason!;
  const code = String(value?.code || '').replace(/^functions\//, '');
  if (['resource-exhausted', 'permission-denied', 'unauthenticated', 'unavailable', 'deadline-exceeded', 'failed-precondition', 'cancelled'].includes(code)) return code.replaceAll('-', '_');
  if (['QuotaExceededError', 'SecurityError', 'InvalidStateError'].includes(value?.name || '')) return 'browser_storage';
  if (value?.name === 'AbortError') return 'cancelled';
  if (value?.name === 'TypeError') return 'network_or_runtime';
  return 'unknown';
}
