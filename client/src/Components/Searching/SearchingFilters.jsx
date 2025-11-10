import React from "react";
import RecipeCategory from "../Recipe/RecipeCategory.jsx";
import "./SearchingFilters.css";

export default function SearchingFilters({ filters, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const reset = () => {
    onChange({
      withIngredients: "",
      difficulty: "",
      categoryId: "",
      minTime: "",
      maxTime: "",
    });
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
          value={filters.withIngredients}
          onChange={(e) => handleChange("withIngredients", e.target.value)}
        />
      </div>

      <div className="sf-group">
        <label className="sf-label">Min prep time (min):</label>
        <input
          className="sf-input"
          type="number"
          min={0}
          placeholder="e.g. 10"
          value={filters.minTime}
          onChange={(e) => handleChange("minTime", e.target.value)}
        />
      </div>
      <div className="sf-group">
        <label className="sf-label">Max prep time (min):</label>
        <input
          className="sf-input"
          type="number"
          min={0}
          placeholder="e.g. 60"
          value={filters.maxTime}
          onChange={(e) => handleChange("maxTime", e.target.value)}
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
              value={filters.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
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
            value={filters.categoryId}
            onChange={(val) => handleChange("categoryId", val)}
          />
        </div>
      </div>
    </aside>
  );
}
