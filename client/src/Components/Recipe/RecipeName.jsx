import React from 'react';

export default function RecipeName({ value = '', onChange, readOnly = false }) {
  if (readOnly) {
    return <h1 className="rc-title rc-title--view">{value || 'Без назви'}</h1>;
  }

  return (
    <input
      className="rc-title"
      placeholder="Назва: Наприклад Гороховий суп"
      value={value}
      onChange={onChange}
    />
  );
}
