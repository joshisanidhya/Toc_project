import { useState } from 'react';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';

function PdaPage() {
  const [input, setInput] = useState('(()())');
  const [result, setResult] = useState({ text: '', type: '' });

  const runPDA = () => {
    const stack = [];

    for (const ch of input) {
      if (ch === '(') {
        stack.push(ch);
      } else if (ch === ')') {
        if (stack.length === 0) {
          setResult({ text: 'Rejected - Unmatched closing parenthesis.', type: 'rejected' });
          return;
        }
        stack.pop();
      }
    }

    if (stack.length === 0) {
      setResult({ text: 'Accepted - All parentheses balanced.', type: 'accepted' });
    } else {
      setResult({ text: `Rejected - ${stack.length} unmatched opening parenthesis(es).`, type: 'rejected' });
    }
  };

  return (
    <ModulePageTemplate
      title="PDA Simulator"
      description="Stack-based automata simulator with routed SPA navigation."
      quickLinks={[
        { label: 'CFG and PDA', to: '/module3/cfg-pda' },
        { label: 'TM Simulator', to: '/module5/tm' },
      ]}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <label htmlFor="pdaInput">Input Parentheses String</label>
          <input id="pdaInput" value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="button" className="btn-primary react-btn" onClick={runPDA}>
            Run PDA
          </button>
        </div>

        <div className="sim-card-react">
          <h3>PDA Result</h3>
          <div className={`result-box ${result.type}`}>{result.text || 'Run the PDA to see stack validation.'}</div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default PdaPage;
