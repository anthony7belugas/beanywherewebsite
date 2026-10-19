import { expect, test } from "vitest";
import { studioRouteEvent } from "../integration/studio-events";
import { emptyState } from "../src/lib/domain";
test("web analytics never copies private routes or payment return parameters", () => {
  expect(studioRouteEvent('/payment?orderId=private&email=person@example.com', emptyState())).toBeNull();
  expect(studioRouteEvent('/gallery/private-job', emptyState())).toBeNull();
  expect(studioRouteEvent('/shoot/person@example.com', emptyState())).toBeNull();
  expect(studioRouteEvent('/', emptyState())).toEqual({ name: 'screen_view', params: { screen: 'web_studio' } });
});
