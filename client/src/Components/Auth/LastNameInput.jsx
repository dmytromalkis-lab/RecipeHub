import './AuthField.css';

export default function LastNameInput({ placeholder = 'Last name', ...props }) {
  return (
    <div className="auth-field">
      <label>Last name</label>
      <input type="text" placeholder={placeholder} {...props} />
    </div>
  );
}
