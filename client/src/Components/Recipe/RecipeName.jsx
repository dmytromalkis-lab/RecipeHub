import React from 'react';

export default function RecipeName({ value = '', onChange }) {
  return (
    <input
      className="rc-title"
      placeholder="Назва: Наприклад Гороховий суп"
      value={value}
      onChange={onChange}
    />
  );
}
