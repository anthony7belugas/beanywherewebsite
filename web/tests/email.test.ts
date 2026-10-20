import { expect, it } from "vitest";
import { suggestedEmail } from "../src/lib/email";
it("suggests familiar domain typos while preserving the person's mailbox name", () => {
  expect(suggestedEmail(' Alex+photos@gmial.com ')).toBe('Alex+photos@gmail.com');
  expect(suggestedEmail('alex@HOTMIAL.COM')).toBe('alex@hotmail.com');
});
it("does not rewrite valid addresses or guess unfamiliar domains", () => {
  for (const email of ['alex@gmail.com', 'alex@business.co', 'alex@example.org', 'not-an-email']) {
    expect(suggestedEmail(email)).toBeNull();
  }
});
