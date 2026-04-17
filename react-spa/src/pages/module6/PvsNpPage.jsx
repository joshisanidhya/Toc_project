import PagePlaceholder from '../PagePlaceholder';

function PvsNpPage() {
  return (
    <PagePlaceholder
      title="P vs NP"
      description="Complexity class explainer route integrated with BrowserRouter."
      links={[
        { label: 'Complexity', to: '/module6/complexity' },
        { label: 'Theory Recap', to: '/module6/recap' },
      ]}
    />
  );
}

export default PvsNpPage;
