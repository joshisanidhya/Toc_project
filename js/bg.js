/**
 * bg.js — Dynamic background slideshow with Ken Burns effect
 *
 * Usage: call initBgSlideshow(images, intervalMs) from any page.
 * The script injects two bg-slide layers + overlay + grain into <body>,
 * then cross-fades through the image array every `intervalMs` milliseconds.
 *
 * Each page defines its own image array so the BG feels contextual.
 */

(function () {

    function initBgSlideshow(images, intervalMs) {
        if (!images || images.length === 0) return;

        intervalMs = intervalMs || 7000;   // default: 7 s per image

        // ── Inject static layers ────────────────────────────────────────────
        const overlay = document.createElement('div');
        overlay.className = 'bg-overlay';
        document.body.insertBefore(overlay, document.body.firstChild);

        const grain = document.createElement('div');
        grain.className = 'bg-grain';
        document.body.insertBefore(grain, document.body.firstChild);

        // Two alternating slide divs for cross-fade
        const slideA = document.createElement('div');
        const slideB = document.createElement('div');
        slideA.className = 'bg-slide';
        slideB.className = 'bg-slide';
        document.body.insertBefore(slideB, document.body.firstChild);
        document.body.insertBefore(slideA, document.body.firstChild);

        const slides = [slideA, slideB];

        // ── Preload images ──────────────────────────────────────────────────
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // ── State ───────────────────────────────────────────────────────────
        let current = 0;      // index into images[]
        let active  = 0;      // which slide (0 or 1) is currently shown

        // Show first image immediately
        slides[active].style.backgroundImage = `url('${images[0]}')`;
        slides[active].classList.add('active');

        // ── Transition logic ────────────────────────────────────────────────
        function nextSlide() {
            const next = (current + 1) % images.length;
            const nextSlide = slides[1 - active];

            // Load next image into the hidden slide
            nextSlide.style.backgroundImage = `url('${images[next]}')`;
            nextSlide.classList.remove('fade-out');

            // Fade in next, fade out current
            requestAnimationFrame(() => {
                // Small tick so the browser registers the new background
                requestAnimationFrame(() => {
                    nextSlide.classList.add('active');
                    slides[active].classList.remove('active');
                    slides[active].classList.add('fade-out');

                    // After transition, clean up old slide
                    setTimeout(() => {
                        slides[active].classList.remove('fade-out');
                    }, 2000);

                    active  = 1 - active;
                    current = next;
                });
            });
        }

        // Start cycling
        setInterval(nextSlide, intervalMs);
    }

    // Expose globally
    window.initBgSlideshow = initBgSlideshow;

})();
