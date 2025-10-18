import './AuthField.css';

export default function NameInput({ placeholder = 'Name', error, ...props }) {
  return (
    <div className={"auth-field" + (error ? ' error' : '')}>
      <label>First name</label>
      <input type="text" placeholder={placeholder} {...props} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
