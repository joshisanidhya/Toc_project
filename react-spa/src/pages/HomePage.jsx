import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const cards = [
  {
    title: 'Foundations of Automata',
    body: 'Simulate DFAs, check language membership, and convert NFAs to DFAs.',
    to: '/module1/dfa',
    iconClass: 'icon-purple',
  },
  {
    title: 'Regular Languages & Expressions',
    body: 'Test regex membership and convert RE to NFA with Thompson construction.',
    to: '/module2/regex',
    iconClass: 'icon-green',
  },
  {
    title: 'Context-Free Grammars',
    body: 'Explore derivations, parse trees, and CFG to CNF conversion.',
    to: '/module3/cfg',
    iconClass: 'icon-amber',
  },
  {
    title: 'Pushdown Automata',
    body: 'Model stack-based computation and trace push/pop operations.',
    to: '/module4/pda',
    iconClass: 'icon-cyan',
  },
  {
    title: 'Turing Machines',
    body: 'Run machine transitions and visualize tape-head movement.',
    to: '/module5/tm',
    iconClass: 'icon-rose',
  },
  {
    title: 'Decidability & Complexity',
    body: 'Understand the halting problem, complexity classes, and P vs NP.',
    to: '/module6/decidability',
    iconClass: 'icon-orange',
  },
];

function HomePage() {
  const darkRegionRef = useRef(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let isFlashing = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;
          lastScrollY = currentScrollY;

          if (entry.isIntersecting && scrollingDown && !isFlashing) {
            const overlay = document.getElementById('lightning-overlay');

            if (overlay) {
              isFlashing = true;
              overlay.classList.add('active');

              setTimeout(() => {
                overlay.classList.remove('active');
                setTimeout(() => {
                  isFlashing = false;
                }, 500);
              }, 1000);
            }
          }
        });
      },
      { threshold: 0.05 },
    );

    const region = darkRegionRef.current;
    if (region) {
      observer.observe(region);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>
      <div id="lightning-overlay"></div>

      <div id="landing-page">
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-new">New</span>
            Interactive TOC Simulator
          </div>
          <h1 className="hero-title">
            Simulate automata,
            <br />
            grammars in <span className="highlight">time.</span>
          </h1>
          <p className="hero-subtitle">Every DFA, regex, grammar, and Turing machine. Tested interactively.</p>
          <div className="hero-actions">
            <Link to="/module1/dfa" className="btn-primary">
              <span className="dot"></span>
              Start Exploring
            </Link>
            <button className="btn-outline" type="button" onClick={scrollToFeatures}>
              View Features ↓
            </button>
          </div>
        </section>

        <section className="college-strip">
          <p className="strip-label">Built for students at</p>
          <div className="strip-logo">
            <img src="/assets/iiits_logo.webp" alt="IIITS Logo" />
            <span>Indian Institute of Information Technology, Sri City</span>
          </div>
        </section>

        <div className="dark-parallax-region" ref={darkRegionRef}>
          <section className="manifesto">
            <p className="manifesto-text">
              Theory of Computation can feel <span className="dim">overwhelming</span> with abstract definitions,
              complex state machines, and formal proofs that seem distant from practice.
              <br />
              <br />
              We built a hands-on lab where you can actually <span className="accent-text">run</span> automata,
              <span className="accent-text"> test</span> grammars, and <span className="accent-text">see</span>{' '}
              computation happen in real time.
            </p>
          </section>

          <section className="features" id="features">
            <div className="features-heading">
              <div className="section-label">
                <span className="dot"></span> Modules
              </div>
              <h2>Six units. One simulator.</h2>
              <p>Everything you need for TOC, from finite automata to limits of computation.</p>
            </div>

            <div className="features-grid">
              {cards.map((card) => (
                <Link to={card.to} key={card.title} className="feature-card">
                  <div className={`feature-icon ${card.iconClass}`}></div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="about-section" id="about">
            <div className="about-card">
              <img src="/assets/iiits_logo.webp" alt="IIITS Logo" className="about-logo" />
              <h2>About This Project</h2>
              <p>
                This interactive TOC simulator was created as a hands-on learning tool for students at the Indian
                Institute of Information Technology, Sri City (IIITS).
              </p>
              <p>
                It covers all six major TOC units, letting you move beyond textbook definitions and actually run the
                computational models you study in class.
              </p>
              <p>
                Designed and developed by <strong>Sanidhya Joshi</strong>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default HomePage;
