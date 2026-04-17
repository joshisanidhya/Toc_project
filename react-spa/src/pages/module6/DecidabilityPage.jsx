import { useState } from 'react';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';

function DecidabilityPage() {
  const [message, setMessage] = useState('');

  const haltDemo = () => {
    setMessage('This program may run forever. The Halting Problem proves no algorithm can decide this for all possible programs and inputs.');
  };

  return (
    <ModulePageTemplate
      title="Decidability"
      description="Halting problem and undecidability content migrated into SPA routing."
      quickLinks={[
        { label: 'Complexity', to: '/module6/complexity' },
        { label: 'P vs NP', to: '/module6/p-vs-np' },
      ]}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <p>
            Run a simple demo to show why halting cannot be decided universally.
          </p>
          <button type="button" className="btn-primary react-btn" onClick={haltDemo}>
            Run Halting Demo
          </button>
        </div>

        <div className="sim-card-react">
          <h3>Demo Result</h3>
          <div className="result-box info">{message || 'Click the button to show the halting message.'}</div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default DecidabilityPage;
