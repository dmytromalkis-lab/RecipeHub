import React from "react";
import "./ProfileRecipeForm.css";
import UserAvatar from "../../Main/Header/UserAvatar.jsx";
import RecipeEditButton from "./RecipeEditButton.jsx";
import RecipeDeleteButton from "./RecipeDeleteButton.jsx";
import { useNavigate } from "react-router-dom";

export default function ProfileRecipeForm({
  recipe,
  canEdit = false,
  onEdit = null,
  onDelete = null,
}) {
  const sample = recipe;
  const navigate = useNavigate();

  const {
    author,
    title,
    ingredients = [],
    prep_time,
    serving,
    image_url,
  } = sample;

  // Format ingredients: if they are objects, extract names; if strings, use as is
  const ingredientsDisplay = Array.isArray(ingredients)
    ? ingredients
        .map((ing) => (typeof ing === "object" && ing?.name ? ing.name : ing))
        .join("•")
    : "";

  return (
    <article
      className="prf-card"
      onClick={() => navigate(`/recipe/${recipe.recipe_id}`)}
    >
      <div className="prf-left">
        <div className="prf-header">
          <UserAvatar
            src={author?.avatar}
            alt={`${author?.first_name} ${author?.last_name}`}
            to={`/profile/${author?.user_id || ""}`}
          />
          <div className="prf-author">
            <div className="prf-author-name">
              {author?.first_name} {author?.last_name}
            </div>
          </div>
        </div>

        <h3 className="prf-title">{title}</h3>

        <div className="prf-sub">{ingredientsDisplay}</div>

        <div className="prf-meta">
          <span className="prf-time">⏱ {prep_time} min</span>
          <span className="prf-serv">👥 {serving} servings</span>
        </div>

        {/* difficulty + category controls (left of image in original design) */}
        <div className="prf-controls">
          {recipe?.difficulty || sample.difficulty ? (
            <div className="prf-mini prf-mini-difficulty">
              <div className="prf-mini-label">Difficulty:</div>
              <div className="prf-mini-value">
                {recipe?.difficulty || sample.difficulty || "medium"}
              </div>
            </div>
          ) : null}

          {(() => {
            let cat =
              recipe?.category ??
              recipe?.Category ??
              recipe?.category_name ??
              null;
            // If cat is an object, extract category_name
            if (cat && typeof cat === "object" && cat.category_name) {
              cat = cat.category_name;
            }
            const display =
              cat || (sample.Category && sample.Category.category_name) || null;
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

        {canEdit ? (
          <div className="prf-photo-actions">
            <RecipeEditButton
              recipeId={recipe?.id || recipe?.recipe_id}
              onClick={(id) => {
                if (typeof onEdit === "function") return onEdit(id);
              }}
            />
            <RecipeDeleteButton
              recipeId={recipe?.id || recipe?.recipe_id}
              onClick={(id) => {
                if (typeof onDelete === "function") return onDelete(id);
              }}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
