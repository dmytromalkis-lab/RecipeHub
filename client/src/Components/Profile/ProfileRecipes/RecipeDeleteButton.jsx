import React from 'react';
import './RecipeActionButtons.css';

export default function RecipeDeleteButton({ recipeId, onClick = null }) {
  const handle = (e) => {
    e.stopPropagation();
    if (typeof onClick === 'function') return onClick(recipeId);
    // default behaviour: confirm delete
    if (window.confirm('Delete this recipe?')) {
      console.log('Deleting recipe', recipeId);
    }
  };

  return (
    <button type="button" className="prf-action-btn prf-delete-btn" onClick={handle} title="Delete recipe">
      Delete
    </button>
  );
}
