import React, { useEffect } from "react";
import "./SearchingTab.css";

export default function SearchingTab({ value = "", onChange }) {
  const [inputValue, setInputValue] = React.useState(value);

  const handleSearch = () => {
    onChange(inputValue.trim());
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="searchpage-top">
      <div className="searchpage-inner">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="searchpage-input"
          placeholder={`eg. "pasta" or "pizza"`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="searchpage-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
