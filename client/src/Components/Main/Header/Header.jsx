import './Header.css';
import HeaderMain from './HeaderTitle.jsx';
import LoggedInterface from './LoggedInterface.jsx';
import LogoutedInterface from './LogoutedInterface.jsx';
import useUserStore from '../../../stores/userStore.js';

export default function Header() {
  const isLoggedIn = useUserStore((state) => state.isAuthenticated);
  const onLogout = useUserStore((state) => state.logout);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <HeaderMain />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isLoggedIn ? <LoggedInterface onLogout={onLogout} /> : <LogoutedInterface />}
      </div>
    </header>
  );
}