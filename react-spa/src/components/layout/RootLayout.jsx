import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function RootLayout() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main" id="top">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
