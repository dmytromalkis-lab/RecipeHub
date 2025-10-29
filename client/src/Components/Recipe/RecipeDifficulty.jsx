import React from 'react';
import './RecipeDifficulty.css';

export default function RecipeDifficulty({ value = 'Нормальна', onChange = () => {}, readOnly = false }) {
  return (
    <div className="rc-difficulty">
      <h3 className="rg-title" style={{ margin: 0 }}>Складність рецепту:</h3>

      {!readOnly ? (
        <select className="rd-select" value={value} onChange={(e) => onChange(e.target.value)}>
          <option>Легка</option>
          <option>Нормальна</option>
          <option>Складна</option>
        </select>
      ) : (
        <div className="rd-value">{value}</div>
      )}
    </div>
  );
}
