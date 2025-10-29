import React, { useState, useEffect } from 'react';
import './RecipeIngridients.css';

function createItem(name = '', qty = '', unit = '') {
  return { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), name, qty, unit };
}

export default function RecipeIngridients({ readOnly = false, initialItems = [], initialPortions = '' }) {
  const [portions, setPortions] = useState(initialPortions ?? '');
  // start with an empty list for new recipes or provided initial items
  const [items, setItems] = useState((initialItems || []).map((it) => ({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    name: it.name ?? '',
    qty: it.quantity ?? it.qty ?? '',
    unit: it.unit ?? 'шт',
  })));

  useEffect(() => {
    setPortions(initialPortions ?? '');
    setItems((initialItems || []).map((it) => ({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
      name: it.name ?? '',
      qty: it.quantity ?? it.qty ?? '',
      unit: it.unit ?? 'шт',
    })));
  }, [initialItems, initialPortions]);


  const addItem = () => setItems((s) => [...s, createItem()]);

  const updateItem = (id, field, value) => setItems((s) => s.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const removeItem = (id) => setItems((s) => s.filter((it) => it.id !== id));

  return (
    <div className="ri-root">
      <h3 className="ri-title">Інгредієнти</h3>

      <div className="ri-portions">
        <label style={{ color: '#000' }}>Порції:</label>
        {!readOnly ? (
          <input
            type="text"
            placeholder="Скільки порцій?"
            value={portions}
            onChange={(e) => setPortions(e.target.value)}
            style={{ color: '#000' }}
          />
        ) : (
          <div className="ri-portions--view" style={{ color: '#000' }}>{portions || '—'}</div>
        )}
      </div>

      <div className="ri-list">
        {items.map((it) => (
          <div className="ri-item" key={it.id}>
            {!readOnly && <div className="ri-handle" aria-hidden>☰</div>}
            {readOnly ? (
              <div className="ri-item-view">
                <div className="ri-item-name">{it.name}</div>
                <div className="ri-item-qty">{it.qty} {it.unit}</div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="ri-actions">
          <button type="button" className="ri-add" onClick={() => addItem()}>
            <span className="plus">+</span> Додати інгредієнти
          </button>
        </div>
      )}
    </div>
  );
}
