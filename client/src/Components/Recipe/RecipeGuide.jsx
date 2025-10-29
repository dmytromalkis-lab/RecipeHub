import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './RecipeGuide.css';

function TimeRequired({ value, onChange, readOnly = false, error, clearError = () => {} }) {
  return (
    <div className="rg-time">
      <label className="rg-time-label" style={{ color: '#000' }}>Preparation time:</label>
      {!readOnly ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            className={error ? 'rg-time-input error' : 'rg-time-input'}
            type="text"
            placeholder="Preparation time"
            value={value}
            onChange={(e) => { onChange(e.target.value); if (error) clearError(); }}
            style={{ color: '#000' }}
          />
          {error && <div className="rg-error-message">{error}</div>}
        </div>
      ) : (
        <div className="rg-time--view" style={{ color: '#000' }}>{value ? `${value} minutes` : '—'}</div>
      )}
    </div>
  );
}

export default forwardRef(RecipeGuide);

function RecipeGuide({ readOnly = false, initialSteps = [], initialTime = '', errors = {}, setErrors = () => {} }, ref) {
  const [time, setTime] = useState(initialTime ?? '');
  const [steps, setSteps] = useState((initialSteps || []).map((s, idx) => ({
    id: s.id ?? Date.now() + idx,
    text: s.description ?? '',
    // photos will hold { id, src, file? }
    photos: s.image_url ? [{ id: Date.now() + idx + 1, src: s.image_url, file: null }] : [],
  })));
  const inputsRef = useRef({});

  useEffect(() => {
    setTime(initialTime ?? '');
    setSteps((initialSteps || []).map((s, idx) => ({
      id: s.id ?? Date.now() + idx,
      text: s.description ?? '',
      photos: s.image_url ? [{ id: Date.now() + idx + 1, src: s.image_url }] : [],
    })));
  }, [initialSteps, initialTime]);

  useEffect(() => {
    console.log('[RecipeGuide] mounted');
    return () => console.log('[RecipeGuide] unmounted');
  }, []);

  const addStep = () => {
    if (readOnly) return;
    setSteps((s) => [...s, { id: Date.now(), text: '', photos: [] }]);
  };

  const updateStep = (id, text) => {
    if (readOnly) return;
    setSteps((s) => s.map((it) => (it.id === id ? { ...it, text } : it)));
  };

  const removeStep = (id) => {
    if (readOnly) return;
    setSteps((s) => s.filter((it) => it.id !== id));
  };

  const handlePhotoAdd = (stepId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      // limit to a single photo per step: replace existing photo with the new one
      setSteps((s) => s.map((it) => (it.id === stepId ? { ...it, photos: [{ id: Date.now(), src, file }] } : it)));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (stepId) => {
    if (readOnly) return;
    // only open file picker if this step currently has no photo (limit 1 photo per step)
    const step = steps.find((s) => s.id === stepId);
    if (step && (step.photos || []).length > 0) return;
    const inp = inputsRef.current[stepId];
    if (inp) inp.click();
  };

  const removePhoto = (stepId, photoId) => {
    if (readOnly) return;
    setSteps((s) => s.map((it) => (it.id === stepId ? { ...it, photos: (it.photos || []).filter((p) => p.id !== photoId) } : it)));
  };

  // expose data and files via ref
  useImperativeHandle(ref, () => ({
    getData: () => {
      console.log('[RecipeGuide] getData called');
      const stepFiles = [];
      const payloadSteps = steps.map((step, idx) => {
        const ps = { description: step.text, step_number: idx + 1 };
        if (step.photos && step.photos.length > 0 && step.photos[0].file) {
          // remember this file and reference by index
          const fileIndex = stepFiles.length;
          stepFiles.push(step.photos[0].file);
          ps.fileIndex = fileIndex;
        }
        return ps;
      });
      return { time, steps: payloadSteps, stepFiles };
    }
  }));

  return (
    <section className="rg-root">
      <h3 className="rg-title">Instructions</h3>

  <TimeRequired value={time} onChange={setTime} readOnly={readOnly} error={errors?.prep_time} clearError={() => { if (errors?.prep_time) setErrors(prev => ({ ...prev, prep_time: '' })); }} />

      <div className="rg-steps">
        {steps.map((step, idx) => (
          <div className="rg-step" key={step.id}>
            <div className="rg-step-index">
              <div className="rg-step-number">{idx + 1}</div>
            </div>

            <div className="rg-step-body">
              {readOnly ? (
                <div className="rg-step-text--view">{step.text}</div>
              ) : (
                <textarea
                  className="rg-step-text"
                  placeholder="Describe this step..."
                  value={step.text}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                />
              )}

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
                    {!readOnly && <button type="button" className="rg-photo-delete" onClick={() => removePhoto(step.id, p.id)}>🗑</button>}
                  </div>
                ))}

                {/* Only show add button when there is no photo for this step (limit 1) */}
                {(!readOnly && (!(step.photos && step.photos.length) || (step.photos || []).length === 0)) && (
                  <div className="rg-photo-add" onClick={() => triggerFileInput(step.id)} title="Add photo">📷</div>
                )}
              </div>
            </div>
            {!readOnly && (
              <button
                type="button"
                className="rg-step-delete"
                title="Delete step"
                onClick={() => removeStep(step.id)}
              >
                🗑
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button type="button" className="rg-add-step" onClick={addStep}>
          <span className="plus">+</span> Add step
        </button>
      )}
    </section>
  );
}
