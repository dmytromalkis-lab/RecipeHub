import { useState } from 'react';
import './AuthField.css';

export default function PasswordInput({ label = 'Password', placeholder, helper = '', ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field password-field">
      <label>{label}</label>
      {helper && <div className="helper">{helper}</div>} 
      <div style={{ position: 'relative' }}>
        <input type={visible ? 'text' : 'password'} placeholder={placeholder} {...props} />
        <button type="button" className="eye" onClick={() => setVisible(v => !v)} aria-label="toggle password">
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}
