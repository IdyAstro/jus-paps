/* PAP’S SODA — animation et interactions, GSAP + Tailwind CSS */
(() => {
    'use strict';
    const base = 'assets/images/soda/';
    const products = [
        { name: 'Orange', card: 'orange (2).jpg', art: 'orange-card.jpg', desc: 'Un concentré d’éclat et de bonne humeur, pour illuminer chaque pause.', tag: 'Éclat fruité' },
        { name: 'Ananas', card: 'ananas.jpg', art: 'ananas-card.jpg', desc: 'Une touche d’exotisme ensoleillé qui invite à l’évasion.', tag: 'Esprit tropical' },
        { name: 'Chapman', card: 'chapman.jpg', art: 'chapman-card.jpg', desc: 'Une saveur audacieuse et festive pour les moments qui comptent.', tag: 'Signature originale' },
        { name: 'Cocktail', card: 'cocktail.jpg', art: 'cocktail-card.jpg', desc: 'Un mélange de sensations fruitées, haut en couleur et en caractère.', tag: 'Mix de sensations' },
        { name: 'Cola', card: 'cola.jpg', art: 'cola-card.jpg', desc: 'L’incontournable plaisir pétillant, à partager sans modération de bonne humeur.', tag: 'Grand classique' },
        { name: 'Lemon', card: 'lemon.jpg', art: 'lemond-card.jpg', desc: 'Une fraîcheur citronnée qui réveille l’instant.', tag: 'Zeste de fraîcheur' },
        { name: 'Pomme', card: 'pomme.jpg', art: 'pomme-card.jpg', desc: 'Une note douce et fruitée pour une pause pleine de légèreté.', tag: 'Douceur fruitée' },
        { name: 'Tonic', card: 'tonic.jpg', art: 'tonic-card.jpg', desc: 'Une personnalité singulière, vive et rafraîchissante.', tag: 'Caractère affirmé' },
        { name: 'Tropical', card: 'tropical.jpg', art: 'tropical-card.jpg', desc: 'L’appel des tropiques dans une expérience joyeuse et colorée.', tag: 'Évasion exotique' }
    ];
    const $ = (s) => document.querySelector(s);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animated = !reduced && typeof window.gsap !== 'undefined';
    const cardPath = (p) => base + encodeURIComponent(p.card);
    const artPath = (p) => base + encodeURIComponent(p.art);
    let heroIndex = 0, featureIndex = 0, timer = null, heroBusy = false, featureBusy = false;
    // Le header et le menu sont injectés de façon asynchrone par layout.js.
    // Le menu est géré par layout.js : ne pas accéder ici à des éléments pas encore injectés.
    if (window.lucide) window.lucide.createIcons();
    const grid = $('#productGrid');
    if (!grid) { console.error('PAP’S Soda : élément #productGrid introuvable.'); return; }
    products.forEach((p, i) => {
        const card = document.createElement('article'); card.className = 'product-card group overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_12px_45px_rgba(139,63,0,.05)] transition duration-500 hover:-translate-y-2 hover:shadow-premium';
        card.innerHTML = `<div class="relative flex h-[320px] items-center justify-center overflow-hidden bg-[#fff8ef] p-6 sm:h-[360px]"><span class="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[.12em] text-burnt shadow-sm">${String(i + 1).padStart(2, '0')} / 09</span><div class="absolute size-60 rounded-full bg-orange-100/70 blur-2xl"></div><img src="${cardPath(p)}" alt="Bouteille PAP’S Soda ${p.name}" loading="lazy" class="relative z-10 h-[290px] w-full object-contain transition duration-700 group-hover:scale-110 group-hover:-rotate-3 sm:h-[325px]"></div><div class="p-7"><p class="text-[10px] font-black uppercase tracking-[.2em] text-burnt">${p.tag}</p><div class="mt-3 flex items-center justify-between gap-3"><h3 class="font-display text-3xl font-extrabold tracking-tight">${p.name}</h3><button type="button" aria-label="Découvrir l’univers ${p.name}" data-product="${i}" class="grid size-11 place-items-center rounded-full bg-orange-50 text-burnt transition group-hover:bg-brand group-hover:text-white"><i data-lucide="arrow-up-right" class="size-5"></i></button></div><p class="mt-3 min-h-[56px] text-sm leading-7 text-stone-500">${p.desc}</p><button type="button" data-product="${i}" class="mt-6 flex w-full items-center justify-between border-t border-orange-100 pt-5 text-sm font-extrabold text-burnt">Voir l’expérience <span aria-hidden="true">↗</span></button></div>`;
        grid.appendChild(card);
    });
    const buttonWrap = $('#flavorButtons');
    if (!buttonWrap) { console.error('PAP’S Soda : élément #flavorButtons introuvable.'); return; }
    products.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = p.name; b.dataset.flavor = i; b.setAttribute('aria-pressed', String(i === 0)); b.className = 'flavor-btn rounded-full border border-orange-200 px-4 py-2.5 text-xs font-extrabold transition duration-300 hover:border-brand'; buttonWrap.appendChild(b); });
    function refreshButtons() { buttonWrap.querySelectorAll('button').forEach((b, i) => { const active = i === featureIndex; b.classList.toggle('bg-brand', active); b.classList.toggle('text-white', active); b.classList.toggle('border-brand', active); b.classList.toggle('bg-white', !active); b.classList.toggle('text-stone-700', !active); b.setAttribute('aria-pressed', String(active)); }); }
    function switchHero(next) {
        if (heroBusy) return; heroBusy = true; heroIndex = (next + products.length) % products.length; const p = products[heroIndex], img = $('#heroImage'), title = $('#heroFlavor'); const update = () => { img.src = artPath(p); img.alt = `Visuel publicitaire PAP’S Soda ${p.name}`; title.textContent = p.name; };
        if (animated) { gsap.to(img, { opacity: 0, x: -65, rotate: -7, scale: .88, duration: .28, ease: 'power2.in', onComplete: () => { update(); gsap.fromTo(img, { opacity: 0, x: 70, rotate: 8, scale: .9 }, { opacity: 1, x: 0, rotate: 0, scale: 1, duration: .7, ease: 'back.out(1.35)', onComplete: () => heroBusy = false }); } }); } else { update(); heroBusy = false; }
    }
    function switchFeature(next) {
        if (featureBusy) return; featureBusy = true; featureIndex = (next + products.length) % products.length; const p = products[featureIndex], img = $('#featureImage'); const update = () => { img.src = artPath(p); img.alt = `Visuel publicitaire PAP’S Soda ${p.name}`; $('#featureTitle').textContent = p.name; $('#featureDescription').textContent = p.desc; $('#featureIndex').textContent = `${String(featureIndex + 1).padStart(2, '0')} / 09`; refreshButtons(); };
        if (animated) { gsap.to(img, { opacity: 0, y: 45, rotate: -6, scale: .93, duration: .28, onComplete: () => { update(); gsap.fromTo(img, { opacity: 0, y: -35, rotate: 6, scale: .9 }, { opacity: 1, y: 0, rotate: 0, scale: 1, duration: .7, ease: 'back.out(1.25)', onComplete: () => featureBusy = false }); } }); } else { update(); featureBusy = false; }
    }
    function restartAuto() { if (timer) clearInterval(timer); if (!reduced) timer = setInterval(() => { if (!document.hidden && !heroBusy) switchHero(heroIndex + 1); }, 4700); }
    $('#heroNext').addEventListener('click', () => { switchHero(heroIndex + 1); restartAuto(); }); $('#heroPrev').addEventListener('click', () => { switchHero(heroIndex - 1); restartAuto(); });
    $('#featureNext').addEventListener('click', () => switchFeature(featureIndex + 1)); $('#featurePrev').addEventListener('click', () => switchFeature(featureIndex - 1));
    buttonWrap.addEventListener('click', e => { const b = e.target.closest('[data-flavor]'); if (b) switchFeature(Number(b.dataset.flavor)); });
    grid.addEventListener('click', e => { const b = e.target.closest('[data-product]'); if (!b) return; switchFeature(Number(b.dataset.product)); $('#experience').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
    // Prefetch visual assets for seamless product changes
    products.forEach(p => { const img = new Image(); img.src = artPath(p); });
    refreshButtons(); restartAuto(); window.lucide?.createIcons();
    if (animated) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from('#heroCopy > *', { y: 35, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out' });
        gsap.from('#heroStage', { x: 60, opacity: 0, scale: .94, duration: 1.15, ease: 'power3.out' });
        gsap.to('#heroHalo', { rotate: 360, duration: 38, ease: 'none', repeat: -1 });
        gsap.to('#marquee', { xPercent: -33.333, duration: 19, repeat: -1, ease: 'none' });
        gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%', once: true }, y: 55, opacity: 0, duration: .85, ease: 'power3.out' }));
        ScrollTrigger.batch('.product-card', { start: 'top 92%', once: true, onEnter: els => gsap.fromTo(els, { opacity: 0, y: 65, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .75, stagger: .1, ease: 'power3.out', clearProps: 'transform' }) });
        gsap.to('#featureRing', { rotate: 360, duration: 35, repeat: -1, ease: 'none' });
        gsap.to('#heroImage', { y: -12, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const header = $('#siteHeader');
            const progress = $('#progress');
            if (header) header.classList.toggle('shadow-lg', y > 24);
            if (progress) {
                const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
                progress.style.width = `${Math.min(100, (y / maxScroll) * 100)}%`;
            }
            ticking = false;
        });
    }, { passive: true });
})();
