import './LogoutedInterface.css';
import HeaderButton from './HeaderButton.jsx';

export default function LogoutedInterface() {
  return (
    <div className="logouted-interface">
      <HeaderButton text="Register" to="/register" />
      <HeaderButton text="Login" to="/login" />
    </div>
  );
}
