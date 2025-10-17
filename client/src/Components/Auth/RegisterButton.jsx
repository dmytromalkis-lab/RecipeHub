import './RegisterButton.css';

export default function RegisterButton({ children = 'Register', ...props }) {
  return (
    <button className="register-btn" type="submit" {...props}>{children}</button>
  );
}
