import './Header.css';
import HeaderMain from './HeaderTitle.jsx';
import LoggedInterface from './LoggedInterface.jsx';
import LogoutedInterface from './LogoutedInterface.jsx';

export default function Header() {
  // Placeholder auth flag. Replace with real auth check later.
  const isLoggedIn = false;

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <HeaderMain />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isLoggedIn ? <LoggedInterface /> : <LogoutedInterface />}
      </div>
    </header>
  );
}