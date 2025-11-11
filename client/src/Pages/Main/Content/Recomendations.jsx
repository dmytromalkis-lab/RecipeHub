import React from "react";
import { useNavigate } from "react-router-dom";
import "./Recomendations.css";
import borzh from "../../../assets/borscht.jfif";
import burger from "../../../assets/burger.jfif";
import khachapuri from "../../../assets/khacha.jpg";
import cookies from "../../../assets/cookies.jpg";

const items = [
  { id: 1, title: "Quick Meals", image: burger },
  { id: 2, title: "Borscht", image: borzh },
  { id: 3, title: "Cookie", image: cookies },
  { id: 4, title: "Khachapuri", image: khachapuri },
];

export default function Recomendations() {
  const navigate = useNavigate();

  const handleClick = (item) => {
    // Define navigation behavior per item
    if (item.title === "Quick Meals") {
      navigate(`/search?minTime=1&maxTime=15`);
      return;
    }
    // for other categories navigate by title (lowercase)
    const titleParam = item.title.toLowerCase();
    navigate(`/search?title=${encodeURIComponent(titleParam)}`);
  };

  return (
    <section className="recs">
      <h3 className="recs-title">Key words</h3>
      <div className="recs-list">
        {items.map((it) => (
          <div
            className="rec-card"
            key={it.id}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(it)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleClick(it);
            }}
          >
            <div
              className="rec-thumb"
              style={{ backgroundImage: `url(${it.image})` }}
            />
            <div className="rec-caption">{it.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
