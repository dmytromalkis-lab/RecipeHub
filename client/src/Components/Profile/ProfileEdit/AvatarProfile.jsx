import React from 'react';
import './AvatarProfile.css';

export default function AvatarProfile({ src, alt = 'User avatar', size = 150 }) {
  return (
    <img
      className="avatar-profile"
      src={src}
      alt={alt}
      style={{ width: size, height: size, borderRadius: '50%', background: '#e5e5e5' }}
    />
  );
}
