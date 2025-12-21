import React from "react";

export default function ShoppingListRecipeCard({ recipe }) {
  return (
    <div className="sl-recipe-card">
      <img src={recipe.image_url || "https://placehold.co/400x300?text=No+Image"} alt={recipe.title} className="sl-recipe-img" />
      <div className="sl-recipe-title">
        {recipe.title}
      </div>
    </div>
  );
}