import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';

function RegexPage() {
  const [regex, setRegex] = useState('(ab)*');
  const [value, setValue] = useState('abab');
  const [result, setResult] = useState({ text: '', type: '' });

  const checkRegex = () => {
    try {
      const re = new RegExp(`^${regex}$`);
      if (re.test(value)) {
        setResult({ text: 'Matched - String belongs to the language.', type: 'accepted' });
        return;
      }

      setResult({ text: 'Not Matched - String is not in the language.', type: 'rejected' });
    } catch (error) {
      setResult({ text: `Invalid regex: ${error.message}`, type: 'rejected' });
    }
  };

  return (
    <ModulePageTemplate
      title="Regex Checker"
      description="Test whether a string belongs to L(R) by evaluating the regex client-side."
      quickLinks={[
        { label: 'RE to NFA', to: '/module2/re-to-nfa' },
        { label: 'DFA Simulator', to: '/module1/dfa' },
      ]}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <label htmlFor="regexInput">Regular Expression</label>
          <input id="regexInput" value={regex} onChange={(event) => setRegex(event.target.value)} />

          <label htmlFor="regexString">Input String</label>
          <input id="regexString" value={value} onChange={(event) => setValue(event.target.value)} />

          <button type="button" className="btn-primary react-btn" onClick={checkRegex}>
            Check Membership
          </button>
        </div>

        <div className="sim-card-react">
          <h3>Regex Result</h3>
          <div className={`result-box ${result.type}`}>{result.text || 'Run the checker to see output.'}</div>
          <p>
            Continue to <Link to="/module2/re-to-nfa">RE to NFA</Link> for construction workflow.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default RegexPage;
