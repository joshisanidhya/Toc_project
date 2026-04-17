
<div align="center">

<img src="images/toc_logo.png" alt="Automata Studio Logo" width="80"/>

# Automata Studio

### An interactive Theory of Computation simulator built for students of IIIT Sri City

[![Live Demo](https://img.shields.io/badge/Live%20Demo-automata--studio--toc.vercel.app-D2FF00?style=for-the-badge&logo=vercel&logoColor=black)](https://automata-studio-toc.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React%20Router-v6-F44250?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

---

## 📖 About

**Automata Studio** is a hands-on, browser-based simulator for all six units of the Theory of Computation course at **IIIT Sri City**. Instead of just reading textbook definitions, you can actually *run* your automata, *test* your grammars, and *see* computation happen in real time.

Originally built with vanilla HTML/CSS/JS, the platform has been **modernized as a React + Vite SPA** for improved performance, maintainability, and scalability. The interface features a dark-mode aesthetic with dynamic animations, responsive design, and interactive simulators — all powered by React hooks and modular component architecture.

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



---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 (Hooks: useState, useMemo, useEffect) |
| Build Tool | Vite 5.4.21 (Lightning-fast HMR) |
| Routing | React Router v6 (Client-side SPA navigation) |
| Styling | CSS3 (Glassmorphism, Variables, Animations) + Legacy CSS migration |
| State Management | React Hooks (No external state library) |
| Fonts | Inter, JetBrains Mono, Space Grotesk (Google Fonts) |
| Hosting | [Vercel](https://vercel.com) (Auto-deploy from GitHub) |

**Modern React SPA with clean modular architecture and zero external dependencies for state management.**

---

## 💻 Running Locally

The React + Vite SPA is located in the `/react-spa` directory. Follow these steps to run locally:

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup & Development
```bash
# 1. Navigate to the React SPA directory
cd react-spa

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# Open http://localhost:5173
```

### Build for Production
```bash
npm run build
# Generates optimized dist/ folder
```

### Preview Production Build
```bash
npm run preview
```

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
