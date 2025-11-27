import React from "react";

export default function RecipeRating({ rating = 3.95 }) {
  const maxStars = 5;
  const filledStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    stars.push(
      <span
        key={i}
            style={{
              color: i < filledStars ? "#FFD700" : "#ccc",
              fontSize: "2.4rem",
              margin: "0 0.075rem 0 0",
              verticalAlign: "middle",
              lineHeight: 1,
            }}
      >
        ★
      </span>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
      <div>{stars}</div>
      <span style={{ color: "#888", fontWeight: 500 }}>( {rating} )</span>
    </div>
  );
}
