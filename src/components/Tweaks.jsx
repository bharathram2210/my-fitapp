// Minimal "Tweaks" panel — lets you fiddle with dark mode, accent, name, targets, route
import React, { useState } from 'react';

export function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = (key, val) => setValues(prev => ({ ...prev, [key]: val }));
  return [values, setTweak];
}

export function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 2147483646,
        padding: '8px 14px', borderRadius: 999,
        background: 'rgba(250,249,247,.92)', color: '#29261b',
        border: '0.5px solid rgba(0,0,0,.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,.15)',
        fontFamily: 'ui-sans-serif,system-ui,-apple-system,sans-serif',
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
      }}>⚙ Tweaks</button>
    );
  }
  return (
    <div className="twk-panel">
      <div className="twk-hd">
        <b>{title}</b>
        <button className="twk-x" onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  );
}

export function TweakSection({ label }) {
  return <div className="twk-sect">{label}</div>;
}

export function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
        role="switch" aria-checked={!!value} onClick={() => onChange(!value)}>
        <i />
      </button>
    </div>
  );
}

export function TweakSelect({ label, value, options, onChange }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function TweakText({ label, value, onChange }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <input className="twk-field" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TweakNumber({ label, value, min, max, step = 1, onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl">{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(clamp(Number(e.target.value)))} />
    </div>
  );
}

export function TweakRadio({ label, value, options, onChange }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <div className="twk-seg">
        {options.map(o => (
          <button key={o} type="button" aria-checked={o === value} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
