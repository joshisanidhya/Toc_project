/* ===== NFA → DFA Converter JS (Subset Construction) ===== */

/*
  Algorithm: Subset Construction (Powerset Construction)
  Input:  NFA states, alphabet, transitions (including ε), start, accept states
  Output: Equivalent DFA states and transitions
*/

function parseNFAInput() {
    const statesRaw  = document.getElementById('nStates')?.value.trim();
    const alphaRaw   = document.getElementById('nAlpha')?.value.trim();
    const transRaw   = document.getElementById('nTrans')?.value.trim();
    const startRaw   = document.getElementById('nStart')?.value.trim();
    const acceptRaw  = document.getElementById('nAccept')?.value.trim();

    if (!statesRaw || !alphaRaw || !transRaw || !startRaw || !acceptRaw)
        throw new Error('All fields are required.');

    const states    = statesRaw.split(',').map(s=>s.trim()).filter(Boolean);
    const alphabet  = alphaRaw.split(',').map(s=>s.trim()).filter(Boolean);
    const accepts   = acceptRaw.split(',').map(s=>s.trim()).filter(Boolean);

    // Parse transitions: one per line  state,symbol=next1,next2,...
    const delta = {};   // delta[state][symbol] = Set of states
    states.forEach(s => { delta[s] = {}; alphabet.forEach(a => { delta[s][a] = new Set(); }); });

    transRaw.split('\n').forEach(line => {
        line = line.trim(); if (!line) return;
        const [left, right] = line.split('=');
        if (!left || !right) return;
        const [from, sym] = left.split(',').map(s=>s.trim());
        const targets = right.split(',').map(s=>s.trim()).filter(Boolean);
        if (!delta[from]) delta[from] = {};
        if (!delta[from][sym]) delta[from][sym] = new Set();
        targets.forEach(t => delta[from][sym].add(t));
    });

    return { states, alphabet, delta, start: startRaw.trim(), accepts };
}

/* ─── ε-closure ─────────────────────────────────────── */
function epsilonClosure(states, delta) {
    const stack = [...states], closure = new Set(states);
    while (stack.length) {
        const s = stack.pop();
        const eps = delta[s]?.['ε'] || new Set();
        eps.forEach(t => { if (!closure.has(t)) { closure.add(t); stack.push(t); } });
    }
    return closure;
}

/* ─── Move: set of reachable states on symbol ───────── */
function move(states, sym, delta) {
    const result = new Set();
    states.forEach(s => { (delta[s]?.[sym] || new Set()).forEach(t => result.add(t)); });
    return result;
}

/* ─── Subset Construction ────────────────────────────── */
function subsetConstruction(nfa) {
    const { alphabet, delta, start, accepts } = nfa;
    const pureAlpha = alphabet.filter(a => a !== 'ε');

    const startSet   = epsilonClosure(new Set([start]), delta);
    const startLabel = setLabel(startSet);

    const dfaStates  = {};        // label → Set
    const dfaDelta   = {};        // label → { sym → label }
    const dfaAccepts = new Set();
    const queue      = [startSet];
    dfaStates[startLabel] = startSet;
    dfaDelta[startLabel]  = {};

    const steps = [];

    while (queue.length) {
        const curr  = queue.shift();
        const cLabel = setLabel(curr);

        if ([...curr].some(s => accepts.includes(s))) dfaAccepts.add(cLabel);

        steps.push({ set: cLabel, transitions: {} });
        const last = steps[steps.length-1];

        pureAlpha.forEach(sym => {
            const moved   = move(curr, sym, delta);
            const closure = epsilonClosure(moved, delta);
            const nLabel  = setLabel(closure);

            last.transitions[sym] = nLabel || '∅';

            if (nLabel && !dfaStates[nLabel]) {
                dfaStates[nLabel] = closure;
                dfaDelta[nLabel]  = {};
                queue.push(closure);
            }
            if (nLabel) dfaDelta[cLabel][sym] = nLabel;
        });
    }

    return { dfaStates, dfaDelta, dfaAccepts, startLabel, pureAlpha, steps };
}

function setLabel(set) {
    const arr = [...set].sort();
    return arr.length ? '{' + arr.join(',') + '}' : '∅';
}

