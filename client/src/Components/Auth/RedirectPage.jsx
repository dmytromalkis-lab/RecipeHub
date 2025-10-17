import { Link } from 'react-router-dom';
import './RedirectPage.css';

export default function RedirectPage({
  text = "Already have an account? ",
  link = "/login",
  textLink = "Log in"
}) {
  return (
    <div className="toggle-link">
      {text}
      <Link to={link}>{textLink}</Link>
    </div>
  );
};
