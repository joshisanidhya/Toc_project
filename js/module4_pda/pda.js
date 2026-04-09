/* PDA Simulator JS */
/* ===== UNIT 4 — PDA ===== */
function runPDA() {
    let input = document.getElementById("pdaInput").value;
    input = input.replace(/\s+/g, "");
    let stack = [];

    if (!input) {
        setResult("pdaResult", "Please enter a parentheses string first.", "rejected");
        return;
    }

    if (/[^()]/.test(input)) {
        setResult("pdaResult", "Only '(' and ')' are allowed for this simulator.", "rejected");
        return;
    }

    for (let ch of input) {
        if (ch === '(') stack.push(ch);
        else if (ch === ')') {
            if (stack.length === 0) {
                setResult("pdaResult", "✗ Rejected — Unmatched closing parenthesis", "rejected");
                return;
            }
            stack.pop();
        }
    }

    if (stack.length === 0) {
        setResult("pdaResult", "✓ Accepted — All parentheses balanced", "accepted");
    } else {
        setResult("pdaResult", "✗ Rejected — " + stack.length + " unmatched opening parenthesis(es)", "rejected");
    }
}

const PDA_EXAMPLES = ["(())", "((()))", "(()", ")("];
let pdaExampleIndex = 0;

function loadPDAExample() {
    const inputEl = document.getElementById("pdaInput");
    if (!inputEl) return;

    inputEl.value = PDA_EXAMPLES[pdaExampleIndex];
    pdaExampleIndex = (pdaExampleIndex + 1) % PDA_EXAMPLES.length;
    inputEl.focus();
}

document.addEventListener("DOMContentLoaded", () => {
    const inputEl = document.getElementById("pdaInput");
    if (!inputEl) return;

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runPDA();
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
