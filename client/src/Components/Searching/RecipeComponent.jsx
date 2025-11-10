import React from "react";
import "./RecipeComponent.css";
import UserAvatar from "../Main/Header/UserAvatar.jsx";
import { useNavigate } from "react-router-dom";

export default function RecipeComponent({ recipe }) {
  const navigate = useNavigate();

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
      <div
        className="rc-card-left"
        onClick={() => navigate(`/recipe/${recipe.recipe_id}`)}
      >
        <img src={image_url} alt={title} className="rc-card-photo" />
      </div>

      <div className="rc-card-right">
        <h3 className="rc-card-title">{title}</h3>

        <div className="rc-card-meta">
          <ul className="rc-ings">
            {ingredients.map((ing, i) => {
              const text =
                typeof ing === "string"
                  ? ing
                  : ing && typeof ing === "object"
                  ? ing.name
                    ? `${ing.name}`
                    : JSON.stringify(ing)
                  : String(ing);

              return (
                <li key={i} className="rc-ing">
                  {text}
                </li>
              );
            })}
          </ul>

          <div className="rc-card-icons">
            <span className="rc-time">⏱ {prep_time} min</span>
            <span className="rc-serv">👥 {serving} servings</span>
          </div>
        </div>

        <div className="rc-card-author">
          <UserAvatar
            src={author?.avatar}
            alt={`${author?.first_name} ${author?.last_name}`}
            to={`/profile/${author?.user_id || ""}`}
          />
          <div className="rc-author-name">
            {author?.first_name} {author?.last_name}
          </div>
        </div>

        {/* bottom-right mini controls: difficulty and category (styled for this card) */}
        <div className="rc-card-controls">
          {recipe?.difficulty ? (
            <div className="rc-mini rc-mini-difficulty">
              <div className="rc-mini-label">Difficulty:</div>
              <div className="rc-mini-value">{recipe.difficulty}</div>
            </div>
          ) : null}

          <div className="rc-mini rc-mini-category">
            <div className="rc-mini-label">Category:</div>
            <div className="rc-mini-value">{recipe.category.category_name}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
