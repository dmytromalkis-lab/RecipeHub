import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchingTab.css';

export default function SearchingTab() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  return (
    <div className="searchpage-top">
      <div className="searchpage-inner">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="searchpage-input"
          placeholder={`eg. "flour, baking soda" or "pizza"`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = q?.trim();
              if (v) navigate(`/search?q=${encodeURIComponent(v)}`);
            }
          }}
        />
      </div>
      <div className="searchpage-placeholder">Placeholder</div>
    </div>
  );
}
