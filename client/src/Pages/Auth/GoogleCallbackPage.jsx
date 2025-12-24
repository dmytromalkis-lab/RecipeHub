import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useUserStore from '../../stores/userStore.js';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useUserStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google auth error:', error);
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Save user data in Zustand
        setToken(token);
        setUser(user);

        // Clean the URL
        window.history.replaceState({}, document.title, '/');

        // Redirect to homepage or dashboard
        navigate('/');
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/login?error=parse_error');
      }
    } else if (token) {
      // If backend only returns token, fetch user profile from API
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(user => {
          setToken(token);
          setUser(user);
          window.history.replaceState({}, document.title, '/');
          navigate('/');
        })
        .catch(err => {
          console.error('Error fetching user profile:', err);
          navigate('/login?error=fetch_user_failed');
        });
    } else {
      navigate('/login?error=missing_data');
    }
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#333',
      flexDirection: 'column',
    }}>
      <div>Processing Google sign-in...</div>
      <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
        Please wait a moment
      </div>
    </div>
  );
}

