import { useNavigate } from 'react-router-dom';
import avatarImg from '../../../assets/avatar.png';
import useUserStore from '../../../stores/userStore';
import './UserAvatar.css';

export default function UserAvatar({ src, alt = 'User avatar', to = '/profile' }) {
  const navigate = useNavigate();
  return (
    <div
      className="header-avatar"
      onClick={() => navigate(to)}
      style={{ cursor: 'pointer' }}
    >
  <img src={avatarImg} alt={alt} className="avatar-img" />
    </div>
  );
}
