/* Decidability JS */
/* ===== UNIT 6 — HALTING PROBLEM ===== */
function haltDemo() {
    setResult("haltResult", "⚠ This program may run forever... The Halting Problem proves no algorithm can decide this for all cases.", "info");
}
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
