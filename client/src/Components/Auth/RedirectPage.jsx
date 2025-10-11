import { Link } from 'react-router-dom';
import './RedirectPage.css';

export default function RedirectPage({
  text = "Alreaedy had an account? ",
  link = "/login",
  textLink = "Log in"
}) {
  return (
    <div className="toggle-link">
      {text}
      <Link to={link}>
        <a>{textLink}</a>
      </Link>
    </div>
  );
};
