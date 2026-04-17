function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button type="button" className={`btn-primary react-btn ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default PrimaryButton;
