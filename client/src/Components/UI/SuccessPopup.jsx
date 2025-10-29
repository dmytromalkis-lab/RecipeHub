import React from 'react';
import './SuccessPopup.css';

export default function SuccessPopup({ visible = false, message = '', onClose = () => {} }) {
  if (!visible) return null;
  return (
    <div className="sp-overlay" role="dialog" aria-modal="true">
      <div className="sp-box">
        <div className="sp-icon">✅</div>
        <div className="sp-message">{message}</div>
        <div className="sp-actions">
          <button className="sp-ok" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
