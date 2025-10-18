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
      navigate('/login?error=' + error);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Зберігаємо дані користувача в store
        setToken(token);
        setUser(user);
        
        // Перенаправляємо на головну сторінку
        navigate('/');
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/login?error=parse_error');
      }
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
      fontSize: '18px'
    }}>
      Обробка входу через Google...
    </div>
  );
}
