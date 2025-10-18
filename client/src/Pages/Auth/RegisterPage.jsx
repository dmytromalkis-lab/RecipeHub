import './Auth.css';

import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';

import RegisterForm from '../../components/Auth/RegisterForm.jsx';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <Header />
      <RegisterForm />
      <Footer />
    </div>
  );
}
