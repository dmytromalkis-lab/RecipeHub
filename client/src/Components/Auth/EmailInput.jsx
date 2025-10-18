import './AuthField.css';

export default function EmailInput({ placeholder = 'hello@gmail.com', error, ...props }) {
  return (
    <div className={"auth-field" + (error ? ' error' : '')}>
      <label>E-mail</label>
      <input type="email" placeholder={placeholder} {...props} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
