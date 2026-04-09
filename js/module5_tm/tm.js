/* Turing Machine JS */
/* ===== UNIT 5 — TURING MACHINE ===== */
function runTM() {
    let input = document.getElementById("tmInput").value;
    input = input.replace(/\s+/g, "");
    let result = "";

    if (!input) {
        setResult("tmResult", "Please enter a binary tape first.", "rejected");
        return;
    }

    if (/[^01]/.test(input)) {
        setResult("tmResult", "Only 0 and 1 are allowed for this machine.", "rejected");
        return;
    }

    for (let ch of input) {
        result += (ch === '0') ? '1' : '0';
    }

    setResult("tmResult", "Output: " + result + "  (Every bit flipped)", "accepted");
}

const TM_EXAMPLES = ["0110", "10101", "0000", "111000"];
let tmExampleIndex = 0;

function loadTMExample() {
    const inputEl = document.getElementById("tmInput");
    if (!inputEl) return;

    inputEl.value = TM_EXAMPLES[tmExampleIndex];
    tmExampleIndex = (tmExampleIndex + 1) % TM_EXAMPLES.length;
    inputEl.focus();
}

document.addEventListener("DOMContentLoaded", () => {
    const inputEl = document.getElementById("tmInput");
    if (!inputEl) return;

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runTM();
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
