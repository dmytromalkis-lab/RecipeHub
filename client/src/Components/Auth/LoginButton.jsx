import './LoginButton.css';

export default function LoginButton({ children = 'Log in', ...props }) {
  return (
    <button className="login-btn" type="submit" {...props}>{children}</button>
  );
}
