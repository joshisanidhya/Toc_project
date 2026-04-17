import PagePlaceholder from '../PagePlaceholder';

function LanguageCheckerPage() {
  return (
    <PagePlaceholder
      title="Language Checker"
      description="Check whether strings belong to selected regular languages."
      links={[
        { label: 'DFA Simulator', to: '/module1/dfa' },
        { label: 'NFA to DFA', to: '/module1/nfa-to-dfa' },
      ]}
    />
  );
}

export default LanguageCheckerPage;
