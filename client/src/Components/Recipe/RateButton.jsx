import React, { useState } from "react";
import { Star } from "lucide-react";
import "./RateButton.css";
import RatePopup from "./RatePopup";

export default function RateButton({ recipeId, onRatingSuccess }) { 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <button 
        className="rate-btn" 
        onClick={() => setIsPopupOpen(true)} 
        title="Rate Recipe"
      >
        <Star size={18} />
        <span>Rate Recipe</span>
      </button>

      {isPopupOpen && (
        <RatePopup 
          recipeId={recipeId} 
          onClose={() => setIsPopupOpen(false)}
          onSuccess={onRatingSuccess} 
        />
      )}
    </>
  );
}