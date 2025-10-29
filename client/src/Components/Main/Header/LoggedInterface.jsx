import './LoggedInterface.css';
import UserAvatar from './UserAvatar.jsx';
import HeaderButton from './HeaderButton.jsx';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoggedInterface({ avatarSrc = null, onAvatarClick, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    setOpen(false);
    if (typeof onLogout === 'function') onLogout();
  };

  return (
    <div className="logged-interface" ref={ref}>
      <UserAvatar src={avatarSrc} onClick={handleAvatarClick} />

      {open && (
        <div className="avatar-menu" role="menu">
          <button type="button" className="avatar-menu-item" onClick={goToProfile}>Profile</button>
          <button type="button" className="avatar-menu-item" onClick={handleLogout}>Logout</button>
        </div>
      )}

      <HeaderButton text="Create recipe" to="/recipe/create" />
    </div>
  );
}
