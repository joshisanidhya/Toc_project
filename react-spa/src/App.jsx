import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import DFAPage from './pages/module1/DFAPage';
import LanguageCheckerPage from './pages/module1/LanguageCheckerPage';
import NfaToDfaPage from './pages/module1/NfaToDfaPage';
import RegexPage from './pages/module2/RegexPage';
import ReToNfaPage from './pages/module2/ReToNfaPage';
import CfgPage from './pages/module3/CfgPage';
import CfgToCnfPage from './pages/module3/CfgToCnfPage';
import CfgPdaPage from './pages/module3/CfgPdaPage';
import ParseTreePage from './pages/module3/ParseTreePage';
import PdaPage from './pages/module4/PdaPage';
import TmPage from './pages/module5/TmPage';
import TmTapePage from './pages/module5/TmTapePage';
import DecidabilityPage from './pages/module6/DecidabilityPage';
import ComplexityPage from './pages/module6/ComplexityPage';
import PvsNpPage from './pages/module6/PvsNpPage';
import RecapPage from './pages/module6/RecapPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/module1/dfa" element={<DFAPage />} />
          <Route path="/module1/language-checker" element={<LanguageCheckerPage />} />
          <Route path="/module1/nfa-to-dfa" element={<NfaToDfaPage />} />

          <Route path="/module2/regex" element={<RegexPage />} />
          <Route path="/module2/re-to-nfa" element={<ReToNfaPage />} />

          <Route path="/module3/cfg" element={<CfgPage />} />
          <Route path="/module3/cfg-to-cnf" element={<CfgToCnfPage />} />
          <Route path="/module3/cfg-pda" element={<CfgPdaPage />} />
          <Route path="/module3/parse-tree" element={<ParseTreePage />} />

          <Route path="/module4/pda" element={<PdaPage />} />

          <Route path="/module5/tm" element={<TmPage />} />
          <Route path="/module5/tm-tape" element={<TmTapePage />} />

          <Route path="/module6/decidability" element={<DecidabilityPage />} />
          <Route path="/module6/complexity" element={<ComplexityPage />} />
          <Route path="/module6/p-vs-np" element={<PvsNpPage />} />
          <Route path="/module6/recap" element={<RecapPage />} />

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
