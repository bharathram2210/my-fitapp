// FitTrack Pro — shared UI primitives
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

// ─── Animated calorie ring ───────────────────────────────────────────────
export function CalorieRing({ value = 0, target = 2000, size = 220, stroke = 14, theme, label = 'kcal' }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.min(value / target, 1.2);
  const overshoot = value > target;
  const ringColor = overshoot ? theme.danger : theme.primary;

  const [drawn, setDrawn] = useState(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const fromD = drawn, fromS = shown;
    const toD = pct, toS = value;
    const dur = 700;
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setDrawn(fromD + (toD - fromD) * e);
      setShown(Math.round(fromS + (toS - fromS) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, target]);

  const gap = Math.max(0, C - drawn * C);
  const remaining = Math.max(0, target - shown);

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={ringColor} />
            <stop offset="100%" stopColor={theme.accent} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r}
          stroke={theme.line} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r}
          stroke="url(#ringGrad)" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={gap}
          style={{ transition: 'stroke 0.3s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <div style={{ fontSize: 12, color: theme.textMute, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
          {overshoot ? 'over by' : 'remaining'}
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: theme.text, fontFeatureSettings: '"tnum"', lineHeight: 1 }}>
          {overshoot ? (shown - target).toLocaleString() : remaining.toLocaleString()}
        </div>
        <div style={{ fontSize: 13, color: theme.textSoft, marginTop: 4 }}>
          <b style={{ color: theme.text, fontWeight: 600 }}>{shown.toLocaleString()}</b> / {target.toLocaleString()} {label}
        </div>
      </div>
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────
export function Btn({ children, onClick, kind = 'primary', theme, full, icon, style = {}, disabled }) {
  const base = {
    height: 52, padding: '0 22px',
    borderRadius: 14,
    fontSize: 15, fontWeight: 600,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'transform 0.12s ease, background 0.2s, opacity 0.2s',
    width: full ? '100%' : undefined,
    fontFamily: 'inherit',
    opacity: disabled ? 0.45 : 1,
    letterSpacing: -0.1,
    ...style,
  };
  const variants = {
    primary: { background: theme.primary, color: '#fff' },
    accent:  { background: theme.accent, color: theme.primaryInk },
    ghost:   { background: 'transparent', color: theme.text, border: `1.5px solid ${theme.lineStrong}` },
    soft:    { background: theme.surfaceAlt, color: theme.text },
    danger:  { background: theme.dangerSoft, color: theme.danger },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      style={{ ...base, ...variants[kind] }}
    >
      {icon}{children}
    </button>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────
export function Chip({ children, active, onClick, theme, color }) {
  const c = color || theme.primary;
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px',
      borderRadius: 999,
      background: active ? c : theme.chip,
      color: active ? (c === theme.accent ? theme.primaryInk : '#fff') : theme.text,
      border: 'none',
      fontSize: 13, fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'background 0.18s, color 0.18s',
    }}>{children}</button>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────
export function Card({ children, theme, style = {}, onClick, padding = 18 }) {
  return (
    <div onClick={onClick} style={{
      background: theme.bgElev,
      borderRadius: 22,
      padding,
      border: `1px solid ${theme.line}`,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ─── Ticker ──────────────────────────────────────────────────────────────
export function Ticker({ value, suffix, style = {} }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const from = v, to = value;
    if (from === to) return;
    const start = performance.now();
    const dur = 500;
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setV(from + (to - from) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const display = Number.isInteger(value) ? Math.round(v).toLocaleString() : v.toFixed(1);
  return <span style={{ fontFeatureSettings: '"tnum"', ...style }}>{display}{suffix}</span>;
}

// ─── Bottom sheet ────────────────────────────────────────────────────────
export function Sheet({ open, onClose, title, children, theme, height = 520 }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: theme.overlay,
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.25s', zIndex: 50,
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height, background: theme.bgElev,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 51,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.lineStrong }} />
        </div>
        {title && (
          <div style={{
            padding: '14px 22px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: theme.text }}>{title}</div>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: 18, border: 'none',
              background: theme.chip, color: theme.textSoft, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.X s={18}/></button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 22px 22px' }}>
          {children}
        </div>
      </div>
    </>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, theme, type = 'text', placeholder, suffix, prefix, autoFocus, style = {} }) {
  return (
    <div style={style}>
      {label && (
        <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: theme.surfaceAlt,
        borderRadius: 14,
        padding: '0 16px', height: 52,
        border: `1.5px solid transparent`,
        transition: 'border-color 0.2s',
      }}>
        {prefix && <span style={{ color: theme.textSoft, marginRight: 8, fontSize: 15 }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none', outline: 'none',
            fontSize: 16, color: theme.text,
            fontFamily: 'inherit', fontWeight: 500,
            minWidth: 0,
          }}
        />
        {suffix && <span style={{ color: theme.textSoft, marginLeft: 8, fontSize: 14, fontWeight: 600 }}>{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────
export function Toggle({ value, onChange, theme }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: value ? theme.primary : theme.lineStrong,
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 11, background: '#fff',
        position: 'absolute', top: 3, left: value ? 23 : 3,
        transition: 'left 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}/>
    </button>
  );
}

// ─── Phone status bar ────────────────────────────────────────────────────
export function PhoneStatus({ theme }) {
  const c = theme.statusFG;
  return (
    <div className="phone-status-bar" style={{
      height: 36, padding: '0 22px',
      alignItems: 'center', justifyContent: 'space-between',
      fontSize: 14, fontWeight: 600, color: c,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M1 7 4 4l3 3 8-7" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <svg width="14" height="11" viewBox="0 0 14 11"><path d="M2 6a7 7 0 0 1 10 0M4.5 8a4 4 0 0 1 5 0M7 10v0" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11"><rect x="1" y="1" width="18" height="9" rx="2.5" stroke={c} strokeWidth="1.2" fill="none"/><rect x="3" y="3" width="14" height="5" rx="1" fill={c}/><rect x="20" y="4" width="1.5" height="3" rx="0.5" fill={c}/></svg>
      </div>
    </div>
  );
}

// ─── Bottom nav ──────────────────────────────────────────────────────────
export function BottomNav({ tab, setTab, onAdd, theme }) {
  const items = [
    { k: 'today', label: 'Today', I: Icon.Home },
    { k: 'weekly', label: 'Weekly', I: Icon.Chart },
    { k: 'add', label: '', I: Icon.Plus, primary: true },
    { k: 'monthly', label: 'Monthly', I: Icon.Calendar },
    { k: 'profile', label: 'Profile', I: Icon.User },
  ];
  return (
    <div className="safe-bottom" style={{
      flexShrink: 0,
      background: theme.bgElev,
      borderTop: `1px solid ${theme.line}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        padding: '10px 12px 0',
      }}>
        {items.map(({ k, label, I, primary }) => {
          const active = tab === k;
          if (primary) {
            return (
              <button key={k} onClick={onAdd}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(-12px) scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-12px) scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-12px) scale(1)'}
                style={{
                  width: 60, height: 60, borderRadius: 24,
                  background: theme.primary, color: '#fff',
                  border: `4px solid ${theme.bgElev}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transform: 'translateY(-12px)',
                  transition: 'transform 0.15s',
                  boxShadow: `0 8px 20px ${theme.primary}55`,
                }}>
                <Icon.Plus s={26}/>
              </button>
            );
          }
          return (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, padding: '6px 0',
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? theme.primary : theme.textMute,
              transition: 'color 0.2s',
              fontFamily: 'inherit',
            }}>
              <I s={22} sw={active ? 2.2 : 1.8}/>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, letterSpacing: 0.2 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Logomark ────────────────────────────────────────────────────────────
export function Logomark({ theme, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: theme.primary, color: theme.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.5, letterSpacing: -1,
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path d="M5 12h3l2-6 4 12 2-6h3" stroke={theme.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
