import PagePlaceholder from '../PagePlaceholder';

function RecapPage() {
  return (
    <PagePlaceholder
      title="Theory Recap"
      description="Unified recap content route available without full page reloads."
      links={[
        { label: 'DFA', to: '/module1/dfa' },
        { label: 'Decidability', to: '/module6/decidability' },
      ]}
    />
  );
}

export default RecapPage;
