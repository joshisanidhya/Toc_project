/* DFA Simulator JS */

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
    let trace = [];
    trace.push({ state: start, char: null });
    
    let isRejectedEarly = false;
    let rejectReason = "";

    for (let ch of input) {
        let key = state + "," + ch;
        if (!map[key]) {
            isRejectedEarly = true;
            rejectReason = "✗ Rejected — No transition for (" + state + ", " + ch + ")";
            break;
        }
        state = map[key];
        trace.push({ state: state, char: ch });
    }

    let isAccepted = !isRejectedEarly && accept.includes(state);
    
    let resultMsg = "";
    let resType = "";
    
    if (isRejectedEarly) {
        resultMsg = rejectReason;
        resType = "rejected";
    } else if (isAccepted) {
        resultMsg = "✓ Accepted — Ended in state " + state;
        resType = "accepted";
    } else {
        resultMsg = "✗ Rejected — Ended in non-accepting state " + state;
        resType = "rejected";
    }

    setResult("dfaResult", resultMsg, resType);
    
    // Open the container smoothly
    let container = document.getElementById("dfaResultContainer");
    if(container) container.classList.add("open");
    
    // Render the execution trace visuals
    renderTrace(trace, isAccepted, isRejectedEarly);
}

function renderTrace(trace, isAccepted, isRejectedEarly) {
    let traceContainer = document.getElementById("dfaTraceContainer");
    if (!traceContainer) return;
    
    traceContainer.innerHTML = '<div class="trace-label">Execution Trace:</div>';
    
    trace.forEach((step, index) => {
        // Adjust delay to create staggered animation
        let delay = index * 0.15;
        
        // Add step arrow
        if (step.char !== null) {
            let arrow = document.createElement("div");
            arrow.className = "trace-arrow";
            arrow.style.animationDelay = `${delay - 0.05}s`;
            arrow.innerHTML = `→<sup class="trace-consumed">${step.char}</sup>`;
            traceContainer.appendChild(arrow);
        }
        
        // Add state chip
        let chip = document.createElement("div");
        chip.className = "trace-chip";
        chip.style.animationDelay = `${delay}s`;
        chip.innerText = step.state;
        
        // Style specific states
        if (index === 0) {
            chip.classList.add("start");
        }
        
        // Ensure final state gets styled correctly even if start state is final
        if (index === trace.length - 1) {
            // Remove start class if it's the only state to prioritize outcome colors
            if (trace.length === 1) {
                chip.classList.remove("start");
            }
            if (isAccepted) {
                chip.classList.add("accept");
            } else {
                chip.classList.add("reject");
            }
        }
        
        traceContainer.appendChild(chip);
    });
}

// Navbar scroll transition
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
