import { initAnalytics, trackWeb, analyticsAllowed, setAnalyticsAllowed } from './analytics.js?v=cdf34af69052e4ca';
import { currentAttribution, attributedLink } from './acquisition.js?v=ce2e5c5a7a507681';
/* The public catalog works before browser sign-in. Only fixed catalog choices enter the studio. */
(() => {
  currentAttribution();
  initAnalytics();
  const query = new URLSearchParams(location.search);
  let saved;
  try { saved = localStorage.getItem('beanywhere-public-styling'); } catch { /* Browsing works without storage. */ }
  let styling = [query.get('styling'), saved].find(value => value === 'w' || value === 'm') || 'w';
  // A campaign link is also a styling choice, including on later visits to My photos.
  try { localStorage.setItem('beanywhere-public-styling', styling); } catch { /* Optional preference. */ }
  const pack = document.body.dataset.shoot;
  let look = query.get('look') || '';
  const looks = [...document.querySelectorAll('[data-look]')];
  function render() {
    document.querySelectorAll('[data-styling]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.styling === styling)));
    const available = looks.filter(button => button.dataset.forStyling === styling);
    if (!available.some(button => button.dataset.look === look)) look = available[0]?.dataset.look || '';
    looks.forEach(button => {
      button.hidden = button.dataset.forStyling !== styling;
      button.setAttribute('aria-pressed', String(!button.hidden && button.dataset.look === look));
    });
    document.querySelectorAll('[data-cover]').forEach(image => {
      image.src = `/studio/assets/covers/${image.dataset.cover}-${styling}.webp`;
      image.alt = image.alt.replace(/women’s|men’s/, styling === 'w' ? 'women’s' : 'men’s');
    });
    document.querySelectorAll('[data-shoot-link]').forEach(link => { link.href = attributedLink(`/shoots/${link.dataset.shootLink}/?styling=${styling}`); });
    if (pack && look) {
      document.querySelectorAll('[data-scene]').forEach(image => { image.src = `/studio/assets/scenes/${pack}/${styling}/${look}/${image.dataset.scene}.webp`; });
      document.querySelectorAll('[data-start]').forEach(link => { link.href = attributedLink(`/studio/?start=${pack}&styling=${styling}&look=${look}#/upload`); });
    }
    // Carry the current choice through back/home/library links, even without storage.
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !/^\/(?:$|studio(?:\/|$)|shoots\/)/.test(url.pathname)) return;
      url.searchParams.set('styling', styling);
      link.href = attributedLink(url.pathname + url.search + url.hash);
    });
  }
  document.querySelectorAll('[data-styling]').forEach(button => button.addEventListener('click', () => {
    styling = button.dataset.styling;
    trackWeb('styling_selected',{styling,packId:pack});
    try { localStorage.setItem('beanywhere-public-styling', styling); } catch { /* Optional preference. */ }
    render();
  }));
  looks.forEach(button => button.addEventListener('click', () => { look = button.dataset.look; trackWeb('style_direction_selected',{packId:pack,styling,styleId:look}); render(); }));
  render();
  trackWeb(pack ? 'view_item' : 'view_item_list',{packId:pack,styling,styleId:look});
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){trackWeb('view_item',{packId:entry.target.dataset.shootLink,styling,surface:'card'});observer.unobserve(entry.target);}},{threshold:0.5});
  document.querySelectorAll('[data-shoot-link]').forEach(card=>observer.observe(card));
  document.querySelectorAll('details').forEach((item,index)=>item.addEventListener('toggle',()=>{if(item.open)trackWeb('faq_opened',{position:index+1});}));
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]'); if(!link)return;
    const url=new URL(link.href,location.href);
    const action=link.dataset.start!==undefined?'add_selfies':link.dataset.shootLink?'select_shoot':url.hash==='#shoots'?'create_photos':url.hash==='#/library'?'my_photos':url.hostname==='play.google.com'?'google_play':url.protocol==='mailto:'?'support':url.hostname==='www.instagram.com'?'instagram':null;
    if(action)trackWeb(action==='select_shoot'?'select_item':'cta_clicked',{action,packId:link.dataset.shootLink || pack,styling,styleId:look});
  });
  const privacy=document.querySelector('[data-analytics-settings]');
  privacy?.addEventListener('click',()=>{
    const dialog=document.createElement('dialog');
    const title=document.createElement('h2');title.textContent='Website usage data';
    const note=document.createElement('p');note.textContent='Help us understand visits and improve the photoshoot. This measures pages, device type, approximate location and actions. It does not send your email or photos to Google Analytics. Your browser’s privacy signal is respected.';
    const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=analyticsAllowed();
    label.append(input,document.createTextNode(' Share website usage data'));
    const close=document.createElement('button');close.type='button';close.textContent='Save';close.addEventListener('click',()=>{setAnalyticsAllowed(input.checked);dialog.close();dialog.remove();});
    dialog.append(title,note,label,close);document.body.append(dialog);dialog.showModal();
  });
})();
