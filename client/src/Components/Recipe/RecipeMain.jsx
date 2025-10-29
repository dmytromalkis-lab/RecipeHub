import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import './RecipeMain.css';
import RecipeName from './RecipeName.jsx';
import RecipeCreator from './RecipeCreator.jsx';
import RecipePhoto from './RecipePhoto.jsx';
import RecipeInfo from './RecipeInfo.jsx';
import RecipeIngridients from './RecipeIngridients.jsx';
import RecipeGuide from './RecipeGuide.jsx';
import RecipeDifficulty from './RecipeDifficulty.jsx';
import RecipeCategory from './RecipeCategory.jsx';
import useUserStore from '../../stores/userStore.js';

function RecipeMain({ initialData = null, readOnly = false, errors = {}, setErrors = () => {} }, ref) {
  // title may be provided by initialData when viewing an existing recipe
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? 'Normal');
  // support different shapes: initialData may have `Category: { category_name }` (preferred),
  // or `category` which can be string, number or object. Normalize to a display value (string or id)
  const deriveInitialCategory = (d) => {
    if (!d) return '';
    // prefer nested Category object from API
    if (d.Category && typeof d.Category === 'object') return d.Category.category_name ?? d.Category.category_id ?? '';
    // if category is an object, extract its name/id
    if (d.category && typeof d.category === 'object') return d.category.category_name ?? d.category.category_id ?? '';
    return d?.category ?? d?.category_name ?? '';
  };
  const [category, setCategory] = useState(deriveInitialCategory(initialData));
  // pass down photo src, ingredients and steps to children
  // memoize derived initial values so re-renders (e.g. loading state) don't create new array references
  const initialPhoto = useMemo(() => initialData?.image_url ?? null, [initialData]);
  const initialIngredients = useMemo(() => initialData?.ingredients ?? [], [initialData]);
  const initialSteps = useMemo(() => initialData?.steps ?? [], [initialData]);
  const initialTime = useMemo(() => initialData?.prep_time ?? '', [initialData]);
  const initialPortions = useMemo(() => initialData?.serving ?? '', [initialData]);

  useEffect(() => {
    // update when initialData changes (e.g., after fetch)
    setTitle(initialData?.title ?? '');
    setDescription(initialData?.description ?? '');
  setDifficulty(initialData?.difficulty ?? 'Normal');
    setCategory(deriveInitialCategory(initialData));
  }, [initialData]);
  // refs to children to collect data on submit
  const ingRef = useRef(null);
  const guideRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(initialPhoto ?? null);

  useEffect(() => {
    setPhotoSrc(initialPhoto ?? null);
  }, [initialPhoto]);
  // expose a method to gather payload for submission via ref
  useImperativeHandle(ref, () => ({
    getPayload: async () => {
      const ingData = ingRef.current ? ingRef.current.getData() : { portions: '', ingredients: [] };
      const guideData = guideRef.current ? guideRef.current.getData() : { time: '', steps: [], stepFiles: [] };

      const payload = {
        category_id: category,
        title,
        description,
        difficulty,
        prep_time: guideData.time,
        serving: ingData.portions,
        steps: guideData.steps,
        ingredients: ingData.ingredients,
        photoFile,
        stepFiles: guideData.stepFiles || [],
      };

      return payload;
    }
  }));
  // get current logged user from store to form the author object
  const currentUser = useUserStore((state) => state.user);
  // build author object: when viewing an existing recipe prefer the recipe's creator
  // provided by initialData.User (returned by getRecipeById). When creating/editing,
  // fall back to the current logged-in user from the store.
  let author = null;
  // Some API responses use `user` (lowercase) while others may use `User` (capitalized).
  // Prefer the recipe's owner when in readOnly mode.
  const apiUser = initialData?.user ?? initialData?.User ?? null;
  if (readOnly && initialData && apiUser) {
    // use the User object returned by the API directly (has user_id, first_name, last_name, avatar)
    author = apiUser;
  } else if (currentUser) {
    author = {
      id: currentUser.user_id ?? currentUser._id ?? currentUser.id,
      name: currentUser.name ?? `${currentUser.first_name ?? ''} ${currentUser.last_name ?? ''}`.trim(),
      avatar: currentUser.avatar,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
    };
  }
  // debug: log which author object we will pass to RecipeCreator
  // (helps verify we are using recipe author vs current user)
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[RecipeMain] initialData.user/User ->', apiUser);
      // eslint-disable-next-line no-console
      console.log('[RecipeMain] resolved author ->', author);
    } catch (e) {}
  }, [initialData, currentUser, readOnly]);

  return (
    <section className="rc-main">
      <div className="rc-top">
  <RecipePhoto readOnly={readOnly} photoSrc={photoSrc} onUpload={(file, dataUrl) => { setPhotoFile(file ?? null); setPhotoSrc(dataUrl ?? null); }} />
        <div className="rc-meta">
          <RecipeName value={title} onChange={(e) => { setTitle(e.target.value); if (errors?.title) setErrors(prev => ({ ...prev, title: '' })); }} readOnly={readOnly} error={errors?.title} />
          <RecipeInfo>
            <RecipeCreator author={author} />
            {!readOnly ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <textarea
                  className={errors?.description ? 'rc-description error' : 'rc-description'}
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); if (errors?.description) setErrors(prev => ({ ...prev, description: '' })); }}
                />
                {errors?.description && <div className="field-error-message">{errors.description}</div>}
              </div>
            ) : (
              <p className="rc-description rc-description--view">{description}</p>
            )}
          </RecipeInfo>

          {/* Difficulty and category selectors placed under RecipeInfo, side-by-side */}
          <div className="rc-meta-controls">
              <RecipeDifficulty value={difficulty} onChange={(v) => { setDifficulty(v); if (errors?.difficulty) setErrors(prev => ({ ...prev, difficulty: '' })); }} readOnly={readOnly} error={errors?.difficulty} clearError={() => setErrors(prev => ({ ...prev, difficulty: '' }))} />
              <RecipeCategory value={category} onChange={(v) => { setCategory(v); if (errors?.category) setErrors(prev => ({ ...prev, category: '' })); }} readOnly={readOnly} error={errors?.category} clearError={() => setErrors(prev => ({ ...prev, category: '' }))} />
          </div>
        </div>
      </div>

      <div className="rc-grid">
        <div className="rc-ingredients">
          <RecipeIngridients
            ref={ingRef}
            readOnly={readOnly}
            initialItems={initialIngredients}
            initialPortions={initialPortions}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        <div className="rc-steps">
          <RecipeGuide ref={guideRef} readOnly={readOnly} initialSteps={initialSteps} initialTime={initialTime} errors={errors} setErrors={setErrors} />
        </div>
      </div>
    </section>
  );
}
const forwarded = forwardRef(RecipeMain);
export default forwarded;
