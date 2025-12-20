import React, { useState } from "react";
import { MoreHorizontal, Trash2, Eye } from "lucide-react"; // <--- Добавили иконку Eye
import { useNavigate } from "react-router-dom"; // <--- Добавили навигацию
import ShoppingListRow from "./ShoppingListRow.jsx";

export default function ShoppingListGroup({ recipe, ingredients, onCheckItem, onDeleteItem, onRemoveGroup }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // <--- Хук для перехода

  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className="sl-group">
      <div className="sl-group-header">
        <div className="sl-group-title">{recipe.title}</div>
        
        {/* Выпадающее меню */}
        <div className="sl-menu-container">
          <button className="sl-group-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MoreHorizontal size={20} />
          </button>
          
          {isMenuOpen && (
            <>
              {/* Прозрачная подложка */}
              <div 
                style={{ position: "fixed", inset: 0, zIndex: 99 }} 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div className="sl-dropdown-menu">
                
                {/* 👇 КНОПКА VIEW RECIPE 👇 */}
                <button 
                  className="sl-menu-item" 
                  onClick={() => {
                    navigate(`/recipe/${recipe.id}`); // Переход к рецепту
                    setIsMenuOpen(false);
                  }}
                >
                  <Eye size={16} />
                  <span>View recipe</span>
                </button>
                {/* 👆 ------------------ 👆 */}

                <button 
                  className="sl-menu-item delete" 
                  onClick={() => {
                    onRemoveGroup(recipe.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <Trash2 size={16} />
                  <span>Remove recipe</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sl-list-container">
        {ingredients.map((ing) => (
          <ShoppingListRow 
            key={ing.id} 
            item={ing} 
            onCheck={onCheckItem}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
}