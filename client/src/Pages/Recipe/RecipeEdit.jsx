import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';
import BackButton from '../../Components/Profile/ProfileMain/BackButton.jsx';
import RecipeMain from '../../Components/Recipe/RecipeMain.jsx';
import SubmitButton from '../../Components/Recipe/SubmitButton.jsx';
import SuccessPopup from '../../Components/UI/SuccessPopup.jsx';
import './RecipeCreate.css';
import api from '../../api/axios.js';
import useUserStore from '../../stores/userStore.js';

export default function RecipeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipeRef = useRef(null);
  const token = useUserStore((s) => s.token);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!id) return;
    // Short-circuit: provide local test data when editing id=100
    if (String(id) === '100') {
      const sample = {
        recipe_id: 100,
        title: 'Test: Pea soup',
        description: 'A simple test recipe for pea soup used for UI development.',
        difficulty: 'Normal',
        prep_time: 30,
        serving: 4,
        image_url: '/images/borsh.jpg',
        Category: { category_id: 1, category_name: 'Soups' },
        user: { user_id: 1, first_name: 'Test', last_name: 'User', avatar: null },
        steps: [
          { description: 'Boil water and add peas.', step_number: 1, image_url: null },
          { description: 'Simmer for 20 minutes and blend.', step_number: 2, image_url: null }
        ],
        ingredients: [
          { name: 'Peas', quantity: '300', unit: 'g' },
          { name: 'Water', quantity: '1000', unit: 'ml' }
        ]
      };
      setInitialData(sample);
      setFetching(false);
      return;
    }
    (async () => {
      setFetching(true);
      setErrors({});
      try {
        const res = await api.get(`/recipes/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        // API may return the recipe directly or wrapped — try to normalize
        const data = res.data?.recipe ?? res.data ?? null;
        setInitialData(data);
      } catch (err) {
        setErrors({ general: err.response?.data?.message || err.message || 'Error loading recipe' });
      } finally {
        setFetching(false);
      }
    })();
  }, [id, token]);

  const handleSubmit = async () => {
    if (!recipeRef.current || !recipeRef.current.getPayload) return;
    setErrors({});
    try {
      setLoading(true);
      const payload = await recipeRef.current.getPayload();

      // same basic validation as create
      const missingFieldErrors = {};
      if (!payload.title) missingFieldErrors.title = 'Please enter a title';
      if (!payload.description) missingFieldErrors.description = 'Please enter a short description';
      if (!payload.category_id) missingFieldErrors.category = 'Please select a category';
      if (!payload.difficulty) missingFieldErrors.difficulty = 'Please select difficulty';
      if (payload.serving === undefined || payload.serving === '') missingFieldErrors.serving = 'Please enter servings';
      if (payload.prep_time === undefined || payload.prep_time === '') missingFieldErrors.prep_time = 'Please enter preparation time';
      if (Object.keys(missingFieldErrors).length) {
        setErrors(missingFieldErrors);
        setLoading(false);
        return;
      }

      if (!payload.steps || payload.steps.length === 0) {
        setErrors({ general: 'Add preparation steps' });
        setLoading(false);
        return;
      }
      if (!payload.ingredients || payload.ingredients.length === 0) {
        setErrors({ general: 'Add ingredients' });
        setLoading(false);
        return;
      }

      const ingredientMissingErrors = {};
      (payload.ingredients || []).forEach((i, idx) => {
        if (!i.name || !String(i.quantity).trim() || !i.unit) {
          ingredientMissingErrors[idx] = 'Name, Qty and Unit are required';
        }
      });
      if (Object.keys(ingredientMissingErrors).length) {
        setErrors({ ingredients: ingredientMissingErrors });
        setLoading(false);
        return;
      }

      const digitsOnly = (v) => (/^\d+$/.test(String(v || '').trim()));
      const newErrors = {};
      if (!digitsOnly(payload.serving)) newErrors.serving = 'Servings must contain only digits';
      if (!digitsOnly(payload.prep_time)) newErrors.prep_time = 'Preparation time must contain only digits';
      const ingredientErrors = {};
      (payload.ingredients || []).forEach((i, idx) => { if (!digitsOnly(i.quantity)) ingredientErrors[idx] = 'Qty must contain only digits'; });
      if (Object.keys(ingredientErrors).length) newErrors.ingredients = ingredientErrors;
      if (Object.keys(newErrors).length) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const form = new FormData();
      form.append('category_id', payload.category_id);
      form.append('title', payload.title);
      form.append('description', payload.description);
      form.append('difficulty', payload.difficulty);
      form.append('prep_time', payload.prep_time);
      form.append('serving', payload.serving);
      form.append('steps', JSON.stringify(payload.steps));
      form.append('ingredients', JSON.stringify(payload.ingredients));

      if (payload.photoFile) form.append('image', payload.photoFile);
      if (payload.stepFiles && payload.stepFiles.length > 0) {
        payload.stepFiles.forEach((f) => form.append('stepImages', f));
      }

      const res = await api.put(`/recipes/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      // success
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrors({ general: err.response?.data?.message || err.message || 'Error updating recipe' });
    }
  };

  return (
    <div className="recipe-create-page">
      <Header />
      <div className="recipe-grid">
        <BackButton onClick={() => navigate('/profile')} />
        <main className="recipe-create-main">
          <div className="rc-wrapper">
            {fetching && <div>Loading recipe...</div>}
            {!fetching && errors?.general && (
              <div style={{ color: 'red', textAlign: 'center', marginBottom: '12px', padding: '8px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{errors.general}</div>
            )}

            {!fetching && initialData && (
              <>
                <RecipeMain ref={recipeRef} initialData={initialData} readOnly={false} errors={errors} setErrors={setErrors} />

                <div className="recipe-submit">
                  <SubmitButton onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit changes'}</SubmitButton>
                </div>
              </>
            )}

            <SuccessPopup visible={showSuccess} message={'Recipe successfully updated and sent for moderation.'} onClose={() => {
              setShowSuccess(false);
              navigate(`/recipe/${id}`);
            }} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
