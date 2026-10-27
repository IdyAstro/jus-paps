(() => {
  'use strict';
  const images = [
    { title: 'Orange', category: 'boisson', src: 'assets/images/orange.jpg', link: 'produits/orange.html' },
    { title: 'Mangue', category: 'boisson', src: 'assets/images/mango.jpg', link: 'produits/mangue.html' },
    { title: 'Ananas', category: 'boisson', src: 'assets/images/pineapple.jpg', link: 'produits/ananas.html' },
    { title: 'Pomme', category: 'boisson', src: 'assets/images/apple.jpg', link: 'produits/pomme.html' },
    { title: 'Tamarin', category: 'boisson', src: 'assets/images/tamarin.jpg', link: 'produits/tamarin.html' },
    { title: 'Gingembre', category: 'boisson', src: 'assets/images/ginginbre.jpg', link: 'produits/gingembre.html' },
    { title: 'Soda Ananas', category: 'soda', src: 'assets/images/soda/ananas-card.jpg', link: 'soda.html' },
    { title: 'Soda Chapman', category: 'soda', src: 'assets/images/soda/chapman-card.jpg', link: 'soda.html' },
    { title: 'Soda Cocktail', category: 'soda', src: 'assets/images/soda/cocktail-card.jpg', link: 'soda.html' },
    { title: 'Soda Cola', category: 'soda', src: 'assets/images/soda/cola-card.jpg', link: 'soda.html' },
    { title: 'Soda Lemon', category: 'soda', src: 'assets/images/soda/lemond-card.jpg', link: 'soda.html' },
    { title: 'Soda Orange', category: 'soda', src: 'assets/images/soda/orange-card.jpg', link: 'soda.html' },
    { title: 'Soda Pomme', category: 'soda', src: 'assets/images/soda/pomme-card.jpg', link: 'soda.html' },
    { title: 'Soda Tonic', category: 'soda', src: 'assets/images/soda/tonic-card.jpg', link: 'soda.html' },
    { title: 'Soda Tropical', category: 'soda', src: 'assets/images/soda/tropical-card.jpg', link: 'soda.html' }
  ];
  const $ = selector => document.querySelector(selector);
  const grid = $('#galleryGrid');
  const lightbox = $('#lightbox');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visibleImages = images;
  let currentIndex = 0;
  let previousFocus = null;
  let animating = false;
  const icon = (name, cls = 'size-5') => `<i data-lucide="${name}" class="${cls}"></i>`;
  const updateIcons = () => window.lucide?.createIcons();

  function renderCards() {
    grid.innerHTML = visibleImages.map((item, index) => `
      <article class="gallery-card group relative isolate overflow-hidden rounded-[1.65rem] bg-orange-50 shadow-[0_12px_45px_rgba(194,65,12,.08)] transition-shadow duration-500 hover:shadow-[0_22px_55px_rgba(194,65,12,.18)] ${index % 7 === 0 ? 'sm:col-span-2' : ''}">
        <button type="button" data-index="${index}" class="gallery-open relative block w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-orange-500" aria-label="Agrandir la photo ${item.title}">
          <img src="${item.src}" alt="PAP’S ${item.title}" loading="lazy" class="h-[320px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-[350px] ${index % 7 === 0 ? 'lg:h-[420px]' : ''}">
          <span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/0 to-transparent"></span>
          <span class="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-orange-700 backdrop-blur">${item.category === 'soda' ? 'PAP’S Soda' : 'Boisson fruitée'}</span>
          <span class="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white text-orange-600 shadow-lg transition duration-300 group-hover:rotate-90 group-hover:bg-paps group-hover:text-white">${icon('expand', 'size-5')}</span>
          <span class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 text-white"><span class="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">${item.title}</span><span class="text-xs font-bold text-white/90">Voir la photo ↗</span></span>
        </button>
        <a href="${item.link}" class="absolute bottom-0 left-0 z-10 -translate-y-16 rounded-tr-xl bg-white/95 px-4 py-2 text-[11px] font-bold text-orange-700 shadow-lg transition hover:bg-orange-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600">Voir le produit →</a>
      </article>`).join('');
    grid.querySelectorAll('.gallery-open').forEach(button => button.addEventListener('click', () => openLightbox(Number(button.dataset.index))));
    updateIcons();
    if (window.gsap && window.ScrollTrigger && !reducedMotion) {
      gsap.fromTo('.gallery-card', { opacity: 0, y: 45, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .8, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: grid, start: 'top 85%', once: true } });
      ScrollTrigger.refresh();
    }
  }
  function updateLightbox() {
    const item = visibleImages[currentIndex];
    $('#lightboxImage').src = item.src;
    $('#lightboxImage').alt = `PAP’S ${item.title}`;
    $('#lightboxTitle').textContent = item.title;
    $('#lightboxCount').textContent = `${currentIndex + 1} / ${visibleImages.length}`;
  }
  function openLightbox(index) {
    previousFocus = document.activeElement;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    $('#lightboxClose').focus();
    if (window.gsap && !reducedMotion) gsap.fromTo('#lightboxImage', { scale: .93, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'power2.out' });
  }
  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    $('#lightboxImage').removeAttribute('src');
    previousFocus?.focus();
  }
  function stepLightbox(direction) {
    currentIndex = (currentIndex + direction + visibleImages.length) % visibleImages.length;
    updateLightbox();
  }
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxPrev').addEventListener('click', () => stepLightbox(-1));
  $('#lightboxNext').addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (lightbox.classList.contains('hidden')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
    if (event.key === 'Tab') {
      const controls = [$('#lightboxClose'), $('#lightboxPrev'), $('#lightboxNext')];
      const next = (controls.indexOf(document.activeElement) + (event.shiftKey ? controls.length - 1 : 1)) % controls.length;
      event.preventDefault(); controls[next].focus();
    }
  });
  document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    visibleImages = filter === 'all' ? images : images.filter(item => item.category === filter);
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const active = btn === button;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('bg-paps', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('bg-white', !active);
      btn.classList.toggle('text-orange-700', !active);
    });
    $('#galleryStatus').textContent = `${visibleImages.length} photos affichées`;
    renderCards();
  }));
  const menuButton = $('#menuButton');
  const mobileNav = $('#mobileNav');
  menuButton.addEventListener('click', () => {
    const opening = mobileNav.classList.contains('hidden');
    mobileNav.classList.toggle('hidden');
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Fermer le menu' : 'Ouvrir le menu');
    menuButton.innerHTML = icon(opening ? 'x' : 'menu');
    updateIcons();
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = icon('menu'); updateIcons();
  }));
  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('#scrollProgress').style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
    $('#siteHeader').classList.toggle('shadow-lg', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  $('#year').textContent = new Date().getFullYear();
  renderCards(); updateIcons(); updateScroll();
  if (window.gsap && !reducedMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *', { opacity: 0, y: 28, duration: .9, stagger: .12, ease: 'power3.out' });
    gsap.from('.hero-tile', { opacity: 0, y: 65, rotation: 3, duration: 1.2, stagger: .18, ease: 'power3.out' });
    if (window.ScrollTrigger) {
      gsap.utils.toArray('[data-reveal]').forEach(el => gsap.from(el, { opacity: 0, y: 45, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      gsap.to('.marquee-track', { xPercent: -33.333, duration: 17, ease: 'none', repeat: -1 });
    }
  }
})();
