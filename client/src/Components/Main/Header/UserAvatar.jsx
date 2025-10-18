import { useNavigate } from 'react-router-dom';
import avatarImg from '../../../assets/avatar.png';
import useUserStore from '../../../stores/userStore.js';
import './UserAvatar.css';

export default function UserAvatar({ src, alt = 'User avatar', to = '/profile' }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  // prefer explicit prop, then user.avatar from store, then default image
  const initialSrc = src ?? user?.avatar ?? avatarImg;

  return (
    <div
      className="header-avatar"
      onClick={() => navigate(to)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={initialSrc}
        alt={alt}
        className="avatar-img"
        onError={(e) => {
          // fallback to default if image fails to load
          if (e.target.src !== avatarImg) e.target.src = avatarImg;
        }}
      />
    </div>
  );
}
