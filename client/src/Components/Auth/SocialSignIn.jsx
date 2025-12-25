import "./SocialSignIn.css";
import useUserStore from "../../stores/userStore.js";
import googleLogo from "/Google.png";

export default function SocialSignIn() {
  const { loginWithGoogle } = useUserStore();

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="social-signin">
      <div className="social-title">Sign in with:</div>
      <button className="social-google" onClick={handleGoogleLogin}>
        <img src={googleLogo} alt="Google" />
        <span className="social-label">Google</span>
      </button>
    </div>
  );
}
