document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  if (window.lucide) lucide.createIcons();
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
  const menu = $('#mobileNav');
  const toggle = $('#menuButton');
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    toggle.innerHTML = open ? '<i data-lucide="x" class="size-5"></i>' : '<i data-lucide="menu" class="size-5"></i>';
    window.lucide?.createIcons();
  }
  toggle?.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  $$('#mobileNav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  function updateScroll() {
    $('#siteHeader')?.classList.toggle('shadow-lg', window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if ($('#progress')) $('#progress').style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buttons = $$('.filter-btn');
  const cards = $$('.news-card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const category = btn.dataset.filter;
    buttons.forEach(b => {
      const active = b === btn;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('bg-paps', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('bg-white', !active);
      b.classList.toggle('text-stone-600', !active);
    });
    const visible = cards.filter(card => category === 'all' || card.dataset.category === category);
    cards.forEach(card => {
      const show = visible.includes(card);
      if (!reduced && window.gsap && show && card.hidden) {
        card.hidden = false;
        gsap.fromTo(card, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .4, ease: 'power2.out', clearProps: 'all' });
      } else card.hidden = !show;
    });
    if ($('#filterStatus')) $('#filterStatus').textContent = `${visible.length} article${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''}.`;
    window.ScrollTrigger?.refresh();
  }));
  if (!reduced && window.gsap) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *', { y: 30, opacity: 0, duration: .9, stagger: .13, ease: 'power3.out' });
    gsap.from('.hero-art', { x: 55, rotate: 4, opacity: 0, duration: 1.15, delay: .15, ease: 'power3.out' });
    gsap.to('.ticker-track', { xPercent: -33.333, duration: 18, repeat: -1, ease: 'none' });
    if (window.ScrollTrigger) {
      $$('[data-reveal]').forEach(el => gsap.from(el, { y: 38, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    }
  }
});
