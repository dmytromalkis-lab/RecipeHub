import NameInput from './NameInput.jsx';
import LastNameInput from './LastNameInput.jsx';
import EmailInput from './EmailInput.jsx';
import PasswordInput from './PasswordInput.jsx';
import RegisterButton from './RegisterButton.jsx';
import SocialSignIn from './SocialSignIn.jsx';
import '../../Pages/Auth/Auth.css';

export default function RegisterForm() {
  return (
    <div className="register-form">
      <h1 style={{ textAlign: 'center' }}>Registration</h1>
      <form>
        <NameInput placeholder="Name" />
        <LastNameInput placeholder="Last name" />
        <EmailInput placeholder="hello@gmail.com" />
        <div style={{ marginBottom: 6 }}>
          <PasswordInput helper={"Minimum 8 characters, upper and lower case letters, numbers"} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <PasswordInput label="Confirm password" />
        </div>
  <RegisterButton />
      </form>
      <SocialSignIn />
    </div>
  );
}
