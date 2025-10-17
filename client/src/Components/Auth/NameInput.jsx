import './AuthField.css';

export default function NameInput({ placeholder = 'Name', ...props }) {
  return (
    <div className="auth-field">
      <label>First name</label>
      <input type="text" placeholder={placeholder} {...props} />
    </div>
  );
}
