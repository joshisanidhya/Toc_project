/* Turing Machine JS */
/* ===== UNIT 5 — TURING MACHINE ===== */
function runTM() {
    let input = document.getElementById("tmInput").value;
    let result = "";

    for (let ch of input) {
        result += (ch === '0') ? '1' : '0';
    }

    setResult("tmResult", "Output: " + result + "  (Every bit flipped)", "info");
}
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
