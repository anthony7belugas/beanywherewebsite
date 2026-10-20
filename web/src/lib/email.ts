/** Offer a correction for familiar typos; never silently change the destination. */
export function suggestedEmail(value: string): string | null {
  const email = value.trim();
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0]) return null;
  const corrections: Record<string, string> = {
    "gmial.com": "gmail.com", "gamil.com": "gmail.com", "gmai.com": "gmail.com",
    "gmail.con": "gmail.com", "gmail.cmo": "gmail.com", "gmail.co": "gmail.com",
    "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com",
    "outlok.com": "outlook.com", "outlook.con": "outlook.com",
    "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com", "icloud.con": "icloud.com",
  };
  const corrected = corrections[parts[1].toLowerCase()];
  return corrected ? `${parts[0]}@${corrected}` : null;
}
