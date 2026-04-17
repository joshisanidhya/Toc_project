import PagePlaceholder from '../PagePlaceholder';

function ParseTreePage() {
  return (
    <PagePlaceholder
      title="Parse Tree"
      description="Parse tree visualizer moved into React SPA route boundaries."
      links={[
        { label: 'CFG Derivation', to: '/module3/cfg' },
        { label: 'CFG to CNF', to: '/module3/cfg-to-cnf' },
      ]}
    />
  );
}

export default ParseTreePage;
