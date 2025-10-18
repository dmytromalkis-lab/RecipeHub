import { useState } from 'react';
import NameInput from './NameInput.jsx';
import LastNameInput from './LastNameInput.jsx';
import EmailInput from './EmailInput.jsx';
import PasswordInput from './PasswordInput.jsx';
import RegisterButton from './RegisterButton.jsx';
import SocialSignIn from './SocialSignIn.jsx';
import '../../Pages/Auth/Auth.css';

export default function RegisterForm() {
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  function handleChange(field) {
    return (e) => setValues(v => ({ ...v, [field]: e.target.value }));
  }

  function validate() {
    const newErrors = {};
    if (!values.firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!values.lastName.trim()) newErrors.lastName = 'Please enter your last name';
    // basic email format check (allow common local-part characters and domain)
    const email = values.email.trim();
    if (!email) newErrors.email = 'Please enter your email';
    else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';
    }
    // password presence and strength
    const pwd = values.password || '';
    if (!pwd) newErrors.password = 'Please enter a password';
    else {
      const requirements = [];
      if (pwd.length < 8) requirements.push('at least 8 characters');
      if (!/[a-z]/.test(pwd)) requirements.push('a lowercase letter');
      if (!/[A-Z]/.test(pwd)) requirements.push('an uppercase letter');
      if (!/[0-9]/.test(pwd)) requirements.push('a number');
      if (requirements.length) newErrors.password = 'Password must contain ' + requirements.join(', ');
    }

    if (!values.confirm) newErrors.confirm = 'Please confirm your password';
    if (pwd && values.confirm && pwd !== values.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // submit form (not implemented)
    console.log('submit', values);
  }

  return (
    <div className="register-form">
      <h1 style={{ textAlign: 'center' }}>Registration</h1>
      <form onSubmit={handleSubmit} noValidate>
        <NameInput value={values.firstName} onChange={handleChange('firstName')} error={errors.firstName} />
        <LastNameInput value={values.lastName} onChange={handleChange('lastName')} error={errors.lastName} />
        <EmailInput value={values.email} onChange={handleChange('email')} error={errors.email} />
        <div style={{ marginBottom: 6 }}>
          <PasswordInput value={values.password} onChange={handleChange('password')} helper={"Minimum 8 characters, upper and lower case letters, numbers"} error={errors.password} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <PasswordInput label="Confirm password" value={values.confirm} onChange={handleChange('confirm')} error={errors.confirm} />
        </div>
        <RegisterButton />
      </form>
      <SocialSignIn />
    </div>
  );
}
