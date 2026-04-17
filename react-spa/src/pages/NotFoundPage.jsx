import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="container-shell utility-page">
      <h1>Page Not Found</h1>
      <p>The route you entered does not exist in this SPA.</p>
      <Link to="/" className="quick-link-pill">
        Go back home
      </Link>
    </section>
  );
}

export default NotFoundPage;