/* ─── Render DFA table ────────────────────────────────── */
function renderDFATable(result) {
    const { dfaStates, dfaDelta, dfaAccepts, startLabel, pureAlpha } = result;
    const labels = Object.keys(dfaStates);

    const headCols = pureAlpha.map(a => `<th style="text-align:center">${a}</th>`).join('');
    const rows = labels.map(lbl => {
        const isStart  = lbl === startLabel;
        const isAccept = dfaAccepts.has(lbl);
        const marker   = (isStart ? '→' : '') + (isAccept ? '★' : '');
        const cells    = pureAlpha.map(a => {
            const t = dfaDelta[lbl]?.[a] || '∅';
            return `<td style="text-align:center;color:rgba(255,255,255,0.75)">${t}</td>`;
        }).join('');
        const nameColor = isAccept ? '#22c55e' : isStart ? 'var(--accent)' : 'rgba(255,255,255,0.8)';
        return `<tr>
            <td><span style="color:var(--accent);margin-right:4px">${marker}</span>
                <span style="color:${nameColor};font-family:var(--font-mono)">${lbl}</span></td>
            ${cells}</tr>`;
    }).join('');

    return `<table class="lc-trans-table">
        <thead><tr><th>DFA State (NFA subset)</th>${headCols}</tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

/* ─── Render subset steps ────────────────────────────── */
function renderStepsTable(result) {
    const { steps, pureAlpha } = result;
    const headCols = pureAlpha.map(a => `<th style="text-align:center">δ'(·, ${a})</th>`).join('');
    const rows = steps.map((s, i) => {
        const cells = pureAlpha.map(a => `<td style="text-align:center;color:rgba(255,255,255,0.75)">${s.transitions[a] || '∅'}</td>`).join('');
        return `<tr><td style="color:var(--accent);font-family:var(--font-mono)">${s.set}</td>${cells}</tr>`;
    }).join('');
    return `<div class="lc-ex-label" style="margin-bottom:8px">Subset Construction Steps</div>
    <table class="lc-trans-table">
        <thead><tr><th>NFA Subset</th>${headCols}</tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

/* ─── Draw DFA on canvas ─────────────────────────────── */
function drawDFAGraph(result) {
    const canvas = document.getElementById('ndCanvas');
    const wrap   = document.getElementById('ndGraphWrap');
    if (!canvas) return;

    const { dfaStates, dfaDelta, dfaAccepts, startLabel, pureAlpha } = result;
    const labels = Object.keys(dfaStates);
    const count  = labels.length;

    const NODE_R = 28, ARROW = 9, DPR = window.devicePixelRatio||1;
    const W = Math.max(500, Math.min(720, count*100));
    const H = count<=3?200:count<=6?280:340;
    canvas.width=W*DPR; canvas.height=H*DPR;
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR,DPR); ctx.clearRect(0,0,W,H);

    const pos={};
    labels.forEach((l,i)=>{
        const angle=(2*Math.PI*i/count)-Math.PI/2;
        const R=Math.min(W,H)/2-55;
        pos[l]=count===1?{x:W/2,y:H/2}:{x:W/2+R*Math.cos(angle),y:H/2+R*Math.sin(angle)};
    });

    // Group edges
    const edgeMap={};
    labels.forEach(from => {
        pureAlpha.forEach(sym => {
            const to = dfaDelta[from]?.[sym]; if(!to||!pos[to]) return;
            const key=from+'→'+to;
            if(!edgeMap[key]) edgeMap[key]={from,to,labels:[]};
            edgeMap[key].labels.push(sym);
        });
    });

    ctx.lineWidth=1.6;
    Object.values(edgeMap).forEach(edge=>{
        const p1=pos[edge.from], p2=pos[edge.to]; if(!p1||!p2) return;
        const label=edge.labels.join(',');
        const hasRev=!!edgeMap[edge.to+'→'+edge.from];
        const off=edge.from===edge.to?0:hasRev?28:0;
        ctx.strokeStyle='rgba(255,255,255,0.28)'; ctx.fillStyle='rgba(255,255,255,0.28)';

        if(edge.from===edge.to){
            const{x,y}=p1;
            ctx.beginPath(); ctx.moveTo(x-NODE_R*0.7,y-NODE_R*0.7);
            ctx.bezierCurveTo(x-46,y-64,x+46,y-64,x+NODE_R*0.7,y-NODE_R*0.7); ctx.stroke();
            ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='bold 11px JetBrains Mono,monospace';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(label,x,y-62);
        } else {
            const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2,dx=p2.x-p1.x,dy=p2.y-p1.y,len=Math.sqrt(dx*dx+dy*dy)||1;
            const cpx=mx-(dy/len)*off,cpy=my+(dx/len)*off;
            const a1=Math.atan2(cpy-p1.y,cpx-p1.x); const sx=p1.x+NODE_R*Math.cos(a1),sy=p1.y+NODE_R*Math.sin(a1);
            const a2=Math.atan2(cpy-p2.y,cpx-p2.x); const ex=p2.x+NODE_R*Math.cos(a2),ey=p2.y+NODE_R*Math.sin(a2);
            ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cpx,cpy,ex,ey); ctx.stroke();
            const aa=Math.atan2(ey-cpy,ex-cpx);
            ctx.beginPath(); ctx.moveTo(ex,ey);
            ctx.lineTo(ex-ARROW*Math.cos(aa-0.4),ey-ARROW*Math.sin(aa-0.4));
            ctx.lineTo(ex-ARROW*Math.cos(aa+0.4),ey-ARROW*Math.sin(aa+0.4));
            ctx.closePath(); ctx.fill();
            const lx=(sx+2*cpx+ex)/4,ly=(sy+2*cpy+ey)/4;
            ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='bold 11px JetBrains Mono,monospace';
            ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(label,lx,ly-10);
        }
        ctx.fillStyle='rgba(255,255,255,0.28)';
    });

    labels.forEach(lbl=>{
        const{x,y}=pos[lbl]; if(!pos[lbl]) return;
        const isStart=lbl===startLabel, isAccept=dfaAccepts.has(lbl);
        ctx.beginPath(); ctx.arc(x,y,NODE_R,0,Math.PI*2);
        ctx.fillStyle=isAccept?'rgba(34,197,94,0.18)':isStart?'rgba(210,255,0,0.15)':'rgba(255,255,255,0.04)';
        ctx.fill();
        ctx.strokeStyle=isAccept?'#22c55e':isStart?'#D2FF00':'rgba(255,255,255,0.15)';
        ctx.lineWidth=2; ctx.stroke();
        if(isAccept){ctx.beginPath();ctx.arc(x,y,NODE_R-5,0,Math.PI*2);ctx.strokeStyle='rgba(34,197,94,0.4)';ctx.lineWidth=1;ctx.stroke();}
        // Short label to fit
        const short = lbl.length>8 ? lbl.slice(0,7)+'…' : lbl;
        ctx.fillStyle=isAccept?'#22c55e':isStart?'#D2FF00':'rgba(255,255,255,0.8)';
        ctx.font='600 10px JetBrains Mono,monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(short,x,y);
    });

    // Start arrow
    if(startLabel && pos[startLabel]){
        const{x,y}=pos[startLabel];
        ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
        ctx.beginPath();ctx.moveTo(x-NODE_R-34,y);ctx.lineTo(x-NODE_R-2,y);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.beginPath();
        ctx.moveTo(x-NODE_R-2,y);ctx.lineTo(x-NODE_R-10,y-5);ctx.lineTo(x-NODE_R-10,y+5);ctx.closePath();ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='11px Inter,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('start',x-NODE_R-46,y);
    }

    if(wrap) wrap.classList.add('visible');
}

/* ─── Main convert function ──────────────────────────── */
function convertNFA() {
    try {
        const nfa    = parseNFAInput();
        const result = subsetConstruction(nfa);

        // Steps table
        const stepsWrap = document.getElementById('subsetStepsWrap');
        if (stepsWrap) { stepsWrap.innerHTML = renderStepsTable(result); stepsWrap.style.display='block'; }

        // DFA table
        const dfaWrap = document.getElementById('dfaTableWrap');
        if (dfaWrap) {
            dfaWrap.innerHTML = '<div class="lc-ex-label" style="margin-bottom:8px">Equivalent DFA Transition Table</div>' + renderDFATable(result);
            dfaWrap.style.display='block';
        }

        // Result summary
        const dfaCount = Object.keys(result.dfaStates).length;
        setResult('ndResult', `✓ Done — DFA has ${dfaCount} state${dfaCount>1?'s':''}, start: ${result.startLabel}`, 'accepted');
        const c = document.getElementById('ndResultContainer'); if(c) c.classList.add('open');

        // Draw DFA graph
        drawDFAGraph(result);

        const ph = document.getElementById('graphPlaceholder'); if(ph) ph.style.display='none';

    } catch(e) {
        setResult('ndResult', '⚠ Error: ' + e.message, 'rejected');
        const c = document.getElementById('ndResultContainer'); if(c) c.classList.add('open');
    }
}

/* ─── Load example ───────────────────────────────────── */
function loadNFAExample() {
    // NFA for (a|b)*abb
    document.getElementById('nStates').value  = 'q0, q1, q2, q3';
    document.getElementById('nAlpha').value   = 'a, b';
    document.getElementById('nTrans').value   = 'q0,a=q0,q1\nq0,b=q0\nq1,b=q2\nq2,b=q3';
    document.getElementById('nStart').value   = 'q0';
    document.getElementById('nAccept').value  = 'q3';
}

document.addEventListener('DOMContentLoaded', () => {
    const fields = ['nStates','nAlpha','nStart','nAccept'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => { if(e.key==='Enter') convertNFA(); });
    });
});
