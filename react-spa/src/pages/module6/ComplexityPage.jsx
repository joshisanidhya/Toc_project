import PagePlaceholder from '../PagePlaceholder';

function ComplexityPage() {
  return (
    <PagePlaceholder
      title="Complexity Visualizer"
      description="Asymptotic growth visualizer route converted for SPA behavior."
      links={[
        { label: 'Decidability', to: '/module6/decidability' },
        { label: 'P vs NP', to: '/module6/p-vs-np' },
      ]}
    />
  );
}

export default ComplexityPage;
