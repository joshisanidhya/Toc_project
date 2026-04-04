/* Regex Checker JS */
/* ===== UNIT 2 — REGEX ===== */
function checkRegex() {
    let regex = document.getElementById("regex").value;
    let str = document.getElementById("regexStr").value;

    try {
        let re = new RegExp("^" + regex + "$");
        if (re.test(str)) {
            setResult("regexResult", "✓ Matched — String belongs to the language", "accepted");
        } else {
            setResult("regexResult", "✗ Not Matched — String is not in the language", "rejected");
        }
    } catch (e) {
        setResult("regexResult", "⚠ Invalid regex: " + e.message, "rejected");
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
