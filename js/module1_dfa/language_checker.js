/* ===== Language Checker JS ===== */

const LANGUAGES = [
    {
        id: 'ends-01',
        name: 'Ends with "01"',
        icon: '🔚',
        alphabetStr: 'Σ = {0, 1}',
        description: 'Accepts all binary strings that end with the substring "01". The DFA tracks whether the last two characters seen form the pattern "01".',
        examples: ['01', '001', '1001', '10001'],
        nonExamples: ['0', '1', '10', '100', 'ε'],
        regex: '(0 | 1)* · 01',
        states: ['q0', 'q1', 'q2'],
        start: 'q0',
        accept: ['q2'],
        transitions: { 'q0,0': 'q1', 'q0,1': 'q0', 'q1,0': 'q1', 'q1,1': 'q2', 'q2,0': 'q1', 'q2,1': 'q0' },
        color: '#D2FF00', colorDim: 'rgba(210,255,0,0.12)',
        stateDesc: { q0: 'start / no 0 prefix', q1: 'last char = 0', q2: 'last chars = 01 ✓' }
    },
    {
        id: 'even-zeros',
        name: 'Even number of 0s',
        icon: '#️⃣',
        alphabetStr: 'Σ = {0, 1}',
        description: 'Accepts binary strings containing an even number of 0s. Zero 0s (e.g. all-1 strings, or ε) counts as even.',
        examples: ['ε', '1', '00', '0011', '1001'],
        nonExamples: ['0', '001', '10', '000'],
        regex: '1*(0 1* 0 1*)*',
        states: ['q0', 'q1'],
        start: 'q0',
        accept: ['q0'],
        transitions: { 'q0,0': 'q1', 'q0,1': 'q0', 'q1,0': 'q0', 'q1,1': 'q1' },
        color: '#22c55e', colorDim: 'rgba(34,197,94,0.12)',
        stateDesc: { q0: 'even 0s (start / accept)', q1: 'odd 0s seen' }
    },
    {
        id: 'starts-a',
        name: "Starts with 'a'",
        icon: '🅰️',
        alphabetStr: 'Σ = {a, b}',
        description: "Accepts strings over {a, b} that begin with 'a'. Any string starting with 'b' is immediately sent to a dead state.",
        examples: ['a', 'ab', 'abba', 'aab'],
        nonExamples: ['b', 'ba', 'baa', 'ε'],
        regex: 'a · (a | b)*',
        states: ['q0', 'q1', 'qd'],
        start: 'q0',
        accept: ['q1'],
        transitions: { 'q0,a': 'q1', 'q0,b': 'qd', 'q1,a': 'q1', 'q1,b': 'q1', 'qd,a': 'qd', 'qd,b': 'qd' },
        color: '#a78bfa', colorDim: 'rgba(167,139,250,0.12)',
        stateDesc: { q0: 'start state', q1: 'first char = a ✓', qd: 'dead state' }
    },
    {
        id: 'contains-00',
        name: "Contains '00'",
        icon: '🔎',
        alphabetStr: 'Σ = {0, 1}',
        description: "Accepts binary strings that contain the substring '00' at least once. Once '00' is found, further input is irrelevant.",
        examples: ['00', '100', '001', '1100'],
        nonExamples: ['0', '1', '01', '10', '101'],
        regex: '(0|1)* 00 (0|1)*',
        states: ['q0', 'q1', 'q2'],
        start: 'q0',
        accept: ['q2'],
        transitions: { 'q0,0': 'q1', 'q0,1': 'q0', 'q1,0': 'q2', 'q1,1': 'q0', 'q2,0': 'q2', 'q2,1': 'q2' },
        color: '#f97316', colorDim: 'rgba(249,115,22,0.12)',
        stateDesc: { q0: 'start / no 0 prefix', q1: 'last char = 0', q2: 'seen "00" ✓' }
    },
    {
        id: 'odd-length',
        name: 'Odd length strings',
        icon: '🔢',
        alphabetStr: 'Σ = {0, 1}',
        description: 'Accepts binary strings whose length is odd (1, 3, 5, …). The DFA simply alternates between two states on every character.',
        examples: ['0', '1', '001', '010', '111'],
        nonExamples: ['ε', '00', '01', '0010'],
        regex: '(0|1)((0|1)(0|1))*',
        states: ['qe', 'qo'],
        start: 'qe',
        accept: ['qo'],
        transitions: { 'qe,0': 'qo', 'qe,1': 'qo', 'qo,0': 'qe', 'qo,1': 'qe' },
        color: '#38bdf8', colorDim: 'rgba(56,189,248,0.12)',
        stateDesc: { qe: 'even length (start)', qo: 'odd length ✓' }
    }
];

