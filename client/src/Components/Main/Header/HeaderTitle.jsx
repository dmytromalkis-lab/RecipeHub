import './HeaderTitle.css';
import CompanyLogo from './CompanyLogo.jsx';
import HeaderTitle from './HeaderText.jsx';
import { useNavigate } from 'react-router-dom';

export default function HeaderMain() {
  const navigate = useNavigate();
  const goMain = () => navigate('/main');

  return (
    <div className="header-main" onClick={goMain} style={{ cursor: 'pointer' }}>
      <CompanyLogo />
      <HeaderTitle />
    </div>
  );
}
