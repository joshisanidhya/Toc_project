
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
window.addEventListener('DOMContentLoaded', () => {
    let lastScrollY = window.scrollY;
    let isFlashing = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;
            if (entry.isIntersecting && scrollingDown && !isFlashing) {
                const overlay = document.getElementById('lightning-overlay');
                if (overlay) {
                    isFlashing = true;
                    overlay.classList.add('active');
                    setTimeout(() => {
                        overlay.classList.remove('active');
                        setTimeout(() => { isFlashing = false; }, 500);
                    }, 1000);
                }
            }
        });
    }, { threshold: 0.05 });
    const darkRegion = document.querySelector('.dark-parallax-region');
    if (darkRegion) observer.observe(darkRegion);
});
