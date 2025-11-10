import React, { useState } from "react";
import RecipeCategory from "../Recipe/RecipeCategory.jsx";
import "./SearchingFilters.css";

export default function SearchingFilters() {
  const [withIngredients, setWithIngredients] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const reset = () => {
    setWithIngredients("");
    setDifficulty("");
    setCategoryId("");
  };

  return (
    <aside className="search-filters-root">
      <div className="sf-header">
        <h4>Filters</h4>
        <button className="sf-reset" type="button" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="sf-group">
        <label className="sf-label">Show recipes with:</label>
        <input
          className="sf-input"
          placeholder="Enter ingredients..."
          value={withIngredients}
          onChange={(e) => setWithIngredients(e.target.value)}
        />
      </div>

      <div className="sf-block">
        <div className="rc-category">
          <h3 className="rg-title" style={{ margin: 0 }}>
            Difficulty:
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <select
              className="rcat-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">-- All --</option>
              <option value="Easy">Easy</option>
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="sf-block-category">
          <RecipeCategory
            value={categoryId}
            onChange={(val) => setCategoryId(val)}
          />
        </div>
      </div>
    </aside>
  );
}