let selectedLang = LANGUAGES[0];

/* ─── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    renderLangCards();
    selectLanguage('ends-01');

    // Enter key on input
    const inp = document.getElementById('lcInput');
    if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkString(); });
});

/* ─── Render clickable language cards ────────────────── */
function renderLangCards() {
    const grid = document.getElementById('langCardsGrid');
    if (!grid) return;
    grid.innerHTML = LANGUAGES.map(lang => `
        <div class="lang-card" data-lang-id="${lang.id}" onclick="selectLanguage('${lang.id}')"
             style="--card-color:${lang.color};--card-color-dim:${lang.colorDim}">
            <div class="lang-icon">${lang.icon}</div>
            <div class="lang-info">
                <div class="lang-name">${lang.name}</div>
                <div class="lang-alphabet">${lang.alphabetStr}</div>
            </div>
            <div class="lang-check-icon">
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="2,5 4,7 8,3"></polyline>
                </svg>
            </div>
        </div>
    `).join('');
}

/* ─── Select a language ──────────────────────────────── */
function selectLanguage(id) {
    selectedLang = LANGUAGES.find(l => l.id === id) || LANGUAGES[0];

    document.querySelectorAll('.lang-card').forEach(c =>
        c.classList.toggle('active', c.dataset.langId === id));

    renderLangInfo();
    resetResult();
    loadDFAGraph();
}

/* ─── Render language info panel ─────────────────────── */
function renderLangInfo() {
    const section = document.getElementById('lcInfoSection');
    if (!section) return;
    const lang = selectedLang;

    const transRows = Object.entries(lang.transitions).map(([k, v]) => {
        const [state, sym] = k.split(',');
        return `<tr>
            <td class="state-col">${state}</td>
            <td style="color:var(--muted);text-align:center">${sym}</td>
            <td style="text-align:right;color:rgba(255,255,255,0.8)">→ ${v}</td>
        </tr>`;
    }).join('');

    const stateBadges = lang.states.map(s => {
        const isStart  = s === lang.start;
        const isAccept = lang.accept.includes(s);
        const cls = isAccept ? 'accept-badge' : isStart ? 'start-badge' : 'regular-badge';
        const prefix = isStart ? '→ ' : '';
        const suffix = isAccept ? ' ★' : '';
        return `<span class="state-badge ${cls}">${prefix}${s}${suffix}</span>`;
    }).join('');

    const acceptPills  = lang.examples.map(e    => `<span class="lc-pill accept">${e}</span>`).join('');
    const rejectPills  = lang.nonExamples.map(e => `<span class="lc-pill reject">${e}</span>`).join('');

    section.innerHTML = `
        <div class="lc-lang-name">${lang.icon} ${lang.name}</div>
        <div class="lc-desc">${lang.description}</div>
        <div style="margin-bottom:12px">
            <div class="lc-ex-label" style="margin-bottom:5px">Regex Pattern</div>
            <code class="lc-regex">${lang.regex}</code>
        </div>
        <div class="lc-examples-row">
            <div class="lc-ex-group">
                <div class="lc-ex-label">✓ Accepted</div>
                <div class="lc-ex-pills">${acceptPills}</div>
            </div>
            <div class="lc-ex-group">
                <div class="lc-ex-label">✗ Rejected</div>
                <div class="lc-ex-pills">${rejectPills}</div>
            </div>
        </div>
        <div style="margin-bottom:10px">
            <div class="lc-ex-label" style="margin-bottom:6px">States</div>
            <div class="lc-state-map">${stateBadges}</div>
        </div>
        <details>
            <summary>δ — Transition Function</summary>
            <table class="lc-trans-table">
                <thead><tr><th>State</th><th style="text-align:center">Symbol</th><th style="text-align:right">Next</th></tr></thead>
                <tbody>${transRows}</tbody>
            </table>
        </details>
    `;
}

