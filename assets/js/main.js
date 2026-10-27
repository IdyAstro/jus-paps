document.addEventListener('DOMContentLoaded', () => { if (window.lucide) lucide.createIcons(); const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); const b = document.getElementById('menuButton'), n = document.getElementById('mobileNav'); if (b && n) { b.addEventListener('click', () => { const open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!open)); b.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu'); n.classList.toggle('hidden', open) }); n.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { n.classList.add('hidden'); b.setAttribute('aria-expanded', 'false') })) } const h = document.getElementById('siteHeader'); const onScroll = () => h?.classList.toggle('shadow-xl', window.scrollY > 12); window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; gsap.registerPlugin(ScrollTrigger); gsap.utils.toArray('[data-reveal]').forEach((el, i) => { gsap.fromTo(el, { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onComplete: () => gsap.set(el, { clearProps: 'opacity,transform' }) }) }) });


function initPapsFlavorCarousel() {
    const carousel = document.getElementById("paps-flavor-carousel");

    if (!carousel || carousel.dataset.initialized === "true") return;

    carousel.dataset.initialized = "true";

    const slides = [...carousel.querySelectorAll(".paps-flavor-slide")];
    const dots = [...carousel.querySelectorAll(".paps-flavor-dot")];
    const counter = document.getElementById("paps-flavor-counter");
    const previousButton = document.getElementById("paps-flavor-prev");
    const nextButton = document.getElementById("paps-flavor-next");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const active = i === currentIndex;

            slide.classList.toggle("z-10", active);
            slide.classList.toggle("z-0", !active);

            slide.classList.toggle("translate-x-0", active);
            slide.classList.toggle("translate-x-8", !active);

            slide.classList.toggle("opacity-100", active);
            slide.classList.toggle("opacity-0", !active);

            slide.setAttribute("aria-hidden", String(!active));
        });

        dots.forEach((dot, i) => {
            const active = i === currentIndex;

            dot.classList.toggle("w-6", active);
            dot.classList.toggle("w-2.5", !active);

            dot.classList.toggle("bg-white", active);
            dot.classList.toggle("bg-white/40", !active);

            if (active) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        if (counter) {
            counter.textContent =
                `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
    }

    function stopAutoplay() {
        if (autoplayTimer !== null) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();

        if (reducedMotion || document.hidden) return;

        autoplayTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 3500);
    }

    function navigateTo(index) {
        showSlide(index);
        startAutoplay();
    }

    nextButton?.addEventListener("click", () => {
        navigateTo(currentIndex + 1);
    });

    previousButton?.addEventListener("click", () => {
        navigateTo(currentIndex - 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            navigateTo(index);
        });
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    carousel.addEventListener("focusin", stopAutoplay);

    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    showSlide(0);
    startAutoplay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPapsFlavorCarousel);
} else {
    initPapsFlavorCarousel();
}



document.addEventListener("DOMContentLoaded", () => {
    const marquee = document.querySelector(
        ".animate-\\[marquee_30s_linear_infinite\\]"
    );

    if (!marquee) return;

    const firstGroup = marquee.firstElementChild;

    if (!firstGroup) return;

    const distance = firstGroup.getBoundingClientRect().width +
        parseFloat(getComputedStyle(marquee).columnGap || 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    marquee.animate(
        [
            { transform: "translateX(0)" },
            { transform: `translateX(-${distance}px)` }
        ],
        {
            duration: 30000,
            iterations: Infinity,
            easing: "linear"
        }
    );
});
