(() => {
  'use strict';
  // IMPORTANT : remplacer par le numéro WhatsApp officiel PAP’S au format international,
  // uniquement des chiffres. Exemple de FORMAT (fictif) : 223XXXXXXXX.
  const WHATSAPP_NUMBER = '';
  const $ = (s) => document.querySelector(s);
  const menu = $('#mobileNav'), menuBtn = $('#menuButton');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.lucide) lucide.createIcons();
  $('#year').textContent = new Date().getFullYear();
  menuBtn?.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', 'false');
  }));
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.width = `${total > 0 ? scrollY / total * 100 : 0}%`;
    $('#siteHeader').classList.toggle('shadow-lg', scrollY > 16);
  };
  window.addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  if (!prefersReducedMotion && window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from('[data-intro]', {opacity:0,y:35,duration:1.05,stagger:.13,ease:'power3.out',clearProps:'all'});
    if (window.ScrollTrigger) gsap.utils.toArray('[data-reveal]').forEach(el => gsap.from(el,{opacity:0,y:48,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true},clearProps:'all'}));
  }
  const form = $('#contactForm');
  const fields = ['fullname','phone','email','subject','message'];
  const showError = (id, msg) => {
    const input = $('#' + id), output = $('#' + id + 'Error');
    if (output) output.textContent = msg;
    if (input) input.setAttribute('aria-invalid', String(Boolean(msg)));
  };
  const status = (msg, error = false) => {
    $('#formStatus').textContent = msg;
    $('#formStatus').className = 'mt-4 text-center text-sm font-bold ' + (error ? 'text-red-700' : 'text-deep');
  };
  $('#message')?.addEventListener('input', e => $('#messageCount').textContent = `${e.target.value.length} / 1500`);
  fields.forEach(id => $('#' + id)?.addEventListener('input', () => showError(id,'')));
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach(id => showError(id,'')); $('#consentError').textContent = ''; status('');
    const values = Object.fromEntries(fields.map(id => [id, $('#' + id).value.trim()]));
    let firstInvalid = null;
    const invalid = (id, msg) => {showError(id,msg); firstInvalid ||= $('#' + id);};
    if (values.fullname.length < 2) invalid('fullname','Indiquez votre nom (2 caractères minimum).');
    if (!/^[+\d\s().-]{7,25}$/.test(values.phone) || values.phone.replace(/\D/g,'').length < 7) invalid('phone','Indiquez un numéro de téléphone valide.');
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) invalid('email','Indiquez une adresse e-mail valide.');
    if (!values.subject) invalid('subject','Choisissez un objet.');
    if (values.message.length < 10) invalid('message','Décrivez votre demande (10 caractères minimum).');
    if (!$('#consent').checked) {$('#consentError').textContent = 'Votre accord est nécessaire.';firstInvalid ||= $('#consent');}
    if (firstInvalid) {firstInvalid.focus();status('Veuillez corriger les champs signalés.',true);return;}
    const number = WHATSAPP_NUMBER.replace(/\D/g,'');
    if (!/^\d{8,15}$/.test(number)) {status('Le numéro WhatsApp officiel de PAP’S doit être configuré dans assets/js/contact-premium.js avant la mise en ligne.',true);return;}
    const text = `Bonjour PAP’S Mali !\n\n*Nouvelle demande depuis le site web*\n\n*Nom :* ${values.fullname}\n*Téléphone :* ${values.phone}\n*E-mail :* ${values.email || 'Non renseigné'}\n*Objet :* ${values.subject}\n\n*Message :*\n${values.message}`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    // La navigation directe est plus fiable que window.open sur mobile et évite les bloqueurs de popups.
    status('Ouverture de WhatsApp… Vous devrez confirmer l’envoi du message.');
    window.location.assign(url);
  });
})();
