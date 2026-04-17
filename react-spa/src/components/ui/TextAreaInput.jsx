function TextAreaInput({ id, rows = 4, value, onChange, placeholder }) {
  return <textarea id={id} rows={rows} value={value} onChange={onChange} placeholder={placeholder} />;
}

export default TextAreaInput;
