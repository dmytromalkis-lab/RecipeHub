import React from 'react';
import './ProfileRecipeForm.css';
import UserAvatar from '../../Main/Header/UserAvatar.jsx';

export default function ProfileRecipeForm({ recipe }) {
  // recipe may be undefined — render a placeholder card similar to screenshot
  const sample = recipe || {
    author: { first_name: 'Mykyta', last_name: '', avatar: null, user_id: '' },
    title: 'Borscht',
    ingredients: ['beet', 'cabbage', 'water'],
    prep_time: 44,
    serving: 2,
    image_url: '/public/placeholder.png',
  };

  const { author, title, ingredients = [], prep_time, serving, image_url } = sample;

  return (
    <article className="prf-card">
      <div className="prf-left">
        <div className="prf-header">
          <UserAvatar src={author?.avatar} alt={`${author?.first_name} ${author?.last_name}`} to={`/profile/${author?.user_id || ''}`} />
          <div className="prf-author">
            <div className="prf-author-name">{author?.first_name} {author?.last_name}</div>
          </div>
        </div>

        <h3 className="prf-title">{title}</h3>

        <div className="prf-sub">{ingredients.join('•')}</div>

        <div className="prf-meta">
          <span className="prf-time">⏱ {prep_time} min</span>
          <span className="prf-serv">👥 {serving} servings</span>
        </div>

        {/* difficulty + category controls (left of image in original design) */}
        <div className="prf-controls">
          {recipe?.difficulty || sample.difficulty ? (
            <div className="prf-mini prf-mini-difficulty">
              <div className="prf-mini-label">Difficulty:</div>
              <div className="prf-mini-value">{recipe?.difficulty || sample.difficulty || 'medium'}</div>
            </div>
          ) : null}

          {(() => {
            const cat = recipe?.category ?? recipe?.Category?.category_name ?? recipe?.category_name ?? null;
            const display = cat || (sample.Category && sample.Category.category_name) || null;
            return display ? (
              <div className="prf-mini prf-mini-category">
                <div className="prf-mini-label">Category:</div>
                <div className="prf-mini-value">{display}</div>
              </div>
            ) : null;
          })()}
        </div>
      </div>

      <div className="prf-right">
        <img src={image_url} alt={title} className="prf-photo" />
      </div>
    </article>
  );
}
