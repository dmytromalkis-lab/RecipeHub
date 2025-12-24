import React, { useState, useEffect } from "react";
import axios from "axios";

const AddRecipeModal = ({ isOpen, onClose, dayOfWeek, menuPlanId, onRecipeAdded }) => {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState("Lunch");

  useEffect(() => {
    if (isOpen) {
      const fetchFavorites = async () => {
        try {
          // Change this URL if your base path is different (e.g., "/favorites")
          const { data } = await axios.get("/api/favorites"); 
          // Your controller returns { favorites: [...] }
          setFavorites(data.favorites);
        } catch (err) {
          console.error("404 Check: Is the backend route actually /api/favorites?", err);
        }
      };
      fetchFavorites();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    try {
      await axios.post("/api/menuPlan/add-recipe", {
        menu_plan_id: menuPlanId,
        day_of_week: dayOfWeek,
        meal_type: selectedMealType,
        recipe_id: selectedRecipeId,
      });
      onRecipeAdded();
      onClose();
    } catch (err) {
      console.error("Error adding recipe to plan:", err);
    }
  };

  if (!isOpen) return null;

  const filtered = (favorites || []).filter(f => 
    f?.Recipe?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{color: 'black'}}>Select a recipe from Favourites</h2>
          <button onClick={onClose} className="close-x">×</button>
        </div>
        
        <div className="modal-controls">
          <input 
            type="text" 
            placeholder='e.g. "pizza"' 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <button className="search-orange-btn">Search</button>
        </div>

        <div className="modal-grid">
          {filtered.map((fav) => (
            <div 
              key={fav.Recipe.recipe_id} 
              className={`modal-card ${selectedRecipeId === fav.Recipe.recipe_id ? 'selected' : ''}`}
              onClick={() => setSelectedRecipeId(fav.Recipe.recipe_id)}
            >
              <div className="img-container">
                <img src={fav.Recipe.image_url} alt={fav.Recipe.title} />
                {selectedRecipeId === fav.Recipe.recipe_id && <div className="check-mark">✓</div>}
              </div>
              <div className="modal-card-info">
                <h4 style={{color: 'black'}}>{fav.Recipe.title}</h4>
                <p>{fav.Recipe.Ingredients?.length || 8} ingredients, {fav.Recipe.prep_time} min</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="add-final-btn" 
          disabled={!selectedRecipeId}
          onClick={handleAdd}
        >
          Add 1 recipe
        </button>
      </div>
    </div>
  );
};

export default AddRecipeModal;