/* ─── Check a string ─────────────────────────────────── */
function checkString() {
    const input = (document.getElementById('lcInput')?.value) ?? '';
    const lang  = selectedLang;

    let state = lang.start;
    let trace = [{ state, char: null }];
    let rejected = false, rejectReason = '';

    for (const ch of input) {
        const key = state + ',' + ch;
        if (!lang.transitions[key]) {
            rejected = true;
            rejectReason = `No transition for (${state}, '${ch}')`;
            break;
        }
        state = lang.transitions[key];
        trace.push({ state, char: ch });
    }

    const accepted = !rejected && lang.accept.includes(state);

    if (rejected) {
        setResult('lcResult', '✗ Rejected — ' + rejectReason, 'rejected');
    } else if (accepted) {
        setResult('lcResult', `✓ Accepted — Ended in state ${state}`, 'accepted');
    } else {
        setResult('lcResult', `✗ Rejected — Ended in non-accepting state ${state}`, 'rejected');
    }

    const container = document.getElementById('lcResultContainer');
    if (container) container.classList.add('open');

    renderLCTrace(trace, accepted, rejected);
}

/* ─── Render execution trace ─────────────────────────── */
function renderLCTrace(trace, isAccepted, isRejectedEarly) {
    const tc = document.getElementById('lcTraceContainer');
    if (!tc) return;
    tc.innerHTML = '<div class="trace-label">Execution Trace:</div>';

    trace.forEach((step, index) => {
        const delay = index * 0.15;
        if (step.char !== null) {
            const arrow = document.createElement('div');
            arrow.className = 'trace-arrow';
            arrow.style.animationDelay = `${delay - 0.05}s`;
            arrow.innerHTML = `→<sup class="trace-consumed">${step.char}</sup>`;
            tc.appendChild(arrow);
        }
        const chip = document.createElement('div');
        chip.className = 'trace-chip';
        chip.style.animationDelay = `${delay}s`;
        chip.innerText = step.state;
        if (index === 0) chip.classList.add('start');
        if (index === trace.length - 1) {
            if (trace.length === 1) chip.classList.remove('start');
            chip.classList.add(isAccepted ? 'accept' : 'reject');
        }
        tc.appendChild(chip);
    });
}

/* ─── Load DFA graph for selected language ───────────── */
function loadDFAGraph() {
    const lang     = selectedLang;
    const transText = Object.entries(lang.transitions).map(([k, v]) => `${k}=${v}`).join('\n');

    const transEl  = document.getElementById('dfaTransitions');
    const startEl  = document.getElementById('dfaStart');
    const acceptEl = document.getElementById('dfaAccept');
    if (transEl)  transEl.value  = transText;
    if (startEl)  startEl.value  = lang.start;
    if (acceptEl) acceptEl.value = lang.accept.join(',');

    const ph = document.getElementById('graphPlaceholder');
    if (ph) ph.style.display = 'none';

    if (window._drawDFAGraph) setTimeout(window._drawDFAGraph, 60);
}

/* ─── Reset result area ──────────────────────────────── */
function resetResult() {
    const container = document.getElementById('lcResultContainer');
    if (container) container.classList.remove('open');
}
