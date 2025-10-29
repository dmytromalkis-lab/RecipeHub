import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Main/Header/Header.jsx';
import Footer from '../../Components/Main/Footer/Footer.jsx';
import BackButton from '../../Components/Profile/ProfileMain/BackButton.jsx';
import RecipeMain from '../../Components/Recipe/RecipeMain.jsx';
import SubmitButton from '../../Components/Recipe/SubmitButton.jsx';
import SuccessPopup from '../../Components/UI/SuccessPopup.jsx';
import './RecipeCreate.css';
import api from '../../api/axios.js';
import useUserStore from '../../stores/userStore.js';

export default function RecipeCreate() {
  const navigate = useNavigate();
  const recipeRef = useRef(null);
  const token = useUserStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const handleSubmit = async () => {
    if (!recipeRef.current || !recipeRef.current.getPayload) return;
    // clear previous errors
    setErrors({});
    try {
      setLoading(true);
      const payload = await recipeRef.current.getPayload();

      // basic client-side validation: mark specific fields
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
      // ensure each ingredient has name, quantity and unit; record per-ingredient errors
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

      // Numeric-only validation: servings, preparation time and each ingredient qty must be digits
      const digitsOnly = (v) => (/^\d+$/.test(String(v || '').trim()));
      const newErrors = {};
      if (!digitsOnly(payload.serving)) {
        newErrors.serving = 'Servings must contain only digits';
      }
      if (!digitsOnly(payload.prep_time)) {
        newErrors.prep_time = 'Preparation time must contain only digits';
      }
      const ingredientErrors = {};
      (payload.ingredients || []).forEach((i, idx) => {
        if (!digitsOnly(i.quantity)) ingredientErrors[idx] = 'Qty must contain only digits';
      });
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

      if (payload.photoFile) {
        form.append('image', payload.photoFile);
      }

      // append step images (server expects field name stepImages[] or stepImages)
      if (payload.stepFiles && payload.stepFiles.length > 0) {
        payload.stepFiles.forEach((f) => {
          form.append('stepImages', f);
        });
      }

      const res = await api.post('/recipes', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const created = res.data?.recipe;
      const id = created?.recipe_id ?? created?.recipe?.recipe_id ?? created?.recipe_id;
      setLoading(false);
      setErrors({});
      // show success popup; navigate when user closes it
      setCreatedId(id || null);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrors({ general: err.response?.data?.message || 'Error creating recipe' });
    }
  };
  return (
    <div className="recipe-create-page">
      <Header />
      <div className="recipe-grid">
        <BackButton onClick={() => navigate('/profile')} />
        <main className="recipe-create-main">
          <div className="rc-wrapper">
            <RecipeMain ref={recipeRef} errors={errors} setErrors={setErrors} />

            {errors?.general && (
              <div style={{
                color: 'red',
                textAlign: 'center',
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: '#ffe6e6',
                borderRadius: '4px'
              }}>
                {errors.general}
              </div>
            )}

            <div className="recipe-submit">
              <SubmitButton onClick={handleSubmit} disabled={loading}>{loading ? 'Publishing...' : 'Publish'}</SubmitButton>
            </div>
            <SuccessPopup
              visible={showSuccess}
              message={'Recipe successfully created and is under review by moderators.'}
              onClose={() => {
                setShowSuccess(false);
                if (createdId) navigate(`/recipe/${createdId}`);
                else navigate('/profile');
              }}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
