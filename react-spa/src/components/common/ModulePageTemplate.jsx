import { Link } from 'react-router-dom';

function ModulePageTemplate({ title, description, quickLinks = [], children }) {
  return (
    <section className="module-page container-shell">
      <header className="module-header">
        <p className="module-kicker">Automata Studio Module</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {quickLinks.length > 0 ? (
        <nav className="quick-links" aria-label="Related tools">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="quick-link-pill">
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="module-body">{children}</div>
    </section>
  );
}

export default ModulePageTemplate;
