import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import MealSlotItem from "./MealSlotItem";
import useUserStore from "../../stores/userStore";

const MealCard = ({ item, onUpdate }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isReady, setIsReady] = useState(item.is_ready);
  //State to handle hiding the card immediately
  const [isVisible, setIsVisible] = useState(true);

  const token = useUserStore((state) => state.token);

  if (!item.recipe || !isVisible) return null;

  const recipe = item.recipe;

  // Toggle the Checkpoint (Ready status)
  const handleToggleReady = async (e) => {
    e.stopPropagation();
    
    const newStatus = !isReady;
    setIsReady(newStatus);

    try {
      await api.patch(`/menuPlan/item/${item.menu_plan_item_id}`, {
        is_ready: newStatus
      });
      
      if (typeof onUpdate === "function") onUpdate();
    } catch (err) {
      console.error("Failed to update status", err);
      setIsReady(!newStatus); 
    }
  };

  // Remove Dish (Set recipe_id to NULL to clear the slot)
  const handleRemove = async (e) => {
    e.stopPropagation();
    setIsVisible(false); // UI disappears instantly
  
    try {
      await api.patch(`/menuPlan/item/${item.menu_plan_item_id}`, {
        recipe_id: null,
        is_ready: false
      });
      
      // Give SQL a split second to breathe, then refresh parent
      setTimeout(() => {
        if (typeof onUpdate === "function") onUpdate();
      }, 100); 
  
    } catch (err) {
      console.error(err);
      setIsVisible(true); // Bring back if it failed
    }
  };

  const handleAddToShoppingList = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
  
    try {
      // REMOVE the "/api" from the start here
      // Keep it as "/shopingList" (one 'p') to match your backend route
      await api.post("/shopingList", {
        recipe_id: item.recipe.recipe_id 
      });
  
      alert("Ingredients added to shopping list!");
    } catch (err) {
      console.error("Add to list error:", err);
      alert(err.response?.data?.message || "Error adding to list");
    }
  };

  return (
    <div className="meal-card" onClick={() => navigate(`/recipe/${recipe.recipe_id}`)}>
      <div className="meal-image-container">
        <img src={recipe.image_url} alt={recipe.title} />
      </div>

      <div className="meal-content">
        <div className="meal-info">
          <span className="meal-type-tag">{item.meal_type}</span>
          <h4 className={`meal-title ${item.is_ready ? "strikethrough" : ""}`}>
            {recipe.title}
          </h4>
        </div>

        <div className="meal-actions">
          {/* Checkpoint Button */}
          <button 
            className={`meal-check-btn ${item.is_ready ? "ready" : ""}`} 
            onClick={handleToggleReady}
          >
            {item.is_ready ? "✔" : "✓"}
          </button>

          {/* 3 Dots Menu */}
          <div className="menu-container">
            <button 
              className="meal-more-btn" 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            >
              •••
            </button>

            {showMenu && (
              <div className="drop-menu">
                <button className="menu-item" onClick={handleAddToShoppingList}>
                  <span className="icon">📝</span> Add to Shopping List
                </button>
                <button className="menu-item delete" onClick={handleRemove}>
                  <span className="icon">🗑</span> Remove from plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuPlanDay = ({ dayName, items, onAddClick, refresh }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mp-day-section">
      <div className="mp-day-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="mp-label-wrapper">
          <span className={`mp-day-label ${isOpen ? "active-day" : ""}`}>
            {dayName}
          </span>
          <span className={`mp-arrow ${isOpen ? "open" : ""}`}>▶</span>
        </div>

        <div className="mp-header-actions">
          <button 
            className="mp-add-btn" 
            onClick={(e) => {
              e.stopPropagation(); // Prevents toggle when clicking plus
              onAddClick();
            }}
          >
            +
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mp-meals-container">
          {items.map((item) => (
            <MealCard 
              key={item.menu_plan_item_id} 
              item={item} 
              onUpdate={refresh} // Use the refresh variable here!
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPlanDay;
