/**
 * Premium Fade Transition to Contact Section
 * Creates a smooth, premium fade effect when navigating to the contact form
 */

(function () {
    // Config
    const TARGET_SELECTOR = '#contact';
    const FADE_DURATION = 400; // ms for fade effect
    const SCROLL_DURATION = 800; // ms for scroll
    const OFFSET = 60; // Offset for the contact section

    // Easing function: easeOutCubic for smooth deceleration
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    // Create transition overlay element
    function createTransitionOverlay() {
        let overlay = document.getElementById('page-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'page-transition-overlay';
            overlay.innerHTML = `
                <div class="transition-content">
                    <div class="transition-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Inject styles if not already present
            if (!document.getElementById('transition-overlay-styles')) {
                const style = document.createElement('style');
                style.id = 'transition-overlay-styles';
                style.textContent = `
                    #page-transition-overlay {
                        position: fixed;
                        inset: 0;
                        z-index: 10000;
                        background: radial-gradient(ellipse at center, #0f2240 0%, #0a1628 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
                                    visibility ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1);
                        pointer-events: none;
                    }
                    
                    #page-transition-overlay.is-active {
                        opacity: 1;
                        visibility: visible;
                        pointer-events: all;
                    }
                    
                    .transition-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 20px;
                        transform: scale(0.9);
                        opacity: 0;
                        transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms,
                                    opacity 300ms ease 100ms;
                    }
                    
                    #page-transition-overlay.is-active .transition-content {
                        transform: scale(1);
                        opacity: 1;
                    }
                    
                    .transition-icon {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, rgba(149, 204, 165, 0.2) 0%, rgba(149, 204, 165, 0.05) 100%);
                        border: 2px solid rgba(149, 204, 165, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #95cca5;
                        animation: iconPulse 1.5s ease-in-out infinite;
                        box-shadow: 
                            0 0 30px rgba(149, 204, 165, 0.3),
                            0 0 60px rgba(149, 204, 165, 0.1);
                    }
                    
                    .transition-icon svg {
                        animation: iconFloat 2s ease-in-out infinite;
                    }
                    
                    @keyframes iconPulse {
                        0%, 100% { 
                            transform: scale(1); 
                            box-shadow: 
                                0 0 30px rgba(149, 204, 165, 0.3),
                                0 0 60px rgba(149, 204, 165, 0.1);
                        }
                        50% { 
                            transform: scale(1.05); 
                            box-shadow: 
                                0 0 40px rgba(149, 204, 165, 0.4),
                                0 0 80px rgba(149, 204, 165, 0.2);
                        }
                    }
                    
                    @keyframes iconFloat {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-3px) rotate(5deg); }
                    }
                    
                    /* Contact section highlight effect */
                    #contact.is-highlighted {
                        position: relative;
                    }
                    
                    #contact.is-highlighted::before {
                        content: '';
                        position: absolute;
                        inset: -20px;
                        background: radial-gradient(ellipse at center, rgba(149, 204, 165, 0.15) 0%, transparent 70%);
                        border-radius: 24px;
                        opacity: 0;
                        animation: highlightGlow 1.5s ease-out forwards;
                        pointer-events: none;
                        z-index: -1;
                    }
                    
                    @keyframes highlightGlow {
                        0% { opacity: 0; transform: scale(0.95); }
                        50% { opacity: 1; }
                        100% { opacity: 0; transform: scale(1.02); }
                    }
                    
                    /* Form card entrance animation */
                    #contact.is-highlighted .form-card {
                        animation: formCardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    }
                    
                    @keyframes formCardEntrance {
                        0% { 
                            transform: translateY(30px) scale(0.98);
                            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
                        }
                        100% { 
                            transform: translateY(0) scale(1);
                            box-shadow: 
                                0 25px 60px rgba(0, 0, 0, 0.12),
                                0 0 40px rgba(149, 204, 165, 0.1);
                        }
                    }
                    
                    /* Contact info entrance */
                    #contact.is-highlighted .contact-info {
                        animation: infoEntrance 0.6s ease-out forwards;
                    }
                    
                    @keyframes infoEntrance {
                        0% { opacity: 0; transform: translateX(-20px); }
                        100% { opacity: 1; transform: translateX(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        return overlay;
    }

    // Smooth scroll function
    function smoothScrollTo(element, duration) {
        return new Promise((resolve) => {
            const startPosition = window.scrollY;
            const targetPosition = element.getBoundingClientRect().top + window.scrollY - OFFSET;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const run = easeOutCubic(progress);

                window.scrollTo(0, startPosition + distance * run);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(animation);
        });
    }

    // Premium transition to contact
    async function transitionToContact(targetElement) {
        const overlay = createTransitionOverlay();

        // Phase 1: Fade in overlay
        overlay.classList.add('is-active');

        // Wait for fade in
        await new Promise(resolve => setTimeout(resolve, FADE_DURATION + 100));

        // Phase 2: Scroll to contact while overlay is visible
        window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - OFFSET,
            behavior: 'instant'
        });

        // Small delay before fade out
        await new Promise(resolve => setTimeout(resolve, 200));

        // Phase 3: Fade out overlay
        overlay.classList.remove('is-active');

        // Phase 4: Highlight contact section
        targetElement.classList.add('is-highlighted');

        // Remove highlight class after animation
        setTimeout(() => {
            targetElement.classList.remove('is-highlighted');
        }, 2000);

        // Update URL
        history.pushState(null, null, '#contact');
    }

    // Handle click on links pointing to #contact
    function handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        // Check if it's a link to #contact
        if (href && href.includes('#contact')) {
            const targetElement = document.querySelector(TARGET_SELECTOR);

            // If we are on the same page and target exists
            if (targetElement) {
                const url = new URL(link.href, window.location.origin);
                if (url.pathname === window.location.pathname || url.pathname === '/') {
                    e.preventDefault();
                    transitionToContact(targetElement);
                }
            }
        }
    }

    // Handle button clicks (for buttons that might programmatically navigate)
    function handleButtonClick(e) {
        const button = e.currentTarget;
        const dataTarget = button.getAttribute('data-scroll-to');

        if (dataTarget === 'contact') {
            const targetElement = document.querySelector(TARGET_SELECTOR);
            if (targetElement) {
                e.preventDefault();
                transitionToContact(targetElement);
            }
        }
    }

    // Initialize listeners
    function init() {
        // Create overlay on init
        createTransitionOverlay();

        // Attach to all links that might point to contact
        const links = document.querySelectorAll('a[href*="#contact"]');
        links.forEach(link => {
            // Remove any existing listeners to prevent duplicates
            link.removeEventListener('click', handleLinkClick);
            link.addEventListener('click', handleLinkClick);
        });

        // Attach to buttons with data-scroll-to="contact"
        const buttons = document.querySelectorAll('[data-scroll-to="contact"]');
        buttons.forEach(button => {
            button.removeEventListener('click', handleButtonClick);
            button.addEventListener('click', handleButtonClick);
        });

        // Check if loaded with hash
        if (window.location.hash === '#contact') {
            const targetElement = document.querySelector(TARGET_SELECTOR);
            if (targetElement) {
                // Small delay to ensure content is ready, then show premium entrance
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.getBoundingClientRect().top + window.scrollY - OFFSET,
                        behavior: 'instant'
                    });
                    targetElement.classList.add('is-highlighted');
                    setTimeout(() => {
                        targetElement.classList.remove('is-highlighted');
                    }, 2000);
                }, 100);
            }
        }
    }

    // Set scroll restoration to manual
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
