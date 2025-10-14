import React from 'react';
import './SaveButton.css';

export default function SaveButton({ onClick }) {
  return (
    <button className="save-btn" onClick={onClick}>
      Save
    </button>
  );
}
