import React from 'react';
import './FirstNameProfile.css';

export default function FirstNameProfile({ value, onChange }) {
  return (
    <div className="first-name-profile">
      <label htmlFor="firstName">First name</label>
      <input
        id="firstName"
        type="text"
        value={value}
        onChange={onChange}
        className="profile-input"
      />
    </div>
  );
}
