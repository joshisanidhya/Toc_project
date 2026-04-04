/* PDA Simulator JS */
/* ===== UNIT 4 — PDA ===== */
function runPDA() {
    let input = document.getElementById("pdaInput").value;
    let stack = [];

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
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
