/* ===== Parse Tree Generator JS ===== */
/*
  Grammar input format (same as cfg.html):
    One rule per line:  A->aB|c   or  A→aB|c
  Builds a derivation tree using recursive-descent BFS expansion.
  Renders a visual text tree in the output panel.
*/

let grammar = {};   // { 'S': [['a','S','b'], ['ε']], ... }
let startVar = '';

/* ─── Parse grammar rules ────────────────────────────── */
function parseGrammar() {
    const rulesRaw = document.getElementById('ptRules')?.value.trim();
    const startRaw = document.getElementById('ptStart')?.value.trim();
    if (!rulesRaw || !startRaw) throw new Error('Rules and start variable are required.');

    grammar = {};
    startVar = startRaw;

    rulesRaw.split('\n').forEach(line => {
        line = line.trim(); if (!line) return;
        const sep = line.includes('→') ? '→' : '->';
        const [lhs, rhs] = line.split(sep);
        if (!lhs || !rhs) return;
        const lhsTrim = lhs.trim();
        const alts = rhs.split('|').map(alt => [...alt.trim()].filter(c => c !== ' ') );
        if (!grammar[lhsTrim]) grammar[lhsTrim] = [];
        grammar[lhsTrim].push(...alts);
    });

    if (!grammar[startVar]) throw new Error(`Start variable '${startVar}' has no rules.`);
}

/* ─── Tree node ──────────────────────────────────────── */
function makeNode(sym, children = []) { return { sym, children }; }

/* ─── Recursive derivation (depth-limited BFS) ────────── */
function derive(sym, target, depth) {
    if (depth < 0) return null;
    if (!(sym in grammar)) {
        // terminal
        if (sym === target) return makeNode(sym);
        return null;
    }
    for (const prod of grammar[sym]) {
        const result = deriveSeq(prod, target, depth - 1);
        if (result !== null) {
            const node = makeNode(sym);
            node.children = result;
            return node;
        }
    }
    return null;
}

function deriveSeq(symbols, target, depth) {
    // Try all splits of target string among the symbols
    return splitAmong(symbols, target, depth);
}

function splitAmong(syms, str, depth) {
    if (syms.length === 0) return str === '' ? [] : null;
    if (syms.length === 1) {
        const sym = syms[0];
        if (sym === 'ε') return str === '' ? [makeNode('ε')] : null;
        const node = derive(sym, str, depth);
        return node ? [node] : null;
    }
    // Try all split points
    for (let i = 0; i <= str.length; i++) {
        const left  = str.slice(0, i);
        const right = str.slice(i);
        const sym   = syms[0];
        let leftNode;
        if (sym === 'ε') {
            leftNode = left === '' ? makeNode('ε') : null;
        } else {
            leftNode = derive(sym, left, depth);
        }
        if (!leftNode) continue;
        const restNodes = splitAmong(syms.slice(1), right, depth);
        if (restNodes !== null) return [leftNode, ...restNodes];
    }
    return null;
}

/* ─── Render tree as indented HTML ──────────────────────── */
function renderTree(node, prefix = '', isLast = true, isRoot = true) {
    const connector = isRoot ? '' : (isLast ? '└─ ' : '├─ ');
    const childPrefix = isRoot ? '' : (isLast ? '   ' : '│  ');
    const isNT = node.sym in grammar;
    const color = isNT ? 'var(--accent)' : node.sym === 'ε' ? 'var(--muted)' : 'rgba(255,255,255,0.85)';

    let html = `<div style="font-family:var(--font-mono);font-size:0.82rem;line-height:1.8;white-space:pre">`;
    html += `<span style="color:var(--muted)">${escH(prefix + connector)}</span>`;
    html += `<span style="color:${color};font-weight:${isNT?'700':'400'}">${escH(node.sym)}</span>`;
    if (isNT) html += `<span style="color:rgba(255,255,255,0.25);font-size:0.72rem"> (NT)</span>`;
    html += '</div>';

    node.children.forEach((child, i) => {
        const last = i === node.children.length - 1;
        html += renderTree(child, prefix + childPrefix, last, false);
    });
    return html;
}

