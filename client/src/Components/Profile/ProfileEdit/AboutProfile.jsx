import React from 'react';
import './AboutProfile.css';

export default function AboutProfile({ value, onChange }) {
  return (
    <div className="about-profile">
      <label htmlFor="about">About me</label>
      <textarea
        id="about"
        className="about-textarea"
        value={value}
        onChange={onChange}
        rows={6}
      />
    </div>
  );
}
