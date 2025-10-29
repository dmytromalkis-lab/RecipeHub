import React from 'react';

export default function RecipeName({ value = '', onChange, readOnly = false, error }) {
  if (readOnly) {
    return <h1 className="rc-title rc-title--view">{value || 'Untitled'}</h1>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input
        className={error ? 'rc-title error' : 'rc-title'}
        placeholder="Title: e.g. Pea soup"
        value={value}
        onChange={onChange}
      />
      {error && <div className="field-error-message">{error}</div>}
    </div>
  );
}
