import React, { useState } from "react";
import MealSlotItem from "./MealSlotItem"; // Assuming you have this from previous steps

const MenuPlanDay = ({ dayName, items, menuPlanId, refresh, onAddClick }) => {
  // Logic to auto-open "Tomorrow" or "Today" can be added here if needed
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="mp-day-section">
      <div className="mp-day-header" onClick={() => setOpen(!isOpen)}>
        <div className="mp-day-left">
          {/* Apply bold/big class if open */}
          <span className={`mp-day-label ${isOpen ? "active-day" : ""}`}>
            {dayName}
          </span>
          <span className={`mp-arrow ${isOpen ? "open" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
        
        {/* The Plus Button opens the Modal */}
        <button 
          className="mp-add-btn" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent toggling the accordion
            onAddClick(); 
          }}
        >
          +
        </button>
      </div>

      {isOpen && (
        <div className="mp-meal-list">
          {items.map((item) => (
            <MealSlotItem
              key={item.meal_type + item.recipe_id} // Ensure unique key
              item={item}
              menuPlanId={menuPlanId}
              refresh={refresh}
            />
          ))}
          {items.length === 0 && (
            <div className="empty-day-msg">No meals planned. Click + to add.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuPlanDay;
