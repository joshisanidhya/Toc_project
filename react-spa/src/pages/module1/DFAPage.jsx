import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';

function DFAPage() {
  const [form, setForm] = useState({
    transitions: 'q0,a=q1\nq1,b=q2\nq2,a=q2',
    start: 'q0',
    accept: 'q2',
    input: 'aba',
  });
  const [result, setResult] = useState({ text: '', type: '' });

  const quickLinks = useMemo(
    () => [
      { label: 'Language Checker', to: '/module1/language-checker' },
      { label: 'NFA to DFA', to: '/module1/nfa-to-dfa' },
      { label: 'Theory Recap', to: '/module6/recap' },
    ],
    [],
  );

  const runDFA = () => {
    const transitions = form.transitions.split('\n');
    const acceptStates = form.accept
      .split(',')
      .map((state) => state.trim())
      .filter(Boolean);

    const transitionMap = {};
    transitions.forEach((transition) => {
      const [left, right] = transition.split('=');
      if (left && right) {
        transitionMap[left.trim()] = right.trim();
      }
    });

    let state = form.start.trim();

    for (const ch of form.input) {
      const key = `${state},${ch}`;
      if (!transitionMap[key]) {
        setResult({
          text: `Rejected - No transition for (${state}, ${ch})`,
          type: 'rejected',
        });
        return;
      }
      state = transitionMap[key];
    }

    if (acceptStates.includes(state)) {
      setResult({ text: `Accepted - Ended in state ${state}`, type: 'accepted' });
      return;
    }

    setResult({ text: `Rejected - Ended in non-accepting state ${state}`, type: 'rejected' });
  };

  return (
    <ModulePageTemplate
      title="DFA Simulator"
      description="Define transition rules and test a string using your DFA in the browser."
      quickLinks={quickLinks}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <label htmlFor="dfaTransitions">Transition Function (state,symbol=nextState)</label>
          <textarea
            id="dfaTransitions"
            value={form.transitions}
            onChange={(event) => setForm((prev) => ({ ...prev, transitions: event.target.value }))}
            rows={6}
          />

          <label htmlFor="dfaStart">Start State</label>
          <input
            id="dfaStart"
            value={form.start}
            onChange={(event) => setForm((prev) => ({ ...prev, start: event.target.value }))}
          />

          <label htmlFor="dfaAccept">Accept States (comma separated)</label>
          <input
            id="dfaAccept"
            value={form.accept}
            onChange={(event) => setForm((prev) => ({ ...prev, accept: event.target.value }))}
          />

          <label htmlFor="dfaInput">Input String</label>
          <input
            id="dfaInput"
            value={form.input}
            onChange={(event) => setForm((prev) => ({ ...prev, input: event.target.value }))}
          />

          <button type="button" className="btn-primary react-btn" onClick={runDFA}>
            Run DFA
          </button>
        </div>

        <div className="sim-card-react">
          <h3>Simulation Result</h3>
          <div className={`result-box ${result.type}`}>{result.text || 'Run the machine to see output.'}</div>
          <p>
            Need a formal walkthrough? Visit <Link to="/module6/recap">Theory Recap</Link>.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default DFAPage;
