function FormField({ label, htmlFor, hint, children }) {
  return (
    <div className="form-field-react">
      <label htmlFor={htmlFor}>
        {label}
        {hint ? <span className="field-hint"> {hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export default FormField;
