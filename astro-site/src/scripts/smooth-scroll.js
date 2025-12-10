/**
 * Smooth Scroll to Contact Section
 * Handles both same-page links and cross-page navigation with hash
 */

(function () {
    // Config
    const TARGET_SELECTOR = '#contact';
    const DURATION = 1500; // ms - Slow and premium feel
    const OFFSET = 0; // Adjust if you have a fixed header that overlaps

    // Easing function: easeInOutCubic
    // Source: https://easings.net/#easeInOutCubic
    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    // Smooth scroll function
    function smoothScrollTo(element, duration) {
        const startPosition = window.scrollY;
        const targetPosition = element.getBoundingClientRect().top + window.scrollY - OFFSET;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(Math.min(timeElapsed / duration, 1)); // Ensure progress doesn't exceed 1

            window.scrollTo(0, startPosition + distance * run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Handle click on links pointing to #contact
    function handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        // Check if it's a link to #contact (either "#contact" or "/#contact" or "absolute.../#contact")
        if (href && href.includes('#contact')) {
            const targetElement = document.querySelector(TARGET_SELECTOR);

            // If we are on the same page and target exists
            if (targetElement) {
                // Check if it is really same page navigation (ignoring query params for simplicity usually)
                // For "/#contact", we need to check if pathname matches current pathname
                const url = new URL(link.href, window.location.origin);
                if (url.pathname === window.location.pathname) {
                    e.preventDefault();
                    smoothScrollTo(targetElement, DURATION);

                    // Push state to history to update URL without jumping
                    history.pushState(null, null, '#contact');
                }
            }
        }
    }

    // Initialize listeners
    function init() {
        // Attach to all links that might point to contact
        const links = document.querySelectorAll('a[href*="#contact"]');
        links.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // Check if loaded with hash
        if (window.location.hash === '#contact') {
            const targetElement = document.querySelector(TARGET_SELECTOR);
            if (targetElement) {
                // Prevent default browser scroll if possible (mostly handled by 'scrollRestoration' manual)
                // Scroll to top first to ensure we start from top
                window.scrollTo(0, 0);

                // Small delay to ensure content is ready
                setTimeout(() => {
                    smoothScrollTo(targetElement, DURATION);
                }, 100);
            }
        }
    }

    // Set scroll restoration to manual to prevent browser from jumping automatically
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Run on load
    document.addEventListener('DOMContentLoaded', init);

    // Run on Astro page transitions
    document.addEventListener('astro:page-load', () => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        init();
    });

})();
