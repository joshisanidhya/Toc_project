/* ===== DFA GRAPH VISUALIZER ===== */
/* Draws the DFA as a directed graph on a canvas after runDFA() is called */

(function () {
    // ─── Layout constants ───────────────────────────────────────────────────────
    const NODE_R   = 26;          // state circle radius
    const ACCEPT_R = 22;          // inner circle radius for accept states
    const SELF_LOOP_OFFSET = 52;  // height of self-loop arc
    const ARROW_SIZE = 9;         // arrowhead size
    const H_PAD = 60;             // horizontal canvas padding
    const V_PAD = 70;             // vertical canvas padding

    // ─── Colour tokens (match CSS vars) ────────────────────────────────────────
    const COL_BG      = 'rgba(0,0,0,0)';
    const COL_BORDER  = 'rgba(255,255,255,0.12)';
    const COL_LABEL   = 'rgba(255,255,255,0.85)';
    const COL_MUTED   = 'rgba(255,255,255,0.38)';
    const COL_ACCENT  = '#D2FF00';      /* lime yellow */
    const COL_START   = '#D2FF00';
    const COL_ACCEPT  = '#22c55e';
    const COL_EDGE    = 'rgba(255,255,255,0.28)';
    const COL_ELABEL  = 'rgba(255,255,255,0.65)';

    // ─── Parse transition table ─────────────────────────────────────────────────
    function parseTransitions(text) {
        const map = {};   // { "q0,a": "q1" }
        text.split('\n').forEach(line => {
            const [l, r] = line.split('=');
            if (l && r) map[l.trim()] = r.trim();
        });
        return map;
    }

    function collectStates(map) {
        const set = new Set();
        for (const [key, val] of Object.entries(map)) {
            const [state] = key.split(',');
            set.add(state.trim());
            set.add(val.trim());
        }
        return [...set];
    }

    // ─── Position nodes in a circular layout ───────────────────────────────────
    function layoutStates(states, W, H) {
        const count = states.length;
        const cx = W / 2, cy = H / 2;
        // Put states in one or two rings
        const maxInner = Math.min(count, 6);
        const R = Math.min(W, H) / 2 - H_PAD;
        const pos = {};
        states.forEach((s, i) => {
            if (count === 1) {
                pos[s] = { x: cx, y: cy };
            } else {
                const angle = (2 * Math.PI * i / count) - Math.PI / 2;
                pos[s] = {
                    x: cx + R * Math.cos(angle),
                    y: cy + R * Math.sin(angle)
                };
            }
        });
        return pos;
    }

    // ─── Group multi-char labels on same edge ────────────────────────────────
    function buildEdges(map) {
        const edges = {};   // "q0->q1" => { from, to, labels[] }
        for (const [key, to] of Object.entries(map)) {
            const [from, ch] = key.split(',');
            const id = `${from.trim()}->${to.trim()}`;
            if (!edges[id]) edges[id] = { from: from.trim(), to: to.trim(), labels: [] };
            edges[id].labels.push(ch.trim());
        }
        return Object.values(edges);
    }

    // ─── Canvas drawing helpers ─────────────────────────────────────────────────
    function drawArrow(ctx, x1, y1, x2, y2, color) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.strokeStyle = color;
        ctx.fillStyle   = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ARROW_SIZE * Math.cos(angle - 0.4), y2 - ARROW_SIZE * Math.sin(angle - 0.4));
        ctx.lineTo(x2 - ARROW_SIZE * Math.cos(angle + 0.4), y2 - ARROW_SIZE * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();
    }

    function drawCurvedEdge(ctx, fromPos, toPos, label, offset, color) {
        const { x: x1, y: y1 } = fromPos;
        const { x: x2, y: y2 } = toPos;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        // Control point perpendicular offset
        const cpx = mx - (dy / len) * offset;
        const cpy = my + (dx / len) * offset;

        // Edge from state border to state border
        const angle1 = Math.atan2(cpy - y1, cpx - x1);
        const sx = x1 + NODE_R * Math.cos(angle1);
        const sy = y1 + NODE_R * Math.sin(angle1);
        const angle2 = Math.atan2(cpy - y2, cpx - x2);
        const ex = x2 + NODE_R * Math.cos(angle2);
        const ey = y2 + NODE_R * Math.sin(angle2);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);
        ctx.stroke();

        // Arrowhead at end
        const arr_angle = Math.atan2(ey - cpy, ex - cpx);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - ARROW_SIZE * Math.cos(arr_angle - 0.4), ey - ARROW_SIZE * Math.sin(arr_angle - 0.4));
        ctx.lineTo(ex - ARROW_SIZE * Math.cos(arr_angle + 0.4), ey - ARROW_SIZE * Math.sin(arr_angle + 0.4));
        ctx.closePath();
        ctx.fill();

        // Label at midpoint of curve
        const lx = (sx + 2 * cpx + ex) / 4;   // quadratic midpoint approx
        const ly = (sy + 2 * cpy + ey) / 4;
        ctx.fillStyle = COL_ELABEL;
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, lx, ly - 10);
    }

    function drawSelfLoop(ctx, pos, label, color) {
        const { x, y } = pos;
        const cp1x = x - 40, cp1y = y - SELF_LOOP_OFFSET - 20;
        const cp2x = x + 40, cp2y = y - SELF_LOOP_OFFSET - 20;
        const startX = x - NODE_R * 0.7, startY = y - NODE_R * 0.7;
        const endX   = x + NODE_R * 0.7, endY   = y - NODE_R * 0.7;

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();

        // Arrow at end
        const arr_angle = Math.atan2(endY - cp2y, endX - cp2x);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - ARROW_SIZE * Math.cos(arr_angle - 0.4), endY - ARROW_SIZE * Math.sin(arr_angle - 0.4));
        ctx.lineTo(endX - ARROW_SIZE * Math.cos(arr_angle + 0.4), endY - ARROW_SIZE * Math.sin(arr_angle + 0.4));
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.fillStyle = COL_ELABEL;
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y - SELF_LOOP_OFFSET - 30);
    }

    function drawNode(ctx, pos, name, isStart, isAccept, isActive) {
        const { x, y } = pos;

        // Glow for start/accept
        if (isStart || isAccept) {
            ctx.save();
            ctx.shadowColor = isAccept ? COL_ACCEPT : '#D2FF00';
            ctx.shadowBlur  = 18;
        }

        // Fill
        ctx.beginPath();
        ctx.arc(x, y, NODE_R, 0, Math.PI * 2);
        if (isAccept) {
            ctx.fillStyle = 'rgba(34,197,94,0.18)';
        } else if (isStart) {
            ctx.fillStyle = 'rgba(210,255,0,0.15)';
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.04)';
        }
        ctx.fill();

        // Border
        ctx.strokeStyle = isAccept ? COL_ACCEPT : isStart ? '#D2FF00' : COL_BORDER;
        ctx.lineWidth = isStart || isAccept ? 2 : 1.5;
        ctx.stroke();

        if (isStart || isAccept) ctx.restore();

        // Double ring for accept states
        if (isAccept) {
            ctx.beginPath();
            ctx.arc(x, y, ACCEPT_R, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(34,197,94,0.45)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Label — yellow for start, green for accept, white otherwise
        ctx.fillStyle = isAccept ? COL_ACCEPT : isStart ? '#D2FF00' : COL_LABEL;
        ctx.font = `600 13px JetBrains Mono, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, x, y);
    }

    function drawStartArrow(ctx, pos, startState) {
        // Small arrow pointing at the start state from the left
        const { x, y } = pos;
        const ax = x - NODE_R - 36;
        const ay = y;
        ctx.strokeStyle = COL_MUTED;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(x - NODE_R - 2, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = COL_MUTED;
        ctx.beginPath();
        ctx.moveTo(x - NODE_R - 2, y);
        ctx.lineTo(x - NODE_R - 10, y - 5);
        ctx.lineTo(x - NODE_R - 10, y + 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = COL_MUTED;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('start', ax - 14, ay);
    }

    // ─── Main draw function ─────────────────────────────────────────────────────
    function drawDFA(transText, startState, acceptStates) {
        const canvas = document.getElementById('dfaCanvas');
        const wrap   = document.getElementById('dfaGraphWrap');
        if (!canvas || !wrap) return;

        const map    = parseTransitions(transText);
        const states = collectStates(map);
        if (states.length === 0) return;

        // Canvas sizing
        const cols    = Math.max(states.length, 1);
        const W_base  = Math.max(420, Math.min(600, cols * 110));
        const H_base  = states.length <= 3 ? 220 : states.length <= 6 ? 280 : 340;
        const DPR     = window.devicePixelRatio || 1;

        canvas.width  = W_base * DPR;
        canvas.height = H_base * DPR;
        canvas.style.width  = W_base + 'px';
        canvas.style.height = H_base + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(DPR, DPR);
        ctx.clearRect(0, 0, W_base, H_base);

        const pos   = layoutStates(states, W_base, H_base);
        const edges = buildEdges(map);
        const accept = acceptStates.map(s => s.trim()).filter(Boolean);

        // Draw edges first (under nodes)
        ctx.lineWidth = 1.6;
        edges.forEach(edge => {
            const label = edge.labels.join(',');
            const color = COL_EDGE;
            if (edge.from === edge.to) {
                drawSelfLoop(ctx, pos[edge.from], label, color);
            } else {
                // Check if reverse edge exists → curve both
                const hasReverse = edges.some(e => e.from === edge.to && e.to === edge.from);
                const offset = hasReverse ? 28 : 0;
                drawCurvedEdge(ctx, pos[edge.from], pos[edge.to], label, offset, color);
            }
        });

        // Draw nodes
        states.forEach(s => {
            const isStart  = s === startState.trim();
            const isAccept = accept.includes(s);
            drawNode(ctx, pos[s], s, isStart, isAccept, false);
        });

        // Start arrow
        if (startState.trim() && pos[startState.trim()]) {
            drawStartArrow(ctx, pos[startState.trim()], startState.trim());
        }

        // Show graph wrap
        wrap.classList.add('visible');
    }

    // ─── Hook into runDFA() ─────────────────────────────────────────────────────
    // Override to call drawDFA after result is set
    const _original_runDFA = window.runDFA;
    window._drawDFAGraph = function () {
        const transText   = document.getElementById('dfaTransitions')?.value  || '';
        const startState  = document.getElementById('dfaStart')?.value.trim() || '';
        const acceptRaw   = document.getElementById('dfaAccept')?.value       || '';
        const accept      = acceptRaw.split(',').map(s => s.trim()).filter(Boolean);

        const placeholder = document.getElementById('graphPlaceholder');
        if (placeholder) placeholder.style.display = 'none';

        drawDFA(transText, startState, accept);
    };

    // Patch: after DFA runs, also draw graph
    const origBtn = document.getElementById('runBtn');
    if (origBtn) {
        origBtn.addEventListener('click', () => {
            // Small delay so runDFA() sets results first
            setTimeout(window._drawDFAGraph, 120);
        });
    }
})();
