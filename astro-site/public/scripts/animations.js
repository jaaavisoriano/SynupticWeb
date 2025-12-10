/**
 * Premium Scroll Animations using IntersectionObserver
 * Includes blur reveal effects and dynamic stagger delays
 */

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add dynamic delay for children in stagger containers
                const parent = entry.target.parentElement;
                if (parent && (parent.classList.contains('animate-stagger') || parent.classList.contains('stagger-premium'))) {
                    const children = Array.from(parent.children);
                    const index = children.indexOf(entry.target);
                    const delay = index * 0.15; // 150ms between each child
                    entry.target.style.transitionDelay = `${delay}s`;
                }

                // Trigger the animation
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes (including new reveal classes)
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-left, .animate-right, .animate-scale, .reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    animatedElements.forEach(el => observer.observe(el));

    // Also observe children of stagger containers
    const staggerContainers = document.querySelectorAll('.animate-stagger, .stagger-premium');
    staggerContainers.forEach(container => {
        Array.from(container.children).forEach(child => {
            if (!child.classList.contains('visible')) {
                child.classList.add('reveal');
                observer.observe(child);
            }
        });
    });
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
