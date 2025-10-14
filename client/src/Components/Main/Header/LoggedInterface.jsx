import './LoggedInterface.css';
import UserAvatar from './UserAvatar.jsx';
import HeaderButton from './HeaderButton.jsx';

export default function LoggedInterface({ avatarSrc = null, onAvatarClick, onLogout }) {
  return (
    <div className="logged-interface">
      <UserAvatar src={avatarSrc} to={"/profile"} />
      <HeaderButton text="Log out" onClick={onLogout} />
    </div>
  );
}
