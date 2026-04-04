/* ===== CFG → CNF Converter JS ===== */
/*
  Steps per Sipser's algorithm:
  1. START   – new start S0 → S
  2. DEL     – eliminate ε-rules (nullable vars)
  3. UNIT    – eliminate unit rules (A → B)
  4. TERM    – replace terminals in long rules (A→aB becomes A→UaB, Ua→a)
  5. BIN     – break long RHS into binary rules (A→BCD becomes A→BE, E→CD)
*/

let cnfSteps = [];
let freshCount = 0;
function freshVar(used) {
    let v;
    do { v = 'X' + (++freshCount); } while (used.has(v));
    used.add(v); return v;
}
function escH(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ─── Parse input ────────────────────────────────────── */
function parseCNFInput() {
    const rulesRaw = document.getElementById('cnfRules')?.value.trim();
    const startRaw = document.getElementById('cnfStart')?.value.trim();
    if (!rulesRaw || !startRaw) throw new Error('Rules and start variable required.');

    const rules = [];   // [{ lhs, rhs: string[] }]
    const vars  = new Set();

    rulesRaw.split('\n').forEach(line => {
        line = line.trim(); if (!line) return;
        const sep = line.includes('→') ? '→' : '->';
        const [lhs, rhs] = line.split(sep);
        if (!lhs || !rhs) return;
        const lhsTrim = lhs.trim();
        vars.add(lhsTrim);
        rhs.split('|').forEach(alt => {
            const syms = alt.trim().split(/\s+/).flatMap(s => s === '' ? [] : (s.length > 1 ? [...s] : [s]));
            rules.push({ lhs: lhsTrim, rhs: syms });
        });
    });

    return { rules, start: startRaw, vars, used: new Set([...vars]) };
}

function rulesHTML(rules, vars, label, desc) {
    const rows = rules.map(r =>
        `<tr><td style="color:var(--accent);font-family:var(--font-mono)">${escH(r.lhs)}</td>
              <td style="color:rgba(255,255,255,0.35)">→</td>
              <td style="font-family:var(--font-mono);color:rgba(255,255,255,0.8)">${r.rhs.map(s => vars.has(s)?`<span style="color:var(--accent)">${escH(s)}</span>`:escH(s)).join(' ')}</td>
        </tr>`).join('');
    return `<div style="margin-bottom:4px"><span style="background:var(--accent);color:#000;font-weight:800;font-size:0.7rem;padding:2px 8px;border-radius:99px">${label}</span>
        <span style="font-size:0.82rem;color:var(--muted);margin-left:8px">${desc}</span></div>
        <div style="overflow-x:auto;background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:12px">
        <table style="border-collapse:collapse;width:100%"><tbody>${rows}</tbody></table></div>`;
}

function deepCopyRules(rules) { return rules.map(r => ({ lhs: r.lhs, rhs: [...r.rhs] })); }

/* ─── Step 1: START ─────────────────────────────────── */
function stepStart(rules, start, used) {
    const s0 = freshVar(used);
    const newRules = [{ lhs: s0, rhs: [start] }, ...deepCopyRules(rules)];
    return { rules: newRules, start: s0 };
}

/* ─── Step 2: DEL (ε-rules) ─────────────────────────── */
function stepDel(rules, start, vars) {
    // Find nullable vars
    const nullable = new Set();
    let changed = true;
    while (changed) {
        changed = false;
        rules.forEach(r => {
            if (!nullable.has(r.lhs) && (r.rhs.every(s => s === 'ε' || nullable.has(s)))) {
                nullable.add(r.lhs); changed = true;
            }
        });
    }
    // Generate all subsets
    const newRules = [];
    rules.forEach(r => {
        if (r.rhs.length === 1 && r.rhs[0] === 'ε') return; // remove ε rules (except start)
        const nullableIdx = r.rhs.reduce((acc, s, i) => nullable.has(s) ? [...acc, i] : acc, []);
        const subsets = subsets2(nullableIdx);
        subsets.forEach(skip => {
            const rhs = r.rhs.filter((_, i) => !skip.has(i));
            if (rhs.length > 0) newRules.push({ lhs: r.lhs, rhs });
        });
    });
    // Allow ε only if start was nullable
    const deduped = dedup(newRules);
    if (nullable.has(start)) deduped.push({ lhs: start, rhs: ['ε'] });
    return deduped;
}

function subsets2(indices) {
    const result = [new Set()];
    indices.forEach(i => {
        const newSets = result.map(s => new Set([...s, i]));
        result.push(...newSets);
    });
    return result;
}

function dedup(rules) {
    const seen = new Set();
    return rules.filter(r => {
        const key = r.lhs + '→' + r.rhs.join(',');
        if (seen.has(key)) return false;
        seen.add(key); return true;
    });
}

/* ─── Step 3: UNIT (unit rules) ─────────────────────── */
function stepUnit(rules, vars) {
    // Compute unit pairs reachable via unit rules
    const unitPairs = new Set();
    vars.forEach(v => unitPairs.add(v + '→' + v));
    let changed = true;
    while (changed) {
        changed = false;
        rules.forEach(r => {
            if (r.rhs.length === 1 && vars.has(r.rhs[0])) {
                const pair = r.lhs + '→' + r.rhs[0];
                if (!unitPairs.has(pair)) { unitPairs.add(pair); changed = true; }
                // Transitivity
                unitPairs.forEach(p => {
                    const [a, b] = p.split('→');
                    if (b === r.rhs[0]) {
                        const tp = a + '→' + r.lhs;
                        if (!unitPairs.has(tp)) { unitPairs.add(tp); changed = true; }
                    }
                });
            }
        });
    }
    const newRules = [];
    unitPairs.forEach(pair => {
        const [a, b] = pair.split('→');
        rules.forEach(r => {
            if (r.lhs === b && !(r.rhs.length === 1 && vars.has(r.rhs[0]))) {
                newRules.push({ lhs: a, rhs: [...r.rhs] });
            }
        });
    });
    return dedup(newRules);
}

/* ─── Step 4: TERM (lone terminals in long rules) ───── */
function stepTerm(rules, vars, used) {
    const termMap = {};   // 'a' → 'Ta'
    const newRules = [];
    rules.forEach(r => {
        if (r.rhs.length <= 1) { newRules.push({ lhs: r.lhs, rhs: [...r.rhs] }); return; }
        const rhs = r.rhs.map(s => {
            if (!vars.has(s) && s !== 'ε') {
                if (!termMap[s]) { termMap[s] = freshVar(used); vars.add(termMap[s]); }
                return termMap[s];
            }
            return s;
        });
        newRules.push({ lhs: r.lhs, rhs });
    });
    Object.entries(termMap).forEach(([t, v]) => newRules.push({ lhs: v, rhs: [t] }));
    return dedup(newRules);
}

/* ─── Step 5: BIN (binary rules) ────────────────────── */
function stepBin(rules, vars, used) {
    const newRules = [];
    rules.forEach(r => {
        if (r.rhs.length <= 2) { newRules.push({ lhs: r.lhs, rhs: [...r.rhs] }); return; }
        let lhs = r.lhs;
        let rem = [...r.rhs];
        while (rem.length > 2) {
            const next = freshVar(used);
            vars.add(next);
            newRules.push({ lhs, rhs: [rem[0], next] });
            lhs = next;
            rem = rem.slice(1);
        }
        newRules.push({ lhs, rhs: rem });
    });
    return dedup(newRules);
}

/* ─── Main convert function ──────────────────────────── */
function convertCNF() {
    freshCount = 0; cnfSteps = [];
    try {
        let { rules, start, vars, used } = parseCNFInput();

        cnfSteps.push({ label: '0 — Original Grammar', desc: 'The input CFG before any transformation.', rules: deepCopyRules(rules), vars: new Set(vars) });

        // Step 1
        const s1 = stepStart(rules, start, used);
        vars.add(s1.start); rules = s1.rules; start = s1.start;
        cnfSteps.push({ label: '1 — START', desc: `New start symbol <code>${escH(start)}</code> added to prevent start from appearing on RHS.`, rules: deepCopyRules(rules), vars: new Set(vars) });

        // Step 2
        rules = stepDel(rules, start, vars);
        cnfSteps.push({ label: '2 — DEL (ε-elimination)', desc: 'ε-producing variables identified; ε-rules removed with all optional-inclusion alternatives added.', rules: deepCopyRules(rules), vars: new Set(vars) });

        // Step 3
        rules = stepUnit(rules, vars);
        cnfSteps.push({ label: '3 — UNIT (unit-rule elimination)', desc: 'Unit rules (A → B) replaced by copying all non-unit productions of B into A.', rules: deepCopyRules(rules), vars: new Set(vars) });

        // Step 4
        rules = stepTerm(rules, vars, used);
        cnfSteps.push({ label: '4 — TERM (terminal isolation)', desc: 'Lone terminals in long rules wrapped in fresh unit variables (Tₐ → a).', rules: deepCopyRules(rules), vars: new Set(vars) });

        // Step 5
        rules = stepBin(rules, vars, used);
        cnfSteps.push({ label: '5 — BIN (binarization)', desc: 'Rules with ≥3 symbols on RHS split into binary rules using fresh variables.', rules: deepCopyRules(rules), vars: new Set(vars) });

        renderCNFSteps();
        setResult('cnfResult', `✓ Done — CNF has ${rules.length} rules`, 'accepted');
        const c = document.getElementById('cnfResultContainer'); if(c) c.classList.add('open');
        const ph = document.getElementById('cnfPlaceholder'); if(ph) ph.style.display='none';

    } catch(e) {
        setResult('cnfResult', '⚠ ' + e.message, 'rejected');
        const c = document.getElementById('cnfResultContainer'); if(c) c.classList.add('open');
    }
}

function renderCNFSteps() {
    const wrap = document.getElementById('cnfStepsWrap');
    if (!wrap) return;
    wrap.innerHTML = cnfSteps.map(step =>
        `<div style="margin-bottom:18px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="background:var(--accent);color:#000;font-weight:800;font-size:0.7rem;padding:2px 10px;border-radius:99px">${step.label}</span>
            </div>
            <div style="font-size:0.82rem;color:var(--muted);margin-bottom:8px;line-height:1.6">${step.desc}</div>
            ${rulesHTML(step.rules, step.vars, '', '')}
        </div>`).join('<div style="border-top:1px solid var(--border);margin:4px 0 16px"></div>');
    wrap.style.display = 'block';
}

function loadCNFExample() {
    document.getElementById('cnfRules').value = 'S->ASA|aB\nA->B|S\nB->b|ε';
    document.getElementById('cnfStart').value = 'S';
}

document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('cnfRulesInput');
    if (inp) inp.addEventListener('keydown', e => { if(e.key==='Enter') convertCNF(); });
});
