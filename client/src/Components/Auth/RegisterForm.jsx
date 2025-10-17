import TextInput from './TextInput.jsx';
import PasswordInput from './PasswordInput.jsx';
import SubmitButton from './SubmitButton.jsx';
import SocialSignIn from './SocialSignIn.jsx';
import '../../Pages/Auth/Auth.css';

export default function RegisterForm() {
  return (
    <div className="register-form">
      <h1 style={{ textAlign: 'center' }}>Registration</h1>
      <form>
        <TextInput label="First name" placeholder="Name" />
        <TextInput label="Last name" placeholder="Last name" />
        <TextInput label="E-mail" placeholder="hello@gmail.com" type="email" />
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Password</div>
          <PasswordInput />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Confirm password</div>
          <PasswordInput />
        </div>
        <SubmitButton buttonName="Register" />
      </form>
      <SocialSignIn />
    </div>
  );
}
