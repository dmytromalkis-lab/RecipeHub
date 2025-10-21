import './Auth.css';

import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import EmailInput from '../../components/Auth/EmailInput.jsx';
import PasswordInput from '../../components/Auth/PasswordInput.jsx';
import LoginButton from '../../Components/Auth/LoginButton.jsx';
import SocialSignIn from '../../components/Auth/SocialSignIn.jsx';
import useUserStore from '../../stores/userStore.js';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, isUser } = useUserStore();
  const [serverError, setServerError] = useState(null);


  // Перевіряємо URL параметри на наявність помилок від Google OAuth
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let errorMessage = 'Помилка авторизації';
      switch (error) {
        case 'auth_failed':
          errorMessage = 'Не вдалося авторизуватися через Google';
          break;
        case 'server_error':
          errorMessage = 'Помилка сервера під час авторизації';
          break;
        case 'parse_error':
          errorMessage = 'Помилка обробки даних від Google';
          break;
        case 'missing_data':
          errorMessage = 'Відсутні дані від Google';
          break;
        default:
          errorMessage = 'Невідома помилка авторизації';
      }
      setServerError(errorMessage);
    }
  }, [searchParams]);

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  function handleChange(field) {
    return (e) => {
      setValues(v => ({ ...v, [field]: e.target.value }));
      if (serverError) setServerError(null);
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };
  }

  function validate() {
    const newErrors = {};
    const email = (values.email || '').trim();
    if (!email) newErrors.email = 'Please enter your email';
    else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';
    }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const formData = { email: values.email, password: values.password };
      await login(formData);
      if(isUser()) {
        navigate("/");
      }
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed';
      setServerError(errorMessage);
    }
  }

  return (
    <div className="auth-page">
      <Header />
      <div className="register-form">
        <h1 style={{ textAlign: 'center' }}>Log in</h1>
        {serverError && (
          <div style={{
            color: 'red',
            textAlign: 'center',
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px'
          }}>
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <EmailInput value={values.email} onChange={handleChange('email')} error={errors.email} />
          <PasswordInput value={values.password} onChange={handleChange('password')} helper={"Minimum 8 characters, upper and lower case letters, numbers"} error={errors.password} />
          <LoginButton disabled={loading} />
        </form>
        <SocialSignIn />
      </div>
      <Footer />
    </div>
  );
}
