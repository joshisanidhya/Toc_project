# Theory of Computation (ToC) - Interactive Learning Platform

A modern, interactive learning platform for **Theory of Computation** built with **React** and **Vite**. Features multiple tools for learning automata theory, formal languages, and computability concepts.

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5.4.21
- **Routing:** React Router v6
- **Styling:** CSS3 (Legacy CSS + Modern styling)
- **State Management:** React Hooks (useState, useMemo, useEffect)
- **Development Server:** Vite with HMR (Hot Module Replacement)

## Features

### Module 1: Finite Automata (DFA/NFA)
- **DFA Simulator** - Simulate deterministic finite automata
- **Language Checker** - Check if strings belong to a language
- **NFA → DFA Converter** - Convert nondeterministic to deterministic automata with subset construction algorithm and step-by-step visualization

### Module 2: Regular Expressions & NFA
- **Regular Expression Simulator** - Test regex patterns
- **RE → NFA Converter** - Convert regular expressions to ε-NFA using Thompson construction

### Module 3: Context-Free Grammars (CFG)
- **CFG Simulator** - Work with context-free grammars
- **CFG → CNF Converter** - Convert grammars to Chomsky Normal Form
- **Parse Tree Visualizer** - Visualize grammar parse trees
- **CFG ↔ PDA Relationship** - Explore equivalence between CFGs and PDAs

### Module 4: Pushdown Automata (PDA)
- **PDA Simulator** - Simulate stack-based computation

### Module 5: Turing Machines (TM)
- **TM Simulator** - Simulate Turing machines
- **TM Tape Animator** - Visualize tape operations

### Module 6: Computability & Complexity
- **Decidability Tool** - Explore decidable and undecidable problems
- **P vs NP** - Understand computational complexity classes
- **Complexity Analysis** - Study algorithm complexity
- **Recap** - Summary and review of key concepts

## Project Structure

```
react-spa/
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, RootLayout
│   │   ├── common/          # Shared components (ModulePageTemplate)
│   │   └── ui/              # Reusable UI components (FormField, Button, etc.)
│   ├── features/            # Feature-specific logic
│   │   └── nfaToDfa/        # NFA→DFA conversion algorithm
│   ├── pages/               # Route pages organized by module
│   │   ├── module1/         # DFA module pages
│   │   ├── module2/         # Regex module pages
│   │   ├── module3/         # CFG module pages
│   │   ├── module4/         # PDA page
│   │   ├── module5/         # TM pages
│   │   └── module6/         # Decidability pages
│   ├── styles/
│   │   ├── legacy-css/      # Migrated CSS from original site
│   │   └── app.css          # SPA-wide styling
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd react-spa
npm install
```

### Development Server

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The optimized build will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Architecture Highlights

### Modular Design
- **Separation of Concerns:** Algorithm logic isolated in `/features/` folder
- **Reusable Components:** UI components in `/components/ui/` for consistency
- **Feature Encapsulation:** Each major feature (NFA→DFA, RE→NFA, etc.) has its own logic module

### State Management
- React hooks for local component state
- useMemo for expensive computations
- useEffect for side effects and lifecycle management

### Styling Strategy
- Legacy CSS migrated from original site preserved in `/styles/legacy-css/`
- New SPA-specific styles in `app.css`
- Responsive grid layouts for multi-column interfaces

## Features in Development

- RE → NFA Converter (Thompson construction visualization)
- CFG → CNF Converter (with transformation steps)
- Parse Tree Visualizer
- Additional simulators and visualizers

## License

[See LICENSE file in project root]

## Contributing

Contributions are welcome! Please follow the established component structure and architecture patterns.