function escH(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ─── Derivation steps ────────────────────────────────── */
function getDerivationSteps(node) {
    const steps = [];
    function collect(n, sentential) {
        if (!n.children.length) return;
        // Find the leftmost non-terminal in sentential
        const parts = sentential.map(s => s);
        const idx = parts.findIndex(s => s in grammar);
        if (idx < 0) return;
        const expansion = n.sym === parts[idx] ? n.children.map(c=>c.sym) : null;
        if (expansion) {
            parts.splice(idx, 1, ...expansion);
            steps.push([...parts]);
        }
        n.children.forEach(c => collect(c, sentential));
    }
    steps.push([node.sym]);
    collect(node, [node.sym]);
    return steps;
}

/* ─── Main function ──────────────────────────────────── */
function generateParseTree() {
    const inputStr = document.getElementById('ptInput')?.value ?? '';

    try {
        parseGrammar();
    } catch(e) {
        showPTResult('⚠ ' + e.message, 'rejected');
        return;
    }

    const target = inputStr === '' ? 'ε' : inputStr;
    const depth  = Math.max(8, inputStr.length * 3);

    const tree = derive(startVar, inputStr, depth);

    if (!tree) {
        showPTResult(`✗ "${escH(inputStr)}" cannot be derived from ${startVar} in this grammar.`, 'rejected');
        document.getElementById('ptTreeWrap').innerHTML = '';
        document.getElementById('ptStepsWrap').innerHTML = '';
        const c = document.getElementById('ptResultContainer'); if(c) c.classList.add('open');
        const ph = document.getElementById('ptPlaceholder'); if(ph) ph.style.display='none';
        return;
    }

    showPTResult(`✓ "${escH(inputStr)}" ∈ L(G) — Parse tree generated successfully!`, 'accepted');

    // Render tree
    const treeWrap = document.getElementById('ptTreeWrap');
    if (treeWrap) {
        treeWrap.innerHTML = `
            <div class="lc-ex-label" style="margin-bottom:8px">🌲 Parse Tree</div>
            <div style="background:rgba(0,0,0,0.35);border:1px solid var(--border);border-radius:var(--radius);padding:16px;overflow-x:auto">
                ${renderTree(tree)}
            </div>`;
        treeWrap.style.display = 'block';
    }

    // Render derivation steps
    // Build leftmost derivation
    const steps = buildDerivationSteps(tree);
    const stepsWrap = document.getElementById('ptStepsWrap');
    if (stepsWrap && steps.length) {
        const rows = steps.map((s, i) => `
            <div style="display:flex;align-items:baseline;gap:10px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
                <span style="color:var(--muted);font-size:0.7rem;min-width:28px;text-align:right">${i===0?'':('⇒')}</span>
                <span style="font-family:var(--font-mono);font-size:0.83rem;color:${i===steps.length-1?'#22c55e':'rgba(255,255,255,0.8)'}">${s.map(sym => `<span style="color:${sym in grammar?'var(--accent)':'rgba(255,255,255,0.8)'}">${escH(sym)}</span>`).join(' ')}</span>
            </div>`).join('');
        stepsWrap.innerHTML = `<div class="lc-ex-label" style="margin-bottom:8px">Leftmost Derivation</div>
            <div style="background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px">${rows}</div>`;
        stepsWrap.style.display = 'block';
    }

    const c = document.getElementById('ptResultContainer'); if(c) c.classList.add('open');
    const ph = document.getElementById('ptPlaceholder'); if(ph) ph.style.display='none';
}

function buildDerivationSteps(tree) {
    const steps = [[tree.sym]];
    function expand(node, sentential) {
        if (!node.children.length) return sentential;
        const idx = sentential.indexOf(node.sym);
        if (idx < 0) return sentential;
        const expansion = node.children.map(c => c.sym).filter(s => s !== 'ε');
        const newSent = [...sentential.slice(0, idx), ...expansion, ...sentential.slice(idx+1)];
        steps.push([...newSent]);
        let s = newSent;
        node.children.forEach(child => { s = expand(child, s); });
        return s;
    }
    expand(tree, [tree.sym]);
    return steps;
}

function showPTResult(msg, type) {
    const el = document.getElementById('ptResult');
    if (el) { el.innerHTML = msg; el.className = 'result-box ' + type; }
}

function loadPTExample() {
    document.getElementById('ptRules').value  = 'S->aSb|ε';
    document.getElementById('ptStart').value  = 'S';
    document.getElementById('ptInput').value  = 'aabb';
}

document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('ptInput');
    if (inp) inp.addEventListener('keydown', e => { if(e.key==='Enter') generateParseTree(); });
});
