import './SocialSignIn.css';

export default function SocialSignIn() {
  return (
    <div className="social-signin">
      <div className="social-title">Sign in with:</div>
      <button className="social-google">
        <img src="/src/assets/Google.png" alt="Google" />
        <span className="social-label">Google</span>
      </button>
    </div>
  );
}
