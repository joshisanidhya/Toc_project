/* ===== PAGE NAVIGATION ===== */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(pageId + '-page');
    if (target) target.classList.add('active');

    // Update navbar links
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Scroll to top when switching pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== SECTION NAVIGATION (Simulator) ===== */
function show(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');

    // Update sidebar buttons
    document.querySelectorAll('.sidebar-btn[data-unit]').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.sidebar-btn[data-unit="${id}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

/* ===== NAVBAR SCROLL EFFECT ===== */
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ===== RESULT HELPER ===== */
function setResult(elementId, text, type) {
    const el = document.getElementById(elementId);
    el.innerText = text;
    el.className = 'result-box ' + type;
}

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

/* ===== UNIT 5 — TURING MACHINE ===== */
function runTM() {
    let input = document.getElementById("tmInput").value;
    let result = "";

    for (let ch of input) {
        result += (ch === '0') ? '1' : '0';
    }

    setResult("tmResult", "Output: " + result + "  (Every bit flipped)", "info");
}

/* ===== UNIT 6 — HALTING PROBLEM ===== */
function haltDemo() {
    setResult("haltResult", "⚠ This program may run forever... The Halting Problem proves no algorithm can decide this for all cases.", "info");
}
