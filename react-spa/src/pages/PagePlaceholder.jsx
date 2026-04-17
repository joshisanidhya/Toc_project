import ModulePageTemplate from '../components/common/ModulePageTemplate';

function PagePlaceholder({ title, description, links = [] }) {
  return (
    <ModulePageTemplate title={title} description={description} quickLinks={links}>
      <div className="placeholder-panel">
        <p>
          This page has been moved into React routing and is ready for incremental content migration.
        </p>
      </div>
    </ModulePageTemplate>
  );
}

export default PagePlaceholder;
