import React, { useState } from 'react';
import './RecipeMain.css';
import RecipeName from './RecipeName.jsx';
import RecipeCreator from './RecipeCreator.jsx';
import RecipePhoto from './RecipePhoto.jsx';
import RecipeInfo from './RecipeInfo.jsx';
import RecipeIngridients from './RecipeIngridients.jsx';
import RecipeGuide from './RecipeGuide.jsx';
import useUserStore from '../../stores/userStore.js';

export default function RecipeMain() {
  const [title, setTitle] = useState('');
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
        <RecipePhoto />
        <div className="rc-meta">
          <RecipeName value={title} onChange={(e) => setTitle(e.target.value)} />
          <RecipeInfo>
            <RecipeCreator author={author} />
            <textarea className="rc-description" placeholder="Коротко про страву..." />
          </RecipeInfo>
        </div>
      </div>

      <div className="rc-grid">
        <div className="rc-ingredients">
          <RecipeIngridients />
        </div>

        <div className="rc-steps">
          <RecipeGuide />
        </div>
      </div>
    </section>
  );
}
