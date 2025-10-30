import './LoggedInterface.css';
import UserAvatar from './UserAvatar.jsx';
import HeaderButton from './HeaderButton.jsx';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../stores/userStore.js';
import avatarImg from '../../../assets/avatar.png';

export default function LoggedInterface({ avatarSrc = null, onAvatarClick, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setOpen((s) => !s);
  };

  const goToProfile = () => {
    setOpen(false);
    navigate('/profile');
  };

  const handleLogout = async (e) => {
    e?.stopPropagation();
    setOpen(false);
    if (typeof onLogout === 'function') onLogout();
  };

  const displayName = (user?.name ?? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()) || 'User';

  return (
    <div className="logged-interface" ref={ref}>
      <UserAvatar src={avatarSrc} onClick={handleAvatarClick}>
        {open && (
          <div className="avatar-menu" role="menu" onClick={(e) => e.stopPropagation()}>
        <div className="avatar-menu-header">
          <img className="menu-avatar" src={user?.avatar || avatarImg} alt="avatar" />
              <div className="menu-user-details">
                <div className="menu-user-name">{displayName}</div>
                {user?.email && <div className="menu-user-email">{user.email}</div>}
              </div>
            </div>

            <div className="avatar-menu-section">
              <button type="button" className="menu-item" onClick={goToProfile}>
                <span className="menu-item-icon">🏠</span>
                <span>Profile</span>
              </button>
              {/* Settings and Send feedback removed per request */}
            </div>

            <div className="avatar-menu-section">
              <button type="button" className="menu-item" onClick={(e) => { e.stopPropagation(); handleLogout(e); }}>
                <span className="menu-item-icon">⬅️</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </UserAvatar>

      <HeaderButton text="Create recipe" to="/recipe/create" />
    </div>
  );
}