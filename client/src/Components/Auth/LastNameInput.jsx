import './AuthField.css';

export default function LastNameInput({ placeholder = 'Last name', error, ...props }) {
  return (
    <div className={"auth-field" + (error ? ' error' : '')}>
      <label>Last name</label>
      <input type="text" placeholder={placeholder} {...props} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
