/* The public catalog works before browser sign-in. Only fixed catalog choices enter the studio. */
(() => {
  const query = new URLSearchParams(location.search);
  let saved;
  try { saved = localStorage.getItem('beanywhere-public-styling'); } catch { /* Browsing works without storage. */ }
  let styling = [query.get('styling'), saved].find(value => value === 'w' || value === 'm') || 'w';
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
    document.querySelectorAll('[data-shoot-link]').forEach(link => { link.href = `/shoots/${link.dataset.shootLink}/?styling=${styling}`; });
    if (pack && look) {
      document.querySelectorAll('[data-scene]').forEach(image => { image.src = `/studio/assets/scenes/${pack}/${styling}/${look}/${image.dataset.scene}.webp`; });
      document.querySelectorAll('[data-start]').forEach(link => { link.href = `/studio/?start=${pack}&styling=${styling}&look=${look}#/upload`; });
    }
  }
  document.querySelectorAll('[data-styling]').forEach(button => button.addEventListener('click', () => {
    styling = button.dataset.styling;
    try { localStorage.setItem('beanywhere-public-styling', styling); } catch { /* Optional preference. */ }
    render();
  }));
  looks.forEach(button => button.addEventListener('click', () => { look = button.dataset.look; render(); }));
  render();
})();
