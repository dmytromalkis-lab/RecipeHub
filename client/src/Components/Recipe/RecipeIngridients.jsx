import React, { useState } from 'react';
import './RecipeIngridients.css';

function createItem(name = '', qty = '', unit = '') {
  return { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), name, qty, unit };
}

export default function RecipeIngridients() {
  const [portions, setPortions] = useState('');
  // start with an empty list for new recipes
  const [items, setItems] = useState([]);


  const addItem = () => setItems((s) => [...s, createItem()]);

  const updateItem = (id, field, value) => setItems((s) => s.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const removeItem = (id) => setItems((s) => s.filter((it) => it.id !== id));

  return (
    <div className="ri-root">
      <h3 className="ri-title">Інгредієнти</h3>

      <div className="ri-portions">
        <label>Порції</label>
        <input
          type="text"
          placeholder="Скільки порцій?"
          value={portions}
          onChange={(e) => setPortions(e.target.value)}
        />
      </div>

      <div className="ri-list">
        {items.map((it) => (
          <div className="ri-item" key={it.id}>
            <div className="ri-handle" aria-hidden>☰</div>
            <input
              className="ri-input ri-input-name"
              placeholder="Назва інгр., напр. помідори"
              value={it.name}
              onChange={(e) => updateItem(it.id, 'name', e.target.value)}
            />
            <input
              className="ri-input ri-input-qty"
              placeholder="Кільк"
              value={it.qty}
              onChange={(e) => updateItem(it.id, 'qty', e.target.value)}
            />
            <select
              className="ri-input ri-input-unit"
              value={it.unit}
              onChange={(e) => updateItem(it.id, 'unit', e.target.value)}
            >
              <option value="шт">шт</option>
              <option value="г">г</option>
              <option value="кг">кг</option>
              <option value="мл">мл</option>
              <option value="л">л</option>
            </select>
            <button type="button" className="ri-delete" onClick={() => removeItem(it.id)} title="Видалити">🗑</button>
          </div>
        ))}
      </div>

      <div className="ri-actions">
        <button type="button" className="ri-add" onClick={() => addItem()}>
          <span className="plus">+</span> Додати інгредієнти
        </button>
      </div>
    </div>
  );
}
