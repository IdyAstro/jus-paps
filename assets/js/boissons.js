(() => {
  'use strict';

  const ready = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    // Icônes Lucide
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Ne pas forcer les animations si l'utilisateur préfère les mouvements réduits.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsapReady = !!window.gsap && !reducedMotion;
    const scrollTriggerReady = gsapReady && !!window.ScrollTrigger;

    if (!gsapReady) {
      document.documentElement.classList.add('animations-disabled');
      return;
    }

    const gsap = window.gsap;
    if (scrollTriggerReady) gsap.registerPlugin(window.ScrollTrigger);

    // HERO : entrée cinématique et décalage en cascade.
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.hero-kicker', { y: 18, opacity: 0, duration: 0.55 })
      .from('.hero-title', { y: 34, opacity: 0, duration: 0.8 }, '-=0.22')
      .from('.hero-description', { y: 22, opacity: 0, duration: 0.65 }, '-=0.42')
      .from('.hero-actions > *', { y: 18, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.35')
      .from('.hero-stats > *', { y: 14, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.25')
      .from('.hero-frame', { x: 48, y: 12, opacity: 0, scale: 0.96, duration: 1.05 }, 0.18);

    // L'image principale flotte doucement et suit légèrement le scroll.
    gsap.to('.hero-glow', {
      scale: 1.14, opacity: 0.72, duration: 3.2,
      ease: 'sine.inOut', yoyo: true, repeat: -1
    });
    gsap.to('.hero-float', {
      y: -8, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1
    });
    gsap.to('.hero-orb:first-child', {
      x: -24, y: 22, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1
    });
    if (scrollTriggerReady) {
      gsap.to('.hero-photo', {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.7 }
      });
    }

    // Titre de collection et badge d'introduction.
    if (scrollTriggerReady) {
      gsap.from('.collection-heading > *', {
        y: 28, opacity: 0, duration: 0.7, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: '.collection-heading', start: 'top 82%', once: true }
      });

      // Apparition des cartes en cascade, avec léger effet de profondeur.
      gsap.utils.toArray('.product-card').forEach((card, index) => {
        gsap.from(card, {
          y: 54, opacity: 0, scale: 0.965, duration: 0.78,
          delay: (index % 3) * 0.09, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });

        const image = card.querySelector('.product-image');
        if (image) {
          gsap.from(image, {
            scale: 1.12, duration: 1.1, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true }
          });
        }

        const link = card.querySelector('.card-link');
        if (link) {
          card.addEventListener('mouseenter', () => gsap.to(link, { x: 4, duration: 0.22, ease: 'power2.out' }));
          card.addEventListener('mouseleave', () => gsap.to(link, { x: 0, duration: 0.22, ease: 'power2.out' }));
        }
      });

      // Banniere de fin : révélation et reflet lumineux.
      gsap.from('.cta-content > *', {
        y: 30, opacity: 0, duration: 0.75, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-panel', start: 'top 82%', once: true }
      });
      gsap.to('.cta-shine', {
        x: '520%', duration: 1.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.cta-panel', start: 'top 72%', once: true, onEnter: () => {} }
      });

      // Les formes décoratives bougent lentement pour apporter de la profondeur.
      gsap.to('.cta-shape:first-child', {
        rotation: 18, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: -1,
        transformOrigin: 'center center'
      });
      gsap.to('.cta-shape:last-of-type', {
        rotation: -14, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1,
        transformOrigin: 'center center'
      });
    }

    // Micro-interaction subtile des boutons (désactivée sur écran tactile).
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
      document.querySelectorAll('.magnetic-link').forEach((link) => {
        link.addEventListener('mousemove', (event) => {
          const rect = link.getBoundingClientRect();
          const dx = (event.clientX - rect.left - rect.width / 2) * 0.07;
          const dy = (event.clientY - rect.top - rect.height / 2) * 0.07;
          gsap.to(link, { x: dx, y: dy, duration: 0.25, ease: 'power2.out' });
        });
        link.addEventListener('mouseleave', () => {
          gsap.to(link, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' });
        });
      });
    }

    // Actualise les déclencheurs après le chargement des images.
    if (scrollTriggerReady) {
      window.addEventListener('load', () => window.ScrollTrigger.refresh(), { once: true });
    }
  });
})();