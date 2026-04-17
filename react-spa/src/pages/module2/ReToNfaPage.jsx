import PagePlaceholder from '../PagePlaceholder';

function ReToNfaPage() {
  return (
    <PagePlaceholder
      title="RE to NFA"
      description="Thompson construction view is now part of the single-page React app."
      links={[
        { label: 'Regex Checker', to: '/module2/regex' },
        { label: 'DFA Simulator', to: '/module1/dfa' },
      ]}
    />
  );
}

export default ReToNfaPage;
