/* DFA Simulator JS */
/* ===== UNIT 1 — DFA ===== */
function runDFA() {
    let transitions = document.getElementById("dfaTransitions").value.split("\n");
    let start = document.getElementById("dfaStart").value.trim();
    let accept = document.getElementById("dfaAccept").value.split(",").map(s => s.trim());
    let input = document.getElementById("dfaInput").value;

    let map = {};

    transitions.forEach(t => {
        let [left, right] = t.split("=");
        if (left && right) map[left.trim()] = right.trim();
    });

    let state = start;

    for (let ch of input) {
        let key = state + "," + ch;
        if (!map[key]) {
            setResult("dfaResult", "✗ Rejected — No transition for (" + state + ", " + ch + ")", "rejected");
            return;
        }
        state = map[key];
    }

    if (accept.includes(state)) {
        setResult("dfaResult", "✓ Accepted — Ended in state " + state, "accepted");
    } else {
        setResult("dfaResult", "✗ Rejected — Ended in non-accepting state " + state, "rejected");
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
