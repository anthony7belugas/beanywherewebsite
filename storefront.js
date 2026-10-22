import { initAnalytics, trackWeb } from './analytics.js?v=0696ff348e22c20e';
import { currentAttribution, attributedLink } from './acquisition.js?v=3836e14708bfebc5';
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
      if (url.origin !== location.origin) return;
      const catalog = /^\/(?:$|studio(?:\/|$)|shoots\/)/.test(url.pathname);
      if (!catalog && !/^\/(?:support|privacy|terms)(?:\.html)?\/?$/.test(url.pathname)) return;
      if (catalog) url.searchParams.set('styling', styling);
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
  window.addEventListener('pageshow', render);
  window.addEventListener('storage', event => { if (event.key === 'beanywhere-acquisition-v1') render(); });
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
})();
