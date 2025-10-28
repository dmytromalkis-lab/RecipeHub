import React, { useState, useRef } from 'react';
import './RecipeGuide.css';

function TimeRequired({ value, onChange }) {
  return (
    <div className="rg-time">
      <label className="rg-time-label">Час приготування</label>
      <input
        className="rg-time-input"
        type="text"
        placeholder="Час приготування страви"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function RecipeGuide() {
  const [time, setTime] = useState('');
  const [steps, setSteps] = useState([
    { id: 1, text: '', photos: [] },
  ]);
  const inputsRef = useRef({});

  const addStep = () => {
    setSteps((s) => [...s, { id: Date.now(), text: '', photos: [] }]);
  };

  const updateStep = (id, text) => {
    setSteps((s) => s.map((it) => (it.id === id ? { ...it, text } : it)));
  };

  const removeStep = (id) => {
    setSteps((s) => s.filter((it) => it.id !== id));
  };

  const handlePhotoAdd = (stepId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      // limit to a single photo per step: replace existing photo with the new one
      setSteps((s) => s.map((it) => (it.id === stepId ? { ...it, photos: [{ id: Date.now(), src }] } : it)));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (stepId) => {
    // only open file picker if this step currently has no photo (limit 1 photo per step)
    const step = steps.find((s) => s.id === stepId);
    if (step && (step.photos || []).length > 0) return;
    const inp = inputsRef.current[stepId];
    if (inp) inp.click();
  };

  const removePhoto = (stepId, photoId) => {
    setSteps((s) => s.map((it) => (it.id === stepId ? { ...it, photos: (it.photos || []).filter((p) => p.id !== photoId) } : it)));
  };

  return (
    <section className="rg-root">
      <h3 className="rg-title">Як приготувати</h3>

      <TimeRequired value={time} onChange={setTime} />

      <div className="rg-steps">
        {steps.map((step, idx) => (
          <div className="rg-step" key={step.id}>
            <div className="rg-step-index">
              <div className="rg-step-number">{idx + 1}</div>
            </div>

            <div className="rg-step-body">
              <textarea
                className="rg-step-text"
                placeholder="Опишіть цей крок..."
                value={step.text}
                onChange={(e) => updateStep(step.id, e.target.value)}
              />

              <div className="rg-step-photos">
                <input
                  ref={(el) => (inputsRef.current[step.id] = el)}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0];
                    handlePhotoAdd(step.id, f);
                    e.target.value = null;
                  }}
                />

                {(step.photos || []).map((p) => (
                  <div className="rg-photo-thumb" key={p.id}>
                    <img src={p.src} alt="step" />
                    <button type="button" className="rg-photo-delete" onClick={() => removePhoto(step.id, p.id)}>🗑</button>
                  </div>
                ))}

                {/* Only show add button when there is no photo for this step (limit 1) */}
                {(!(step.photos && step.photos.length) || (step.photos || []).length === 0) && (
                  <div className="rg-photo-add" onClick={() => triggerFileInput(step.id)} title="Додати фото">📷</div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="rg-step-delete"
              title="Видалити крок"
              onClick={() => removeStep(step.id)}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="rg-add-step" onClick={addStep}>
        + Додати крок
      </button>
    </section>
  );
}
