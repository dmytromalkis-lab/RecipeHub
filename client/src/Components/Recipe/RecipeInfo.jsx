import React from 'react';

export default function RecipeInfo({ children }) {
  return (
    <div className="rc-info" style={{ padding: 8 }}>
      {children}
    </div>
  );
}
