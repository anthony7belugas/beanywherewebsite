import { ownerBrowserId, prepareOwnerBrowser } from './analytics.js?v=3d0bdc1843f0becd';
const $ = id => document.getElementById(id);
const token = window.location.hash.slice(1);
// The private setup token is never placed in Analytics, query strings or referrers.
history.replaceState(null, '', window.location.pathname);
const prior = ownerBrowserId();
$('browser-id').textContent = prior || 'An ID will be saved when you register this browser.';
if (!/^[a-f0-9]{64}$/.test(token)) {
  $('pair-status').textContent = 'Create a private setup link in the owner dashboard, then open that link here.';
  $('exclude-browser').disabled = true;
}
$('exclude-browser').onclick = async () => {
  $('exclude-browser').disabled = true;
  $('pair-status').textContent = 'Registering this browser…';
  try {
    const clientId = prepareOwnerBrowser();
    $('browser-id').textContent = clientId;
    const response = await fetch('https://us-central1-bethere-3d7de.cloudfunctions.net/claimOwnerBrowser', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
      body: JSON.stringify({ data: { token, clientId } }), signal: AbortSignal.timeout(20000),
    });
    const body = await response.json();
    const result = body.result || body.data;
    if (!response.ok || !result?.registered) throw new Error(body.error?.message || 'Registration failed. Try again.');
    $('pair-status').textContent = `${result.label} is registered. Visits from this browser are excluded from your dashboard’s website visitor reports, including earlier exported visits. Refresh the dashboard to see it.`;
    $('exclude-browser').textContent = 'Browser excluded';
  } catch (error) {
    $('pair-status').textContent = error?.name === 'SecurityError' || error?.name === 'QuotaExceededError'
      ? 'Browser storage is unavailable. Use a regular browser with storage enabled.'
      : error?.message || 'Could not register this browser. Try again.';
    $('exclude-browser').disabled = false;
  }
};
