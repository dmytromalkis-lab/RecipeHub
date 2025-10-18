import './Auth.css';

import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';
import { useEffect } from 'react';

import EmailInput from '../../Components/Auth/EmailInput.jsx';
import PasswordInput from '../../Components/Auth/PasswordInput.jsx';
import LoginButton from '../../Components/Auth/LoginButton.jsx';
import SocialSignIn from '../../Components/Auth/SocialSignIn.jsx';

export default function LoginPage() {
  useEffect(() => {
    document.body.classList.add('auth-no-scroll');
    return () => document.body.classList.remove('auth-no-scroll');
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    // no validation per instruction
    console.log('login submitted');
  }

  return (
    <div className="auth-page no-scroll">
      <Header />
      <div className="register-form">
        <h1 style={{ textAlign: 'center' }}>Log in</h1>
        <form onSubmit={handleSubmit} noValidate>
          <EmailInput />
          <PasswordInput />
          <LoginButton />
        </form>
        <SocialSignIn />
      </div>
      <Footer />
    </div>
  );
}
