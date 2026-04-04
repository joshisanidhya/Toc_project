/* ===== RE → NFA Converter JS (Thompson's Construction) ===== */

/*
  Supported regex operators (Thompson's Construction):
    a         → single symbol
    a·b       → concatenation (implicit)
    a|b       → union
    a*        → Kleene star
    a+        → one or more  (= a·a*)
    a?        → zero or one  (= ε | a)
    (...)     → grouping
*/

let nfaStates = [];
let nfaEdges  = [];
let nfaStart  = null;
let nfaAccept = null;
let stateCounter = 0;

function newState(label) {
    const id = 's' + (stateCounter++);
    nfaStates.push({ id, label: label || id });
    return id;
}

/* ─── Tokeniser ─────────────────────────────────────── */
function tokenise(re) {
    const tokens = [];
    const explicit = [...re];
    // Insert explicit · concatenation operator
    for (let i = 0; i < explicit.length; i++) {
        tokens.push(explicit[i]);
        if (i + 1 < explicit.length) {
            const cur  = explicit[i];
            const next = explicit[i + 1];
            const concatAfter = cur !== '(' && cur !== '|';
            const concatBefore = next !== ')' && next !== '|' && next !== '*' && next !== '+' && next !== '?';
            if (concatAfter && concatBefore) tokens.push('·');
        }
    }
    return tokens;
}

/* ─── Shunting-yard to postfix ──────────────────────── */
const PREC = { '|': 1, '·': 2, '?': 3, '+': 3, '*': 3 };
function toPostfix(tokens) {
    const out = [], ops = [];
    for (const t of tokens) {
        if (t === '(') { ops.push(t); }
        else if (t === ')') {
            while (ops.length && ops[ops.length-1] !== '(') out.push(ops.pop());
            ops.pop();
        } else if (t in PREC) {
            while (ops.length && ops[ops.length-1] !== '(' && (PREC[ops[ops.length-1]] || 0) >= PREC[t])
                out.push(ops.pop());
            ops.push(t);
        } else {
            out.push(t); // literal
        }
    }
    while (ops.length) out.push(ops.pop());
    return out;
}

/* ─── NFA fragment: { start, accept } ──────────────── */
function thompsonSymbol(sym) {
    const s = newState(); const a = newState();
    nfaEdges.push({ from: s, to: a, label: sym === 'ε' ? 'ε' : sym });
    return { start: s, accept: a };
}

function thompsonConcat(f1, f2) {
    nfaEdges.push({ from: f1.accept, to: f2.start, label: 'ε' });
    return { start: f1.start, accept: f2.accept };
}

function thompsonUnion(f1, f2) {
    const s = newState(); const a = newState();
    nfaEdges.push({ from: s, to: f1.start, label: 'ε' });
    nfaEdges.push({ from: s, to: f2.start, label: 'ε' });
    nfaEdges.push({ from: f1.accept, to: a, label: 'ε' });
    nfaEdges.push({ from: f2.accept, to: a, label: 'ε' });
    return { start: s, accept: a };
}

function thompsonStar(f) {
    const s = newState(); const a = newState();
    nfaEdges.push({ from: s, to: f.start, label: 'ε' });
    nfaEdges.push({ from: s, to: a,        label: 'ε' });
    nfaEdges.push({ from: f.accept, to: f.start, label: 'ε' });
    nfaEdges.push({ from: f.accept, to: a,        label: 'ε' });
    return { start: s, accept: a };
}

function thompsonPlus(f) {
    // a+ = a · a*
    return thompsonConcat(f, thompsonStar({ start: f.start, accept: f.accept }));
}

function thompsonQuestion(f) {
    const s = newState(); const a = newState();
    nfaEdges.push({ from: s, to: f.start, label: 'ε' });
    nfaEdges.push({ from: s, to: a,        label: 'ε' });
    nfaEdges.push({ from: f.accept, to: a, label: 'ε' });
    return { start: s, accept: a };
}

