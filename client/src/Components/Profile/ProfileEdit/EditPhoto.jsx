import React from 'react';
import './EditPhoto.css';

export default function EditPhoto({ onClick }) {
  return (
    <div className="edit-photo" onClick={onClick}>
      <span role="img" aria-label="edit">✏️</span> Edit photo
    </div>
  );
}
