import React from 'react';
import './RecipeComponent.css';
import UserAvatar from '../Main/Header/UserAvatar.jsx';

export default function RecipeComponent({ recipe }) {
  const {
    title,
    image_url,
    ingredients = [],
    prep_time,
    serving,
    author,
  } = recipe;

  return (
    <article className="rc-card">
      <div className="rc-card-left">
        <img src={image_url} alt={title} className="rc-card-photo" />
      </div>

      <div className="rc-card-right">
        <h3 className="rc-card-title">{title}</h3>

        <div className="rc-card-meta">
          <ul className="rc-ings">
            {ingredients.map((ing, i) => (
              <li key={i} className="rc-ing">{ing}</li>
            ))}
          </ul>

          <div className="rc-card-icons">
            <span className="rc-time">⏱ {prep_time} min</span>
            <span className="rc-serv">👥 {serving} servings</span>
          </div>
        </div>

        <div className="rc-card-author">
          <UserAvatar src={author?.avatar} alt={`${author?.first_name} ${author?.last_name}`} to={`/profile/${author?.user_id || ''}`} />
          <div className="rc-author-name">{author?.first_name} {author?.last_name}</div>
        </div>

        {/* bottom-right mini controls: difficulty and category (styled for this card) */}
        <div className="rc-card-controls">
          {recipe?.difficulty ? (
            <div className="rc-mini rc-mini-difficulty">
              <div className="rc-mini-label">Difficulty:</div>
              <div className="rc-mini-value">{recipe.difficulty}</div>
            </div>
          ) : null}

          {(() => {
            const cat = recipe?.category ?? recipe?.Category?.category_name ?? recipe?.category_name ?? null;
            return cat ? (
              <div className="rc-mini rc-mini-category">
                <div className="rc-mini-label">Category:</div>
                <div className="rc-mini-value">{cat}</div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </article>
  );
}
