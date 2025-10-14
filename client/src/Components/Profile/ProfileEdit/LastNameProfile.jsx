import React from 'react';
import './LastNameProfile.css';

export default function LastNameProfile({ value, onChange }) {
  return (
    <div className="last-name-profile">
      <label htmlFor="lastName">Last name</label>
      <input
        id="lastName"
        type="text"
        value={value}
        onChange={onChange}
        className="profile-input"
      />
    </div>
  );
}
