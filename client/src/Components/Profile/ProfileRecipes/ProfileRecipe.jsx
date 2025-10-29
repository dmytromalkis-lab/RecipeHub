import React from 'react';
import './ProfileRecipe.css';

export default function ProfileRecipe({ type = 'own' }) {
  // type: 'own' | 'fav'
  return (
    <div className="profile-recipe-placeholder">
      <h3>{type === 'own' ? 'My recipes' : 'Favorite recipes'}</h3>
      <div className="pr-empty">Recipes list will appear here (placeholder)</div>
    </div>
  );
}
