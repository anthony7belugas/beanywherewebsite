import { analyticsAllowed, setAnalyticsAllowed } from './analytics.js?v=4bf11ae83ea1fd48';

export function bindUsageSettings() {
  document.querySelectorAll('[data-analytics-settings]').forEach(button => button.addEventListener('click', () => {
    if (document.querySelector('dialog.analytics-dialog[open]')) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'analytics-dialog';
    dialog.setAttribute('aria-labelledby', 'analytics-dialog-title');
    const title = document.createElement('h2');
    title.id = 'analytics-dialog-title';
    title.textContent = 'Website usage data';
    const note = document.createElement('p');
    note.textContent = 'Help us understand visits and improve the photoshoot. This measures pages, device type, approximate location and actions. It does not send your email or photos to Google Analytics. Your browser’s privacy signal is respected.';
    const label = document.createElement('label'), input = document.createElement('input');
    input.type = 'checkbox'; input.checked = analyticsAllowed();
    label.append(input, document.createTextNode(' Share website usage data'));
    const save = document.createElement('button'); save.type = 'button'; save.textContent = 'Save';
    save.addEventListener('click', () => { setAnalyticsAllowed(input.checked); dialog.close(); });
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    dialog.append(title, note, label, save); document.body.append(dialog); dialog.showModal();
  }));
}
