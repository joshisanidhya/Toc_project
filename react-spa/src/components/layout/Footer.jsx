function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left footer-brand-inline">
        <img src="/assets/toc_logo.png" alt="Automata Studio Logo" className="footer-logo" />
        <span>Automata Studio © 2026 · IIIT Sri City</span>
      </div>
      <div className="footer-center">
        <a href="https://www.linkedin.com/in/joshisanidhya/" target="_blank" rel="noreferrer" title="LinkedIn">
          LinkedIn
        </a>
        <a href="https://github.com/joshisanidhya" target="_blank" rel="noreferrer" title="GitHub">
          GitHub
        </a>
        <a href="https://instagram.com/sanidhyajoshi01" target="_blank" rel="noreferrer" title="Instagram">
          Instagram
        </a>
        <a href="mailto:sanidhyajoshi.v24@iiits.in" title="Email">
          Email
        </a>
      </div>
      <div className="footer-right">
        <span className="status-dot"></span> System Online
      </div>
    </footer>
  );
}

export default Footer;
