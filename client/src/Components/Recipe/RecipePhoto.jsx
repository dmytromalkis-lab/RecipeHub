import React, { useRef, useState, useEffect } from 'react';

export default function RecipePhoto({ onUpload, readOnly = false, photoSrc: propPhoto = null }) {
  const inputRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState(propPhoto ?? null);

  useEffect(() => {
    setPhotoSrc(propPhoto ?? null);
  }, [propPhoto]);

  const triggerInput = () => {
    if (readOnly) return;
    if (inputRef.current) inputRef.current.click();
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoSrc(e.target.result);
      if (onUpload) onUpload(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
    e.target.value = null;
  };

  const removePhoto = (ev) => {
    ev.stopPropagation();
    setPhotoSrc(null);
    if (onUpload) onUpload(null);
  };

  return (
    <div className="rc-photo" onClick={triggerInput} role={readOnly ? 'img' : 'button'} tabIndex={0} onKeyDown={(e) => { if (!readOnly && (e.key === 'Enter' || e.key === ' ')) triggerInput(); }}>
      {!readOnly && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      )}

  {!photoSrc && <div>{readOnly ? 'No photo' : 'Upload photo'}</div>}

      {photoSrc && (
        <div className="rc-photo-thumb">
          <img src={photoSrc} alt="recipe" />
          {!readOnly && <button type="button" className="rc-photo-delete" onClick={removePhoto} title="Delete photo">🗑</button>}
        </div>
      )}
    </div>
  );
}
