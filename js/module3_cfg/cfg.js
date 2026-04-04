/* CFG Derivation JS */
/* ===== UNIT 3 — CFG ===== */
function checkCFG() {
    let rules = document.getElementById("cfgRules").value;
    let str = document.getElementById("cfgInput").value;

    if (rules.includes("S->") && str.length > 0) {
        setResult("cfgResult", "✓ Derivation possible (basic check)", "accepted");
    } else {
        setResult("cfgResult", "✗ Invalid — Ensure rules start with S-> and input is non-empty", "rejected");
    }
}
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
