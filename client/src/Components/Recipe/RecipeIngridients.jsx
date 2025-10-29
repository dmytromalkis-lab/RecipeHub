import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './RecipeIngridients.css';

function createItem(name = '', qty = '', unit = '') {
  return { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), name, qty, unit };
}

function RecipeIngridients({ readOnly = false, initialItems = [], initialPortions = '', errors = {}, setErrors = () => {} }, ref) {
  const [portions, setPortions] = useState(initialPortions ?? '');
  // start with an empty list for new recipes or provided initial items
  const [items, setItems] = useState((initialItems || []).map((it, idx) => ({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    name: it.name ?? '',
    qty: it.quantity ?? it.qty ?? '',
    unit: it.unit ?? 'pcs',
  })));

  useEffect(() => {
    setPortions(initialPortions ?? '');
    setItems((initialItems || []).map((it, idx) => ({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
      name: it.name ?? '',
      qty: it.quantity ?? it.qty ?? '',
      unit: it.unit ?? 'pcs',
    })));
  }, [initialItems, initialPortions]);

  useEffect(() => {
    console.log('[RecipeIngridients] mounted');
    return () => console.log('[RecipeIngridients] unmounted');
  }, []);


  const addItem = () => setItems((s) => [...s, createItem()]);

  const updateItem = (id, field, value) => setItems((s) => s.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const removeItem = (id) => setItems((s) => s.filter((it) => it.id !== id));

  // expose data to parent via ref
  useImperativeHandle(ref, () => ({
    getData: () => {
      console.log('[RecipeIngridients] getData called');
      // map to backend shape: { name, quantity, unit }
  const ingredients = items.map((it) => ({ name: it.name, quantity: it.qty, unit: it.unit || 'pcs' }));
      return { portions, ingredients };
    }
  }));

  return (
    <div className="ri-root">
      <h3 className="ri-title">Ingredients</h3>

      <div className="ri-portions">
        <label style={{ color: '#000' }}>Servings:</label>
        {!readOnly ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="How many servings?"
              value={portions}
              onChange={(e) => { setPortions(e.target.value); if (errors?.serving) setErrors(prev => ({ ...prev, serving: '' })); }}
              style={{ color: '#000' }}
              className={errors?.serving ? 'ri-input error' : 'ri-input'}
            />
            {errors?.serving && <div className="ri-error-message">{errors.serving}</div>}
          </div>
        ) : (
          <div className="ri-portions--view" style={{ color: '#000' }}>{portions || '—'}</div>
        )}
      </div>

      <div className="ri-list">
        {items.map((it, idx) => (
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
                  placeholder="Ingredient name, e.g. tomatoes"
                  value={it.name}
                  onChange={(e) => updateItem(it.id, 'name', e.target.value)}
                />
                <input
                  className={"ri-input ri-input-qty" + (errors?.ingredients && errors.ingredients[idx] ? ' error' : '')}
                  placeholder="Qty"
                  value={it.qty}
                  onChange={(e) => { updateItem(it.id, 'qty', e.target.value); if (errors?.ingredients && errors.ingredients[idx]) setErrors(prev => ({ ...prev, ingredients: { ...(prev.ingredients||{}), [idx]: '' } })); }}
                />
                <select
                  className="ri-input ri-input-unit"
                  value={it.unit}
                  onChange={(e) => updateItem(it.id, 'unit', e.target.value)}
                >
                  <option value="pcs">pcs</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                </select>
                <button type="button" className="ri-delete" onClick={() => removeItem(it.id)} title="Delete">🗑</button>
                {errors?.ingredients && errors.ingredients[idx] && <div className="ri-error-message">{errors.ingredients[idx]}</div>}
              </>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="ri-actions">
          <button type="button" className="ri-add" onClick={() => addItem()}>
            <span className="plus">+</span> Add ingredients
          </button>
        </div>
      )}
    </div>
  );
}

export default forwardRef(RecipeIngridients);
