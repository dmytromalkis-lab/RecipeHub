import React, { useState, useEffect } from 'react';
import './RecipeMain.css';
import RecipeName from './RecipeName.jsx';
import RecipeCreator from './RecipeCreator.jsx';
import RecipePhoto from './RecipePhoto.jsx';
import RecipeInfo from './RecipeInfo.jsx';
import RecipeIngridients from './RecipeIngridients.jsx';
import RecipeGuide from './RecipeGuide.jsx';
import RecipeDifficulty from './RecipeDifficulty.jsx';
import useUserStore from '../../stores/userStore.js';

export default function RecipeMain({ initialData = null, readOnly = false }) {
  // title may be provided by initialData when viewing an existing recipe
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? 'Нормальний');
  // pass down photo src, ingredients and steps to children
  const initialPhoto = initialData?.image_url ?? null;
  const initialIngredients = initialData?.ingredients ?? [];
  const initialSteps = initialData?.steps ?? [];
  const initialTime = initialData?.prep_time ?? '';
  const initialPortions = initialData?.serving ?? '';

  useEffect(() => {
    // update when initialData changes (e.g., after fetch)
    setTitle(initialData?.title ?? '');
    setDescription(initialData?.description ?? '');
    setDifficulty(initialData?.difficulty ?? 'Нормальний');
  }, [initialData]);
  // get current logged user from store to form the author object
  const currentUser = useUserStore((state) => state.user);

  // build author object if user exists; otherwise keep null (RecipeCreator will fallback)
  const author = currentUser
    ? {
        // server/user may use user_id, _id or id
        id: currentUser.user_id ?? currentUser._id ?? currentUser.id,
        name: currentUser.name ?? `${currentUser.first_name ?? ''} ${currentUser.last_name ?? ''}`.trim(),
        email: currentUser.email,
        avatar: currentUser.avatar,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
      }
    : null;

  return (
    <section className="rc-main">
      <div className="rc-top">
        <RecipePhoto readOnly={readOnly} photoSrc={initialPhoto} />
        <div className="rc-meta">
          <RecipeName value={title} onChange={(e) => setTitle(e.target.value)} readOnly={readOnly} />
          <RecipeInfo>
            <RecipeCreator author={author} />
            {!readOnly ? (
              <textarea
                className="rc-description"
                placeholder="Коротко про страву..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <p className="rc-description rc-description--view">{description}</p>
            )}
          </RecipeInfo>

          {/* Difficulty selector placed under RecipeInfo */}
          <RecipeDifficulty value={difficulty} onChange={setDifficulty} readOnly={readOnly} />
        </div>
      </div>

      <div className="rc-grid">
        <div className="rc-ingredients">
          <RecipeIngridients
            readOnly={readOnly}
            initialItems={initialIngredients}
            initialPortions={initialPortions}
          />
        </div>

        <div className="rc-steps">
          <RecipeGuide readOnly={readOnly} initialSteps={initialSteps} initialTime={initialTime} />
        </div>
      </div>
    </section>
  );
}
