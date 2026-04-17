import { useState } from 'react';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';

function CfgPage() {
  const [rules, setRules] = useState('S->aSb | ab');
  const [input, setInput] = useState('ab');
  const [result, setResult] = useState({ text: '', type: '' });

  const checkCFG = () => {
    if (rules.includes('S->') && input.length > 0) {
      setResult({ text: 'Derivation possible (basic check).', type: 'accepted' });
      return;
    }

    setResult({
      text: 'Invalid - Ensure rules start with S-> and input is non-empty.',
      type: 'rejected',
    });
  };

  return (
    <ModulePageTemplate
      title="CFG Derivation"
      description="Context-free grammar derivation interface routed with React Router."
      quickLinks={[
        { label: 'CFG to CNF', to: '/module3/cfg-to-cnf' },
        { label: 'Parse Tree', to: '/module3/parse-tree' },
      ]}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <label htmlFor="cfgRules">Grammar Rules</label>
          <textarea id="cfgRules" rows={6} value={rules} onChange={(event) => setRules(event.target.value)} />

          <label htmlFor="cfgInput">Input String</label>
          <input id="cfgInput" value={input} onChange={(event) => setInput(event.target.value)} />

          <button type="button" className="btn-primary react-btn" onClick={checkCFG}>
            Check CFG
          </button>
        </div>

        <div className="sim-card-react">
          <h3>CFG Result</h3>
          <div className={`result-box ${result.type}`}>{result.text || 'Run the CFG check to view output.'}</div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default CfgPage;
