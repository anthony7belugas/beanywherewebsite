/** A web identity is admitted by the server, never by an email address or a native login. */
export type WebSession = {
  uid: string;
  webAppId: string;
  capabilityVersion: 1;
};

export function validWebSession(value: unknown): value is WebSession {
  if (!value || typeof value !== "object") return false;
  const s = value as Partial<WebSession>;
  return s.capabilityVersion === 1 && /^w_[a-f0-9]{40}$/.test(s.uid || "") &&
    /^1:\d+:web:[a-f0-9]+$/.test(s.webAppId || "");
}

export function admittedWebClaims(
  uid: string,
  claims: Record<string, unknown>,
  session: WebSession,
) {
  return validWebSession(session) && uid === session.uid &&
    claims.platform === "web" && claims.webAppId === session.webAppId &&
    typeof claims.webSessionHandle === "string" &&
    /^[a-f0-9]{40}$/.test(claims.webSessionHandle) &&
    claims.deviceHandle === claims.webSessionHandle && claims.deviceRestricted === false;
}
