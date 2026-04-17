import PagePlaceholder from '../PagePlaceholder';

function CfgToCnfPage() {
  return (
    <PagePlaceholder
      title="CFG to CNF"
      description="Five-step CNF conversion flow available under SPA navigation."
      links={[
        { label: 'CFG Derivation', to: '/module3/cfg' },
        { label: 'Parse Tree', to: '/module3/parse-tree' },
      ]}
    />
  );
}

export default CfgToCnfPage;
