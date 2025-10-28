import React from 'react';
import './SubmitButton.css';

export default function SubmitButton({ children = 'Опублікувати', ...props }) {
  return (
    <button className="rc-submit-button" type="button" {...props}>{children}</button>
  );
}
