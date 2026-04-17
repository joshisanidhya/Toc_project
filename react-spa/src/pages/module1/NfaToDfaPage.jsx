import { useMemo, useState } from 'react';
import ModulePageTemplate from '../../components/common/ModulePageTemplate';
import FormField from '../../components/ui/FormField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextAreaInput from '../../components/ui/TextAreaInput';
import TextInput from '../../components/ui/TextInput';
import { convertNfaToDfa, nfaExample, parseNfaDefinition } from '../../features/nfaToDfa/converter';

function NfaToDfaPage() {
  const [form, setForm] = useState(() => nfaExample());
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const quickLinks = useMemo(
    () => [
      { label: 'DFA Simulator', to: '/module1/dfa' },
      { label: 'Language Checker', to: '/module1/language-checker' },
      { label: 'Theory Recap', to: '/module6/recap' },
    ],
    [],
  );

  const onFieldChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onLoadExample = () => {
    setForm(nfaExample());
    setError('');
    setResult(null);
    setActiveStep(0);
  };

  const onConvert = () => {
    try {
      const parsedNfa = parseNfaDefinition(form);
      const conversion = convertNfaToDfa(parsedNfa);
      setResult(conversion);
      setError('');
      setActiveStep(0);
    } catch (conversionError) {
      setResult(null);
      setError(conversionError.message);
    }
  };

  const selectedStep = result?.steps?.[activeStep] ?? null;

  return (
    <ModulePageTemplate
      title="NFA to DFA Converter"
      description="Convert an NFA to its equivalent DFA with subset construction and visible intermediate steps."
      quickLinks={quickLinks}
    >
      <div className="sim-grid">
        <div className="sim-card-react">
          <h3>NFA Definition</h3>

          <FormField label="States" htmlFor="nfaStates" hint="(comma separated)">
            <TextInput
              id="nfaStates"
              value={form.states}
              onChange={onFieldChange('states')}
              placeholder="q0, q1, q2"
            />
          </FormField>

          <FormField label="Alphabet" htmlFor="nfaAlphabet" hint="(include ε if needed)">
            <TextInput
              id="nfaAlphabet"
              value={form.alphabet}
              onChange={onFieldChange('alphabet')}
              placeholder="a, b, ε"
            />
          </FormField>

          <FormField label="Transitions" htmlFor="nfaTransitions" hint="(state,symbol=target1,target2)">
            <TextAreaInput
              id="nfaTransitions"
              rows={7}
              value={form.transitions}
              onChange={onFieldChange('transitions')}
              placeholder={'q0,ε=q1\nq1,a=q1,q2'}
            />
          </FormField>

          <FormField label="Start State" htmlFor="nfaStart">
            <TextInput id="nfaStart" value={form.startState} onChange={onFieldChange('startState')} placeholder="q0" />
          </FormField>

          <FormField label="Final States" htmlFor="nfaFinalStates" hint="(comma separated)">
            <TextInput
              id="nfaFinalStates"
              value={form.finalStates}
              onChange={onFieldChange('finalStates')}
              placeholder="q2, q3"
            />
          </FormField>

          <div className="inline-actions">
            <PrimaryButton onClick={onConvert}>Convert to DFA</PrimaryButton>
            <button className="secondary-chip-btn" type="button" onClick={onLoadExample}>
              Load Example
            </button>
          </div>
        </div>

        <div className="sim-card-react">
          <h3>Conversion Output</h3>

          {error ? <div className="result-box rejected">Error: {error}</div> : null}
          {result ? (
            <div className="result-box accepted">
              Done: {result.states.length} DFA states generated. Start state {result.startState}
            </div>
          ) : null}

          {result ? (
            <>
              <div className="dfa-summary-grid">
                <div>
                  <p className="mini-label">Start</p>
                  <p className="mono-value">{result.startState}</p>
                </div>
                <div>
                  <p className="mini-label">Final States</p>
                  <p className="mono-value">{result.finalStates.length > 0 ? result.finalStates.join(', ') : 'None'}</p>
                </div>
                <div>
                  <p className="mini-label">All DFA States</p>
                  <p className="mono-value">{result.states.join(', ')}</p>
                </div>
              </div>

              <div className="table-block">
                <p className="table-title">Transition Table</p>
                <div className="table-scroll-react">
                  <table className="transition-table-react">
                    <thead>
                      <tr>
                        <th>DFA State</th>
                        {result.alphabet.map((symbol) => (
                          <th key={symbol}>{symbol}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.states.map((state) => (
                        <tr key={state}>
                          <td>
                            <span className={result.finalStates.includes(state) ? 'accept-chip' : 'state-chip'}>{state}</span>
                          </td>
                          {result.alphabet.map((symbol) => (
                            <td key={`${state}-${symbol}`}>{result.transitionTable[state]?.[symbol] ?? '∅'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="table-block">
                <p className="table-title">Subset Construction Steps</p>
                <div className="step-selector-row">
                  {result.steps.map((step, index) => (
                    <button
                      key={step.stateLabel}
                      type="button"
                      className={index === activeStep ? 'step-pill active' : 'step-pill'}
                      onClick={() => setActiveStep(index)}
                    >
                      Step {index + 1}: {step.stateLabel}
                    </button>
                  ))}
                </div>

                {selectedStep ? (
                  <div className="step-detail-card">
                    <p className="mini-label">Processing state</p>
                    <p className="mono-value">{selectedStep.stateLabel}</p>
                    <div className="table-scroll-react">
                      <table className="transition-table-react">
                        <thead>
                          <tr>
                            <th>Symbol</th>
                            <th>Move</th>
                            <th>ε-Closure</th>
                            <th>DFA Target</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStep.details.map((detail) => (
                            <tr key={`${selectedStep.stateLabel}-${detail.symbol}`}>
                              <td>{detail.symbol}</td>
                              <td>{detail.move}</td>
                              <td>{detail.epsilonClosure}</td>
                              <td>
                                <span className={detail.discovered ? 'new-state-highlight' : ''}>{detail.target}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="placeholder-panel">
              <p>Enter NFA values and run conversion to view DFA states, transition table, and intermediate steps.</p>
            </div>
          )}
        </div>
      </div>
    </ModulePageTemplate>
  );
}

export default NfaToDfaPage;