/* ─── Build NFA from postfix ────────────────────────── */
function buildNFA(postfix) {
    const stack = [];
    for (const t of postfix) {
        if (t === '·') {
            const f2 = stack.pop(), f1 = stack.pop();
            stack.push(thompsonConcat(f1, f2));
        } else if (t === '|') {
            const f2 = stack.pop(), f1 = stack.pop();
            stack.push(thompsonUnion(f1, f2));
        } else if (t === '*') {
            stack.push(thompsonStar(stack.pop()));
        } else if (t === '+') {
            stack.push(thompsonPlus(stack.pop()));
        } else if (t === '?') {
            stack.push(thompsonQuestion(stack.pop()));
        } else {
            stack.push(thompsonSymbol(t));
        }
    }
    return stack.pop();
}

/* ─── Steps generator ────────────────────────────────── */
function generateSteps(re) {
    const steps = [];
    const chars = [...new Set([...re].filter(c => !['*','+','?','|','(',')','·'].includes(c)))];

    steps.push({
        title: 'Parse Regular Expression',
        desc:  `Input RE: <code>${escHTML(re)}</code><br>Alphabet symbols detected: <code>${chars.join(', ') || 'ε'}</code><br>
                Operators found: *, +, ?, |, ( ) grouping.<br>We will apply <strong>Thompson's Construction</strong> to build an NFA.`
    });

    const tokens  = tokenise(re);
    const withConcat = tokens.join(' ');
    steps.push({
        title: 'Insert Concatenation Operators (·)',
        desc:  `Explicit concatenation operator <code>·</code> is inserted between adjacent operands:<br>
                <code>${escHTML(withConcat)}</code>`
    });

    const postfix = toPostfix(tokens);
    steps.push({
        title: 'Convert to Postfix (Shunting-Yard)',
        desc:  `Postfix (RPN) expression:<br><code>${postfix.map(escHTML).join('  ')}</code><br>
                Operator precedence: <code>* + ? > · > |</code>`
    });

    steps.push({
        title: "Apply Thompson's Construction",
        desc:  `Each symbol gets a 2-state fragment with an edge. Operators combine fragments via ε-transitions:<br>
                <ul style="margin:8px 0 0 16px;font-size:0.82rem;color:var(--muted)">
                  <li><strong>Concatenation (·)</strong> — connect accept of f1 to start of f2 via ε</li>
                  <li><strong>Union (|)</strong> — new start/accept; ε-edges to both fragments</li>
                  <li><strong>Star (*)</strong> — new start/accept; ε-loop back + ε bypass</li>
                  <li><strong>Plus (+)</strong> — f · f*</li>
                  <li><strong>Question (?)</strong> — ε bypass added</li>
                </ul>`
    });

    steps.push({
        title: 'NFA Complete',
        desc:  `The NFA has <strong>${nfaStates.length} states</strong> and <strong>${nfaEdges.length} transitions</strong> (including ε-moves).<br>
                Start state: <code>${nfaStart}</code> &nbsp;|&nbsp; Accept state: <code>${nfaAccept}</code><br>
                The NFA accepts exactly the language described by <code>${escHTML(re)}</code>.`
    });

    return steps;
}

