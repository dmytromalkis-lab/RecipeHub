import React, { useRef, useState } from 'react';

export default function RecipePhoto({ onUpload }) {
  const inputRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState(null);

  const triggerInput = () => {
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

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhotoSrc(null);
    if (onUpload) onUpload(null);
  };

  return (
    <div className="rc-photo" onClick={triggerInput} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerInput(); }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {!photoSrc && <div>Завантажити фото</div>}

      {photoSrc && (
        <div className="rc-photo-thumb">
          <img src={photoSrc} alt="recipe" />
          <button type="button" className="rc-photo-delete" onClick={removePhoto} title="Видалити фото">🗑</button>
        </div>
      )}
    </div>
  );
}
