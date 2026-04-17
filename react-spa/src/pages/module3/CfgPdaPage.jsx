import PagePlaceholder from '../PagePlaceholder';

function CfgPdaPage() {
  return (
    <PagePlaceholder
      title="CFG and PDA Equivalence"
      description="Cross-model equivalence exploration with client-side routing."
      links={[
        { label: 'CFG Derivation', to: '/module3/cfg' },
        { label: 'PDA Simulator', to: '/module4/pda' },
      ]}
    />
  );
}

export default CfgPdaPage;
