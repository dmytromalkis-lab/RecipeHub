import './Auth.css';

import EmailInput from './../../Components/Auth/EmailInput.jsx';
import PasswordInput from './../../Components/Auth/PasswordInput.jsx';
import SubmitButton from './../../Components/Auth/SubmitButton.jsx';
import RedirectPage from './../../Components/Auth/RedirectPage.jsx';

function LoginPage() {
  return (
    <div className="container">
      <form id="login-form">
        <h2>Login</h2>
        <EmailInput />
        <PasswordInput />
        <SubmitButton buttonName={"Login"} />
        <RedirectPage
          text={"Don't have an account? "}
          link={"/register"}
          textLink={"Registrate"}
        />
      </form>
    </div>
  );
}

export default LoginPage;
