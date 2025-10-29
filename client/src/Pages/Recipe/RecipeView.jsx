import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';
import BackButton from '../../Components/Profile/ProfileMain/BackButton.jsx';
import RecipeMain from '../../Components/Recipe/RecipeMain.jsx';
import useUserStore from '../../stores/userStore.js';
import api from '../../api/axios.js';
import sampleImg from '../../assets/Logo.svg';

export default function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useUserStore((s) => s.token);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    // If id is "1" use local test data so the page is always viewable during development
    if (id === '1') {
      const testData = {
        recipe_id: 1,
        title: 'Тестовий борщ',
        description: 'Смачний тестовий борщ з червоним буряком і пампушками',
        image_url: sampleImg,
        prep_time: 45,
        serving: 4,
        ingredients: [
          { name: 'Буряк', quantity: '2', unit: 'шт' },
          { name: 'Картопля', quantity: '3', unit: 'шт' },
          { name: 'Морква', quantity: '1', unit: 'шт' },
        ],
        steps: [
          { description: 'Крок 1: Ретельно помийте і очистіть всі овочі. Наріжте буряк тонкими скибками або соломкою.', image_url: sampleImg },
          { description: 'Крок 2: Обсмажте моркву і цибулю на олії, потім додайте до бульйону разом із картоплею.', image_url: sampleImg },
          { description: 'Крок 3: Додайте буряк, спеції і томатну пасту. Тушкуйте до готовності і подавайте з пампушками та сметаною.', image_url: sampleImg },
        ],
        User: { user_id: 1, first_name: 'Іван', last_name: 'Тестовий', avatar: null },
      };

      setData(testData);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await api.get(`/recipes/${id}`, { headers });
        setData(res.data);
      } catch (err) {
        console.error('Error loading recipe', err);
        setError(err.response?.data?.message || err.message || 'Помилка завантаження рецепту');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  return (
    <div className="recipe-create-page">
      <Header />
      <div className="recipe-grid">
        <BackButton onClick={() => navigate('/')} />
        <main className="recipe-create-main">
          <div className="rc-wrapper">
            {loading && <div>Завантаження...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && data && (
              <RecipeMain initialData={data} readOnly />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
