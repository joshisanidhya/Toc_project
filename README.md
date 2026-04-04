
<div align="center">

<img src="images/toc_logo.png" alt="Automata Studio Logo" width="80"/>

# Automata Studio

### An interactive Theory of Computation simulator built for students of IIIT Sri City

[![Live Demo](https://img.shields.io/badge/Live%20Demo-automata--studio--toc.vercel.app-D2FF00?style=for-the-badge&logo=vercel&logoColor=black)](https://automata-studio-toc.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 📖 About

**Automata Studio** is a hands-on, browser-based simulator for all six units of the Theory of Computation course at **IIIT Sri City**. Instead of just reading textbook definitions, you can actually *run* your automata, *test* your grammars, and *see* computation happen in real time.

The interface is built with a dark-mode, glassmorphic aesthetic featuring dynamic background animations, a collapsible sidebar, and per-module tab navigation — all without any frontend framework.

> Designed and developed by **[Sanidhya Joshi](https://www.linkedin.com/in/joshisanidhya/)** · IIIT Sri City, 2026

---

## 🚀 Live Demo

> **[https://automata-studio-toc.vercel.app](https://automata-studio-toc.vercel.app)**

---

## 🎓 Modules

The simulator covers all **6 units** of the TOC course:

### Module 1 — Foundations of Automata

| Tool | Description |
|------|-------------|
| **DFA Simulator** | Define a DFA using its 5-tuple (Q, Σ, δ, q₀, F). Run any input string and trace each state transition step-by-step with a live state graph. |
| **Language Checker** | Select from pre-built regular languages and check membership with instant trace and DFA diagram. |
| **NFA → DFA Converter** | Input an NFA (with optional ε-transitions) and convert it to an equivalent DFA using the **Subset Construction** algorithm, with a full transition table and state diagram. |

### Module 2 — Regular Languages & Expressions

| Tool | Description |
|------|-------------|
| **Regex Checker** | Test whether a string `w` belongs to `L(R)` defined by a regular expression. Supports `*`, `+`, `?`, `\|`, `()`, `[]`. |
| **RE → NFA Converter** | Convert any regular expression to an ε-NFA step-by-step using **Thompson's Construction**. Navigate through each operator's NFA fragment with Previous/Next controls. |

### Module 3 — Context-Free Grammars

| Tool | Description |
|------|-------------|
| **CFG Derivation** | Define a CFG using its 4-tuple (V, Σ, R, S) and check if a string can be derived. Returns `w ∈ L(G)` or `w ∉ L(G)`. |
| **Parse Tree** | Visualize the parse tree for a derived string. |
| **CFG → CNF Converter** | Convert any CFG to **Chomsky Normal Form** through the 5 Sipser steps: START → DEL → UNIT → TERM → BIN, shown with the full rule set at each step. |
| **CFG ↔ PDA** | Explore the equivalence between context-free grammars and pushdown automata. |

### Module 4 — Pushdown Automata

| Tool | Description |
|------|-------------|
| **PDA Simulator** | Simulate a stack-based PDA. The built-in balanced-parentheses PDA shows the full 6-tuple (Q, Σ, Γ, δ, q₀, F), transition function, and step-by-step stack trace. |

### Module 5 — Turing Machines

| Tool | Description |
|------|-------------|
| **TM Simulator** | Simulate a binary-flip Turing Machine defined by its 7-tuple (Q, Σ, Γ, δ, q₀, q_acc, q_rej). Enter a binary tape and trace each read/write/move step to acceptance. |
| **Tape Animation** | Animated visualization of the TM head moving across the infinite tape. |

### Module 6 — Decidability & Complexity

| Tool | Description |
|------|-------------|
| **Halting Problem** | Walkthrough of Turing's diagonalization proof — step-by-step animation of the HALT_TM contradiction. |
| **Complexity Visualizer** | Interactive chart comparing O(1), O(log n), O(n), O(n²), O(2ⁿ), O(n!) growth. Toggle classes and adjust `n` with a slider. |
| **P vs NP** | Interactive flip-cards explaining P, NP, NP-Complete, and the big question. |
| **Theory Recap** | Comprehensive theory reference covering all 6 modules — formal definitions, theorems, proofs, and examples. |

---

## 🗂️ Project Structure

```
Toc_project/
│
├── index.html                          # Landing page
│
├── html/
│   ├── module1_dfa/
│   │   ├── dfa.html                    # DFA Simulator
│   │   ├── nfa_to_dfa.html             # NFA → DFA Converter
│   │   └── language_checker.html       # Language Checker
│   ├── module2_regex/
│   │   ├── regex.html                  # Regex Checker
│   │   └── re_to_nfa.html              # RE → NFA Converter
│   ├── module3_cfg/
│   │   ├── cfg.html                    # CFG Derivation
│   │   ├── cfg_to_cnf.html             # CFG → CNF Converter
│   │   ├── parse_tree.html             # Parse Tree Visualizer
│   │   └── cfg_pda.html                # CFG ↔ PDA Equivalence
│   ├── module4_pda/
│   │   └── pda.html                    # PDA Simulator
│   ├── module5_tm/
│   │   ├── tm.html                     # Turing Machine Simulator
│   │   └── tm_tape.html                # Tape Animation
│   └── module6_decidability/
│       ├── decidability.html           # Halting Problem Demo
│       ├── complexity.html             # Complexity Visualizer
│       ├── pvsnp.html                  # P vs NP Explorer
│       └── recap.html                  # Theory Recap (all modules)
│
├── css/
│   ├── module1_dfa/dfa.css             # ★ Shared simulator stylesheet
│   ├── module2_regex/regex.css
│   ├── module3_cfg/cfg.css
│   ├── module4_pda/pda.css
│   ├── module5_tm/tm.css
│   ├── module6_decidability/
│   ├── landing.css                     # Landing page styles
│   ├── common.css                      # Shared base styles
│   └── styles.css
│
├── js/
│   ├── module1_dfa/
│   │   ├── dfa.js                      # DFA simulation logic
│   │   ├── dfa_graph.js                # Canvas state-graph renderer
│   │   ├── nfa_to_dfa.js               # Subset construction algorithm
│   │   └── language_checker.js         # Pre-built DFA patterns
│   ├── module2_regex/
│   │   ├── regex.js                    # Regex matching engine
│   │   └── re_to_nfa.js                # Thompson's construction
│   ├── module3_cfg/
│   │   ├── cfg.js                      # CFG derivation checker
│   │   ├── cfg_to_cnf.js               # CNF converter (5-step Sipser)
│   │   └── parse_tree.js               # Parse tree builder
│   ├── module4_pda/
│   │   └── pda.js                      # PDA stack simulation
│   ├── module5_tm/
│   │   └── tm.js                       # Turing Machine engine
│   ├── module6_decidability/
│   │   └── decidability.js             # Halting problem demo
│   ├── bg.js                           # Dynamic background slideshow (Ken Burns)
│   ├── common.js                       # Sidebar toggle, shared utilities
│   └── landing.js                      # Landing page interactions
│
└── images/                             # Background images, logos
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS3 (glassmorphism, CSS variables, animations) |
| Logic | Vanilla JavaScript (ES6+, Canvas API) |
| Fonts | Inter, JetBrains Mono, Space Grotesk (Google Fonts) |
| Hosting | [Vercel](https://vercel.com) (auto-deploy from GitHub) |

**No frameworks. No build tools. No dependencies.**

---

## 💻 Running Locally

Since this is a pure HTML/CSS/JS project, you just need any static file server:

### Option 1 — VS Code Live Server
1. Install the **Live Server** extension in VS Code
2. Open the project folder
3. Right-click `index.html` → **Open with Live Server**

### Option 2 — Python
```bash
cd Toc_project
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 3 — Node (npx)
```bash
cd Toc_project
npx serve .
# Open http://localhost:3000
```

---

## ✨ Design Highlights

- **Dark glassmorphic UI** — frosted-glass cards with backdrop blur
- **Dynamic Ken Burns background** — crossfading background images with slow zoom/pan animation
- **Collapsible sidebar** — toggleable module navigation panel
- **Pill-shaped navbar** — transforms into a floating pill on scroll
- **Module tab bar** — within-module sub-page navigation
- **Lime yellow accent** (`#D2FF00`) — neon highlight on active states, buttons, and inputs
- **Execution trace visualization** — animated step-by-step chips for DFA/PDA/TM

---

## 📬 Contact

**Sanidhya Joshi**
- LinkedIn: [@joshisanidhya](https://www.linkedin.com/in/joshisanidhya/)
- GitHub: [@joshisanidhya](https://github.com/joshisanidhya)
- Instagram: [@sanidhyajoshi01](https://instagram.com/sanidhyajoshi01)
- Email: sanidhyajoshi.v24@iiits.in

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ for TOC students at IIIT Sri City · 2026</sub>
</div>