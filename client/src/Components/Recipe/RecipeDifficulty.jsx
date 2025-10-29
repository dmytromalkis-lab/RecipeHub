import React from 'react';
import './RecipeDifficulty.css';

export default function RecipeDifficulty({ value = 'Normal', onChange = () => {}, readOnly = false, error, clearError = () => {} }) {
  return (
    <div className="rc-difficulty">
      <h3 className="rg-title" style={{ margin: 0 }}>Recipe difficulty:</h3>

      {!readOnly ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select className={error ? 'rd-select error' : 'rd-select'} value={value} onChange={(e) => { onChange(e.target.value); if (error) clearError(); }}>
            <option>Easy</option>
            <option>Normal</option>
            <option>Hard</option>
          </select>
          {error && <div className="field-error-message">{error}</div>}
        </div>
      ) : (
        <div className="rd-value">{value}</div>
      )}
    </div>
  );
}
