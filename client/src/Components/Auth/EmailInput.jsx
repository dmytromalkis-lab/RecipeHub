import './AuthField.css';

export default function EmailInput({ placeholder = 'hello@gmail.com', ...props }) {
  return (
    <div className="auth-field">
      <label>E-mail</label>
      <input type="email" placeholder={placeholder} {...props} />
    </div>
  );
}