function escHTML(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─── Transition table renderer ──────────────────────── */
function renderTransTable() {
    if (!nfaStates.length) return '';
    const alphabet = [...new Set(nfaEdges.map(e => e.label))].sort((a,b) => a==='ε'?-1:b==='ε'?1:a.localeCompare(b));
    // Build map: state → { sym → [targets] }
    const map = {};
    nfaStates.forEach(s => { map[s.id] = {}; alphabet.forEach(a => { map[s.id][a] = []; }); });
    nfaEdges.forEach(e => { if (map[e.from]) map[e.from][e.label].push(e.to); });

    const headCols = alphabet.map(a => `<th style="text-align:center">${escHTML(a)}</th>`).join('');
    const rows = nfaStates.map(s => {
        const isStart  = s.id === nfaStart;
        const isAccept = s.id === nfaAccept;
        const marker = (isStart ? '→' : '') + (isAccept ? '★' : '');
        const cells = alphabet.map(a => `<td style="text-align:center;color:rgba(255,255,255,0.75)">${map[s.id][a].join(', ') || '—'}</td>`).join('');
        return `<tr><td class="state-col">${marker ? `<span style="color:var(--accent);margin-right:4px">${marker}</span>` : ''}${s.id}</td>${cells}</tr>`;
    }).join('');

    return `<table class="lc-trans-table" style="margin-top:0">
        <thead><tr><th>State</th>${headCols}</tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

/* ─── Draw NFA on canvas ─────────────────────────────── */
function drawNFACanvas() {
    const canvas = document.getElementById('nfaCanvas');
    const wrap   = document.getElementById('nfaGraphWrap');
    if (!canvas || !nfaStates.length) return;

    const NODE_R = 24, ARROW = 8, DPR = window.devicePixelRatio || 1;
    const count  = nfaStates.length;
    const W = Math.max(480, Math.min(700, count * 80));
    const H = count <= 4 ? 180 : count <= 8 ? 260 : 320;

    canvas.width  = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR); ctx.clearRect(0,0,W,H);

    // Circular layout
    const pos = {};
    nfaStates.forEach((s, i) => {
        const angle = (2*Math.PI*i/count) - Math.PI/2;
        const R = Math.min(W,H)/2 - 50;
        pos[s.id] = count === 1
            ? { x: W/2, y: H/2 }
            : { x: W/2 + R*Math.cos(angle), y: H/2 + R*Math.sin(angle) };
    });

    // Group edges: from→to → [labels]
    const edgeMap = {};
    nfaEdges.forEach(e => {
        const key = e.from+'→'+e.to;
        if (!edgeMap[key]) edgeMap[key] = { from: e.from, to: e.to, labels: [] };
        edgeMap[key].labels.push(e.label);
    });

    ctx.lineWidth = 1.5;
    Object.values(edgeMap).forEach(edge => {
        const p1 = pos[edge.from], p2 = pos[edge.to];
        if (!p1 || !p2) return;
        const label  = edge.labels.join(',');
        const isEps  = edge.labels.every(l => l === 'ε');
        const color  = isEps ? 'rgba(255,255,255,0.22)' : '#D2FF00';
        const hasRev = Object.values(edgeMap).some(e2 => e2.from===edge.to && e2.to===edge.from);

        ctx.strokeStyle = color; ctx.fillStyle = color;

        if (edge.from === edge.to) {
            // Self-loop
            const {x,y} = p1;
            ctx.beginPath();
            ctx.moveTo(x - NODE_R*0.7, y - NODE_R*0.7);
            ctx.bezierCurveTo(x-44, y-60, x+44, y-60, x + NODE_R*0.7, y - NODE_R*0.7);
            ctx.stroke();
            ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='bold 11px JetBrains Mono,monospace';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(label, x, y-58);
            ctx.fillStyle=color;
        } else {
            const off = hasRev ? 26 : 0;
            const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
            const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.sqrt(dx*dx+dy*dy)||1;
            const cpx=mx-(dy/len)*off, cpy=my+(dx/len)*off;
            const a1=Math.atan2(cpy-p1.y,cpx-p1.x);
            const sx=p1.x+NODE_R*Math.cos(a1), sy=p1.y+NODE_R*Math.sin(a1);
            const a2=Math.atan2(cpy-p2.y,cpx-p2.x);
            const ex=p2.x+NODE_R*Math.cos(a2), ey=p2.y+NODE_R*Math.sin(a2);
            ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cpx,cpy,ex,ey); ctx.stroke();
            // arrowhead
            const aa=Math.atan2(ey-cpy,ex-cpx);
            ctx.beginPath(); ctx.moveTo(ex,ey);
            ctx.lineTo(ex-ARROW*Math.cos(aa-0.4),ey-ARROW*Math.sin(aa-0.4));
            ctx.lineTo(ex-ARROW*Math.cos(aa+0.4),ey-ARROW*Math.sin(aa+0.4));
            ctx.closePath(); ctx.fill();
            // label
            const lx=(sx+2*cpx+ex)/4, ly=(sy+2*cpy+ey)/4;
            ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='bold 11px JetBrains Mono,monospace';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(label,lx,ly-10);
            ctx.fillStyle=color;
        }
    });

    // Draw nodes
    nfaStates.forEach(s => {
        const {x,y}=pos[s.id];
        const isStart = s.id === nfaStart, isAccept = s.id === nfaAccept;
        ctx.beginPath(); ctx.arc(x,y,NODE_R,0,Math.PI*2);
        ctx.fillStyle = isAccept ? 'rgba(34,197,94,0.18)' : isStart ? 'rgba(210,255,0,0.15)' : 'rgba(255,255,255,0.04)';
        ctx.fill();
        ctx.strokeStyle = isAccept ? '#22c55e' : isStart ? '#D2FF00' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2; ctx.stroke();
        if (isAccept) { ctx.beginPath(); ctx.arc(x,y,NODE_R-4,0,Math.PI*2); ctx.strokeStyle='rgba(34,197,94,0.4)'; ctx.lineWidth=1; ctx.stroke(); }
        ctx.fillStyle = isAccept ? '#22c55e' : isStart ? '#D2FF00' : 'rgba(255,255,255,0.8)';
        ctx.font='600 12px JetBrains Mono,monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(s.id,x,y);
    });

    // Start arrow
    if (nfaStart && pos[nfaStart]) {
        const {x,y}=pos[nfaStart];
        ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(x-NODE_R-34,y); ctx.lineTo(x-NODE_R-2,y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.beginPath();
        ctx.moveTo(x-NODE_R-2,y); ctx.lineTo(x-NODE_R-10,y-5); ctx.lineTo(x-NODE_R-10,y+5); ctx.closePath(); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='11px Inter,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('start',x-NODE_R-46,y);
    }

    if (wrap) wrap.classList.add('visible');
}

/* ─── Main convert function ──────────────────────────── */
let currentSteps = [], currentStepIdx = 0;

function convertRE() {
    const re = document.getElementById('reInput')?.value.trim();
    if (!re) { alert('Please enter a regular expression.'); return; }

    // Reset
    nfaStates = []; nfaEdges = []; stateCounter = 0;

    try {
        const tokens  = tokenise(re);
        const postfix = toPostfix(tokens);
        const frag    = buildNFA(postfix);
        nfaStart  = frag.start;
        nfaAccept = frag.accept;
    } catch(e) {
        setResult('reResult', '⚠ Error: ' + e.message, 'rejected');
        const c = document.getElementById('reResultContainer'); if(c) c.classList.add('open');
        return;
    }

    currentSteps    = generateSteps(re);
    currentStepIdx  = 0;

    // Show step navigator
    const nav = document.getElementById('stepNav');
    if (nav) { nav.style.display = 'flex'; updateStepDisplay(); }

    // Show table
    const tbl = document.getElementById('nfaTableWrap');
    if (tbl) { tbl.innerHTML = '<div class="lc-ex-label" style="margin-bottom:8px">δ — Transition Table (ε-NFA)</div>' + renderTransTable(); tbl.style.display='block'; }

    // Draw graph
    drawNFACanvas();

    // Show container
    const c = document.getElementById('reResultContainer');
    if (c) c.classList.add('open');
    setResult('reResult', `✓ NFA built — ${nfaStates.length} states, ${nfaEdges.length} transitions`, 'accepted');

    const ph = document.getElementById('graphPlaceholder'); if(ph) ph.style.display='none';
}

function updateStepDisplay() {
    const step = currentSteps[currentStepIdx];
    const box  = document.getElementById('stepBox');
    if (!box || !step) return;
    box.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="background:var(--accent);color:#000;font-weight:800;font-size:0.75rem;
                  padding:3px 10px;border-radius:99px">STEP ${currentStepIdx+1}/${currentSteps.length}</span>
            <span style="font-weight:700;color:var(--text);font-size:0.9rem">${step.title}</span>
        </div>
        <div style="font-size:0.83rem;color:var(--muted);line-height:1.7">${step.desc}</div>`;
    document.getElementById('prevStep').disabled = currentStepIdx === 0;
    document.getElementById('nextStep').disabled = currentStepIdx === currentSteps.length - 1;
}

function prevStep() { if (currentStepIdx > 0) { currentStepIdx--; updateStepDisplay(); } }
function nextStep() { if (currentStepIdx < currentSteps.length-1) { currentStepIdx++; updateStepDisplay(); } }

document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('reInput');
    if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') convertRE(); });
});
