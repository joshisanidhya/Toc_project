import { useState } from 'react';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';

function TmPage() {
  const [input, setInput] = useState('010011');
  const [output, setOutput] = useState('');

  const runTM = () => {
    let result = '';
    for (const ch of input) {
      result += ch === '0' ? '1' : '0';
    }
    setOutput(result);
  };

  return (
    <ModulePageTemplate
      title="Turing Machine Simulator"
      description="TM core simulation is now routed and rendered in React."
      quickLinks={[
        { label: 'TM Tape', to: '/module5/tm-tape' },
        { label: 'Decidability', to: '/module6/decidability' },
      ]}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <label htmlFor="tmInput">Binary Input Tape</label>
          <input id="tmInput" value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="button" className="btn-primary react-btn" onClick={runTM}>
            Run TM
          </button>
        </div>

        <div className="sim-card-react">
          <h3>TM Output</h3>
          <div className="result-box info">{output ? `Output: ${output} (every bit flipped)` : 'Run the TM to see output.'}</div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default TmPage;
