import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchingZone.css";

export default function SearchingZone() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?title=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="searching-zone">
      <div className="search-inner">
        <input
          className="search-input"
          placeholder={`eg. "flour, baking soda" or "pizza"`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="search-button" onClick={handleSearch}>
          Find recipe
        </button>
      </div>
    </div>
  );
}
