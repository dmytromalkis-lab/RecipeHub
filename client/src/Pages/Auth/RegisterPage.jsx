import './Auth.css';

import EmailInput from './../../Components/Auth/EmailInput.jsx';
import PasswordInput from './../../Components/Auth/PasswordInput.jsx';
import SubmitButton from './../../Components/Auth/SubmitButton.jsx';
import RedirectPage from './../../Components/Auth/RedirectPage.jsx';

function RegisterPage() {
  return (
    <div className="container">
      <form id="register-form">
        <h2>Registration</h2>
        <EmailInput />
        <PasswordInput />
        <PasswordInput passwordLabelName={"Confirm Password"} />
        <SubmitButton buttonName={"Registrate"} />
        <RedirectPage
          text={"Already had an account? "}
          link={"/login"}
          textLink={"Log in"}
        />
      </form>
    </div>
  );
}

export default RegisterPage;
