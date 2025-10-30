import React from 'react';
import './SearchingZone.css';

export default function SearchingZone() {
  return (
    <div className="searching-zone">
      <div className="search-inner">
        <input className="search-input" placeholder={`eg. "flour, baking soda" or "pizza"`} />
        <button className="search-button">Find recipe</button>
      </div>
    </div>
  );
}
