import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuDay.css";

const MenuDay = ({ day, meals, onAddRecipe, onRemoveRecipe }) => {
  const navigate = useNavigate();

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const renderMeal = (mealType, meal) => {
    if (meal) {
      return (
        <div
          className="meal-item"
          onClick={() => handleRecipeClick(meal.recipe_id)}
        >
          <div className="meal-content">
            <img src={meal.image_url} alt={meal.title} className="meal-thumb" />
            <div className="meal-details">
              <span className="meal-title">{meal.title}</span>
              <span className="meal-meta">
                {meal.prep_time} min • {meal.serving} servings
              </span>
            </div>
          </div>
          <button
            className="remove-icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveRecipe(day, mealType);
            }}
          >
            ×
          </button>
        </div>
      );
    } else {
      return (
        <div className="meal-item">
          <span className="add-text" onClick={() => onAddRecipe(mealType)}>
            + Add recipe
          </span>
        </div>
      );
    }
  };

  return (
    <div className="day-card">
      <h3 className="day-title">{day}</h3>
      <div className="meals-list">
        <div className="meal-section">
          <h4 className="meal-label">Breakfast</h4>
          {renderMeal("breakfast", meals.breakfast)}
        </div>
        <div className="meal-section">
          <h4 className="meal-label">Lunch</h4>
          {renderMeal("lunch", meals.lunch)}
        </div>
        <div className="meal-section">
          <h4 className="meal-label">Dinner</h4>
          {renderMeal("dinner", meals.dinner)}
        </div>
      </div>
    </div>
  );
};

export default MenuDay;
