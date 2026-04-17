import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Features', to: '/', type: 'features' },
  { label: 'Theory Recap', to: '/module6/recap' },
  { label: 'Start Free', to: '/module1/dfa', cta: true },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = useMemo(() => location.pathname === '/', [location.pathname]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <Link className="nav-brand" to="/">
        <img src="/assets/toc_logo.png" alt="Automata Studio Logo" className="nav-logo" />
        <span>Automata Studio</span>
      </Link>

      <div className="nav-links">
        {navItems.map((item) => {
          if (item.type === 'features' && isHome) {
            return (
              <button
                key={item.label}
                type="button"
                className="nav-link nav-action-link"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => {
                if (item.cta) {
                  return 'nav-link nav-cta';
                }

                return isActive ? 'nav-link active' : 'nav-link';
              }}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
