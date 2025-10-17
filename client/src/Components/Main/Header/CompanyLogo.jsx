import './CompanyLogo.css';
import logoSrc from '../../../assets/Logo.svg';

export default function CompanyLogo() {
  return (
    <div className="company-logo">
      <img src={logoSrc} alt="RecipeHub" />
    </div>
  );
}
