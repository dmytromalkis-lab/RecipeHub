import React from 'react';
import axios from 'axios';

const MealSlotItem = ({ item, menuPlanId, refresh }) => {
  const recipe = item.Recipe;

  const handleRemove = async () => {
    try {
      await axios.put('/api/menuPlan/remove-recipe', {
        menu_plan_id: menuPlanId,
        day_of_week: item.day_of_week,
        meal_type: item.meal_type
      });
      refresh();
    } catch (err) {
      console.error("Error removing recipe", err);
    }
  };

  if (!recipe) return null; // Or return a "No Breakfast assigned" placeholder

  return (
    <div className="meal-card">
      <img src={recipe.image_url || 'placeholder.jpg'} alt={recipe.title} className="meal-img" />
      <div className="meal-info">
        <h4>{recipe.title}</h4>
        <p>Category: {item.meal_type}</p>
      </div>
      <div className="meal-actions">
        <span className="check-icon">✓</span>
        <button className="more-btn" onClick={handleRemove}>•••</button>
      </div>
    </div>
  );
};

export default MealSlotItem;
