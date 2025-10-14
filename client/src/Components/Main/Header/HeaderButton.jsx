import { Link } from 'react-router-dom';
import './HeaderButton.css';

export default function HeaderButton({ text = 'Button', to, onClick, className = '' }) {
  const btn = (
    <button className={`header-btn ${className}`} onClick={onClick}>
      {text}
    </button>
  );

  return to ? <Link to={to}>{btn}</Link> : btn;
}
