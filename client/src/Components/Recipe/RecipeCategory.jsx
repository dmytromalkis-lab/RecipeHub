import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import './RecipeCategory.css';

export default function RecipeCategory({ value = null, onChange = () => {}, readOnly = false, error, clearError = () => {} }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    api
      .get('/categories')
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.categories ?? [];
        setCategories(list);
      })
      .catch((err) => {
        // fail silently for now
        console.error('Failed to load categories', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rc-category">
      <h3 className="rg-title" style={{ margin: 0 }}>Category:</h3>
      {!readOnly ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select className={error ? 'rcat-select error' : 'rcat-select'} value={value ?? ''} onChange={(e) => { onChange(e.target.value ? Number(e.target.value) : ''); if (error) clearError(); }}>
            <option value="">-- Select category --</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
            ))}
          </select>
          {error && <div className="field-error-message">{error}</div>}
        </div>
      ) : (
        <div className="rcat-value">{typeof value === 'object' ? (value?.category_name ?? String(value)) : value}</div>
      )}
    </div>
  );
}
