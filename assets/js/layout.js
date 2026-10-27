/* PAP’S Mali — chargement des composants partagés */
(() => {
  'use strict';

  const pagePath = window.location.pathname;
  const basePath = /\/produits\/[^/]+\.html$/.test(pagePath) ? '../' : './';
  const withBase = (markup) => markup.replaceAll('__ROOT__', basePath);

  async function loadComponent(file, selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    try {
      const response = await fetch(`${basePath}components/${file}`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      target.outerHTML = withBase(await response.text());
    } catch (error) {
      console.error(`Impossible de charger le composant ${file}:`, error);
      target.innerHTML = `<div class="paps-component-error" role="alert">Un élément de navigation n’a pas pu être chargé. Rechargez la page.</div>`;
    }
  }

  function initSharedUI() {
    const header = document.getElementById('siteHeader');
    const button = document.getElementById('menuButton');
    const mobileNav = document.getElementById('mobileNav');
    const year = document.getElementById('year');

    if (year) year.textContent = new Date().getFullYear();

    // Indiquer la page courante dans la navigation.
    const currentFile = pagePath.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.dataset.nav === currentFile ||
        (currentFile === 'index.html' && link.dataset.nav === 'index.html');
      if (active) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('is-current');
      }
    });

    if (button && mobileNav && !button.dataset.bound) {
      button.dataset.bound = 'true';
      const closeMenu = () => {
        mobileNav.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Ouvrir le menu');
        button.innerHTML = '<i data-lucide="menu" class="size-5"></i>';
        if (window.lucide) window.lucide.createIcons();
      };
      button.addEventListener('click', () => {
        const opening = mobileNav.classList.contains('hidden');
        mobileNav.classList.toggle('hidden', !opening);
        button.setAttribute('aria-expanded', String(opening));
        button.setAttribute('aria-label', opening ? 'Fermer le menu' : 'Ouvrir le menu');
        button.innerHTML = opening
          ? '<i data-lucide="x" class="size-5"></i>'
          : '<i data-lucide="menu" class="size-5"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
      mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
      });
    }

    const onScroll = () => {
      if (header) header.classList.toggle('shadow-xl', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (window.lucide) window.lucide.createIcons();
    document.dispatchEvent(new CustomEvent('paps:layout-ready'));
  }

  async function boot() {
    await Promise.all([
      loadComponent('header.html', '#site-header-slot'),
      loadComponent('footer.html', '#site-footer-slot')
    ]);
    initSharedUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
