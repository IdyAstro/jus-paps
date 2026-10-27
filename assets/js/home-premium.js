'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.lucide) lucide.createIcons();
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
  const menuBtn = $('#menuButton'), mobileNav = $('#mobileNav');
  function closeMenu(){ mobileNav?.classList.add('hidden'); menuBtn?.setAttribute('aria-expanded','false'); if(menuBtn){menuBtn.innerHTML='<i data-lucide="menu" class="size-5"></i>'; lucide?.createIcons();} }
  menuBtn?.addEventListener('click', () => { const opening=mobileNav.classList.contains('hidden'); mobileNav.classList.toggle('hidden'); menuBtn.setAttribute('aria-expanded',String(opening)); menuBtn.innerHTML=opening?'<i data-lucide="x" class="size-5"></i>':'<i data-lucide="menu" class="size-5"></i>'; lucide?.createIcons(); });
  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e=>{if(e.key==='Escape') closeMenu();});
  function onScroll(){const max=document.documentElement.scrollHeight-innerHeight; if($('#progress')) $('#progress').style.width=`${max>0?scrollY/max*100:0}%`; $('#siteHeader')?.classList.toggle('shadow-lg',scrollY>24);}
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  const sodas=[['Orange','orange-card.jpg'],['Cola','cola-card.jpg'],['Tropical','tropical-card.jpg'],['Ananas','ananas-card.jpg'],['Chapman','chapman-card.jpg'],['Cocktail','cocktail-card.jpg'],['Pomme','pomme-card.jpg'],['Tonic','tonic-card.jpg'],['Lemon','lemond-card.jpg']];
  let index=0, timer; const img=$('#sodaSpotlight'), name=$('#sodaName');
  function showSoda(n){if(!img||!name)return; index=(n+sodas.length)%sodas.length; const update=()=>{img.src=`assets/images/soda/${sodas[index][1]}`;img.alt=`PAP’S Soda ${sodas[index][0]}`;name.textContent=sodas[index][0];}; if(window.gsap&&!reduced){gsap.to([img,name],{opacity:0,y:10,duration:.22,onComplete:()=>{update();gsap.fromTo([img,name],{opacity:0,y:15},{opacity:1,y:0,duration:.42,ease:'power2.out'});}});}else update();}
  function restart(){clearInterval(timer);if(!reduced)timer=setInterval(()=>showSoda(index+1),5200);}
  $('#sodaPrev')?.addEventListener('click',()=>{showSoda(index-1);restart();}); $('#sodaNext')?.addEventListener('click',()=>{showSoda(index+1);restart();});
  img?.addEventListener('error',()=>{img.alt='Visuel soda indisponible';img.style.background='#fff7ed';});
  const sodaSection=img?.closest('section'); if(sodaSection&&'IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)restart();else clearInterval(timer);},{threshold:.2});io.observe(sodaSection);}else restart();
  if(!reduced&&window.gsap){
    if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
    gsap.from('[data-hero-in]',{y:45,opacity:0,duration:1.1,stagger:.16,ease:'power3.out',clearProps:'all'});
    gsap.to('#heroImage',{scale:1.08,duration:14,yoyo:true,repeat:-1,ease:'sine.inOut'});
    gsap.to('#ticker',{xPercent:-50,duration:24,repeat:-1,ease:'none'});
    if(window.ScrollTrigger){gsap.utils.toArray('[data-reveal]').forEach(el=>gsap.from(el,{y:55,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},clearProps:'all'}));}
  }
});
