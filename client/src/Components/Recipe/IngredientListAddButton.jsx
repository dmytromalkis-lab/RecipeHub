import React, { useState } from "react";
import { ShoppingBasket, Check } from "lucide-react";
import "./IngredientListAddButton.css"; // Создадим простой CSS ниже

const IngredientListAddButton = ({ onClick }) => {
  const [added, setAdded] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    // Логика добавления (в будущем вызов API)
    if (onClick) onClick();
    
    // Визуальный эффект добавления
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      className={`ing-add-btn ${added ? "added" : ""}`} 
      onClick={handleClick}
      title="Add ingredients to Shopping List"
    >
      {added ? <Check size={20} /> : <ShoppingBasket size={20} />}
      <span>{added ? "Added!" : "To Shopping List"}</span>
    </button>
  );
};

export default IngredientListAddButton;