import React, { useState } from "react";
import { Star, X, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import useUserStore from "../../stores/userStore";
import "./RatePopup.css";

export default function RatePopup({ recipeId, onClose, onSuccess }) {
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  const [submitted, setSubmitted] = useState(false); 
  const [error, setError] = useState("");
  
  const token = useUserStore((state) => state.token);

  const handleRate = async (score) => {
    if (!token) {
      setError("Please login to rate");
      return;
    }

    setRating(score);
    setError("");

    try {
      await api.post(`/rating/${recipeId}`, {
        rating: score 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmitted(true);
      
      // Update parent state immediately
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit rating");
    }
  };

  return (
    <div className="rating-overlay" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <h3>Rate Recipe</h3>
            
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="star-btn"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRate(star)}
                >
                  <Star
                    size={32}
                    fill={star <= (hoverRating || rating) ? "#ffa726" : "none"}
                    color={star <= (hoverRating || rating) ? "#ffa726" : "#ccc"}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            
            {error && <p style={{ color: "#e53935", marginTop: "10px", fontSize: "0.9rem" }}>{error}</p>}
            <p style={{ color: "#888", fontSize: "0.9rem" }}>
              Click on a star to rate
            </p>
          </>
        ) : (
          <div className="success-message">
            <CheckCircle size={48} color="#4caf50" />
            <span>Thanks for rating!</span>
          </div>
        )}
      </div>
    </div>
  );
}