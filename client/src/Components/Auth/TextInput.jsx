import './Input.css';

export default function TextInput({ label, placeholder, type = 'text', ...props }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input type={type} placeholder={placeholder} {...props} />
    </div>
  );
}
