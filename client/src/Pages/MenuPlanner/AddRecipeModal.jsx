import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import useUserStore from "../../stores/userStore";
import Loading from "../../Components/UI/Loading/Loading";

const AddRecipeModal = ({ isOpen, onClose, dayOfWeek, menuPlanId, onRecipeAdded }) => {
  const token = useUserStore((state) => state.token);
  
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [mealType, setMealType] = useState("Lunch");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(true); // Default to favorites
  const [loading, setLoading] = useState(false);

  // Fetch logic that handles both "Favorites" and "Global Search"
  const fetchRecipes = async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      if (showFavoritesOnly) {
        // Fetch from Favorites endpoint
        const { data } = await api.get("/favorites", config);
        const favs = data.favorites || [];
        // Local filtering for favorites
        const filteredFavs = favs
          .map(f => f.favorite_recipe)
          .filter(r => r.title?.toLowerCase().includes(search.toLowerCase()));
        setRecipes(filteredFavs);
      } else {
        // Global Search endpoint (logic from your SearchingPage)
        const params = { title: search, limit: 20 };
        const res = await api.get("/recipes/search", { params, ...config });
        setRecipes(res.data.recipes || []);
      }
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when toggle changes or search is submitted
  useEffect(() => {
    fetchRecipes();
  }, [isOpen, showFavoritesOnly, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleAdd = async () => {
    if (!selectedRecipeId) return;
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await api.post("/menuPlan/add-recipe", {
        menu_plan_id: menuPlanId,
        day_of_week: dayOfWeek,
        meal_type: mealType,
        recipe_id: selectedRecipeId,
      }, config);

      onRecipeAdded();
      onClose();
    } catch (err) {
      console.error("Error adding recipe:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2 className="modal-title">Add Recipe to {dayOfWeek}</h2>

        {/* --- TOGGLE BUTTON --- */}
        <div className="search-mode-toggle">
          <button 
            className={`toggle-btn ${showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly(true)}
          >
            ★ Favorites
          </button>
          <button 
            className={`toggle-btn ${!showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly(false)}
          >
            🌐 All Recipes
          </button>
        </div>

        {/* --- SEARCH ROW --- */}
        <form className="modal-search-container" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={showFavoritesOnly ? "Search favorites..." : "Search all recipes..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>

        {/* --- MEAL SELECTION --- */}
        <div className="meal-selection-block">
          <p className="selection-subtitle">Where should this go?</p>
          <div className="meal-type-pill-container">
            {["Breakfast", "Lunch", "Dinner"].map((type) => (
              <button
                key={type}
                className={`meal-pill ${mealType === type ? "active" : ""}`}
                onClick={() => setMealType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* --- RECIPE GRID --- */}
        <div className="modal-grid">
          {loading ? (
            <div className="modal-loading-container"><Loading /></div>
          ) : recipes.length > 0 ? (
            recipes.map((recipe) => {
              const isSelected = selectedRecipeId === recipe.recipe_id;
              return (
                <div 
                  key={recipe.recipe_id} 
                  className={`recipe-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedRecipeId(recipe.recipe_id)}
                >
                  <div className="recipe-image-wrapper">
                    <img src={recipe.image_url} alt={recipe.title} />
                    {isSelected && (
                      <div className="selection-badge">
                        <span className="check-icon">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="recipe-card-details">
                    <h4 className="recipe-name">{recipe.title}</h4>
                    <p className="recipe-info">
                      {recipe.difficulty || 'Easy'} • {recipe.prep_time || recipe.cooking_time || 20} min
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-recipes-found">No recipes found matching your search.</p>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="confirm-add-btn" 
            onClick={handleAdd}
            disabled={!selectedRecipeId}
          >
            Confirm {mealType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;
