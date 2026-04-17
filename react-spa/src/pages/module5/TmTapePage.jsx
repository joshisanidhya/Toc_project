import PagePlaceholder from '../PagePlaceholder';

function TmTapePage() {
  return (
    <PagePlaceholder
      title="TM Tape Animation"
      description="Tape and head visualization route prepared for React-based rendering."
      links={[
        { label: 'TM Simulator', to: '/module5/tm' },
        { label: 'PDA', to: '/module4/pda' },
      ]}
    />
  );
}

export default TmTapePage;
