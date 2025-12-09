/**
 * Minimal Scroll Animations using IntersectionObserver
 * ~500 bytes minified - Native Zero-Library approach
 */

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-left, .animate-right, .animate-scale'
    );

    animatedElements.forEach(el => observer.observe(el));
}

// Header scroll behavior
function initHeaderScroll() {
    const header = document.querySelector('#cesis_header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class for shadow
        if (currentScroll > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Hide/show on scroll direction (optional smart navbar)
        if (currentScroll > scrollThreshold) {
            if (currentScroll > lastScroll) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// Scroll to top button
function initScrollToTop() {
    const btn = document.querySelector('#cesis_to_top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize on DOM ready and View Transitions
function init() {
    initScrollAnimations();
    initHeaderScroll();
    initScrollToTop();
}

// Support Astro View Transitions
document.addEventListener('astro:page-load', init);

// Fallback for initial load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
