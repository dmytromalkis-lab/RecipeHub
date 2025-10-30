import React from 'react';
import './RecipeActionButtons.css';

export default function RecipeEditButton({ recipeId, onClick = null }) {
  const handle = (e) => {
    e.stopPropagation();
    if (typeof onClick === 'function') return onClick(recipeId);
    // default behaviour: navigate to edit page if used within a router (left for caller)
    console.log('Edit recipe', recipeId);
  };

  return (
    <button type="button" className="prf-action-btn prf-edit-btn" onClick={handle} title="Edit recipe">
      Edit
    </button>
  );
}
