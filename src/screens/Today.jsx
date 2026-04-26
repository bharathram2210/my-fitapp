// FitTrack Pro — Today screen + Add-Food and Gym sheets
import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { Btn, Card, CalorieRing, Chip, Field, Sheet, Ticker } from '../components/UI.jsx';

const MEAL_ICONS = { breakfast: Icon.Coffee, lunch: Icon.Bowl, dinner: Icon.Bowl, snack: Icon.Apple };
const MEAL_COLORS = (theme) => ({
  breakfast: theme.accent, lunch: theme.primary, dinner: '#7B5BAE', snack: theme.warn
});

export function ScreenToday({ theme, state, setState, name, target, openAdd, openGym }) {
  const totalKcal = state.foods.reduce((s, f) => s + f.kcal, 0);
  const remaining = target - totalKcal;
  const overshoot = totalKcal > target;
  const within = Math.abs(remaining) <= 100;
  const badgeBg = overshoot ? theme.dangerSoft : within ? theme.accentSoft : theme.primarySoft;
  const badgeC  = overshoot ? theme.danger     : within ? theme.warn       : theme.primary;
  const badgeT  = overshoot ? 'Over target'    : within ? 'On target'      : 'In deficit';

  const today = new Date();
  const dayStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const gymStatusMeta = {
    completed: { label: 'Done', c: theme.primary, bg: theme.primarySoft, I: Icon.Check },
    missed:    { label: 'Missed', c: theme.danger, bg: theme.dangerSoft, I: Icon.X },
    leave:     { label: 'Leave', c: theme.warn, bg: theme.accentSoft, I: Icon.Bell },
    rest:      { label: 'Rest', c: theme.textSoft, bg: theme.chip, I: Icon.Moon },
  };
  const gym = state.gymStatus ? gymStatusMeta[state.gymStatus] : null;

  const removeFood = (id) => {
    setState({ ...state, foods: state.foods.filter(f => f.id !== id) });
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: theme.bg, animation: 'ftFadeIn 0.3s' }}>
      {/* Header */}
      <div style={{ padding: '20px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textSoft, fontWeight: 500, letterSpacing: 0.2 }}>{dayStr}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: theme.text, letterSpacing: -0.5, marginTop: 2 }}>
            Hi, {name.split(' ')[0]}.
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 999,
          background: theme.accentSoft, color: theme.warn,
          fontSize: 13, fontWeight: 700,
        }}>
          <Icon.Flame s={16}/> {state.streak} day streak
        </div>
      </div>

      {/* Calorie ring card */}
      <div style={{ padding: '14px 18px 0' }}>
        <Card theme={theme} padding={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <CalorieRing value={totalKcal} target={target} theme={theme} size={220}/>
          <div style={{
            padding: '8px 14px', borderRadius: 999,
            background: badgeBg, color: badgeC,
            fontSize: 13, fontWeight: 700, letterSpacing: 0.2,
          }}>{badgeT}</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', paddingTop: 8, borderTop: `1px solid ${theme.line}`, marginTop: 4 }}>
            {[
              { label: 'Logged', val: <Ticker value={totalKcal}/>, sub: 'kcal' },
              { label: 'Target', val: target.toLocaleString(), sub: 'kcal' },
              { label: 'Meals', val: state.foods.length, sub: 'today' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginTop: 4, fontFeatureSettings: '"tnum"' }}>{m.val}</div>
                <div style={{ fontSize: 11, color: theme.textMute }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gym + Weight tiles */}
      <div style={{ padding: '14px 18px 0', display: 'flex', gap: 12 }}>
        <Card theme={theme} padding={16} onClick={openGym} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -8, right: -8, opacity: 0.06 }}>
            <Icon.Dumbbell s={86} c={theme.text}/>
          </div>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Gym today</div>
          {gym ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: gym.bg, color: gym.c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><gym.I s={20}/></div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>{gym.label}</div>
                <div style={{ fontSize: 12, color: theme.textSoft }}>Tap to change</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginTop: 10 }}>Not logged</div>
              <div style={{ fontSize: 12, color: theme.primary, fontWeight: 600, marginTop: 2 }}>Mark status →</div>
            </>
          )}
        </Card>
        <Card theme={theme} padding={16} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.06 }}>
            <Icon.Scale s={86} c={theme.text}/>
          </div>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Weight</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginTop: 8, fontFeatureSettings: '"tnum"' }}>
            {state.weight}<span style={{ fontSize: 13, color: theme.textSoft, marginLeft: 4, fontWeight: 600 }}>kg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Icon.Trend s={12} c={theme.success}/>
            <span style={{ fontSize: 12, color: theme.success, fontWeight: 600 }}>−1.4 from start</span>
          </div>
        </Card>
      </div>

      {/* Food log */}
      <div style={{ padding: '20px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, letterSpacing: -0.2 }}>Food log</div>
        <button onClick={openAdd} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: theme.primary, fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon.Plus s={16}/> Add
        </button>
      </div>
      <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.foods.length === 0 && (
          <div style={{
            background: theme.surface, borderRadius: 16, padding: 24, textAlign: 'center',
            border: `1px dashed ${theme.lineStrong}`,
          }}>
            <div style={{ fontSize: 14, color: theme.textSoft }}>No meals logged yet.</div>
            <button onClick={openAdd} style={{
              marginTop: 10, background: theme.primary, color: '#fff', border: 'none',
              padding: '10px 18px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>Log first meal</button>
          </div>
        )}
        {state.foods.map((f, i) => {
          const I = MEAL_ICONS[f.meal] || Icon.Bowl;
          const c = MEAL_COLORS(theme)[f.meal] || theme.primary;
          return (
            <div key={f.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: theme.bgElev, borderRadius: 16, padding: '12px 14px',
              border: `1px solid ${theme.line}`,
              animation: `ftSlideIn 0.3s ${i * 0.04}s both`,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: c + '22', color: c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><I s={20}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                <div style={{ fontSize: 12, color: theme.textSoft, textTransform: 'capitalize' }}>{f.meal} · {f.time}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, fontFeatureSettings: '"tnum"' }}>{f.kcal}</div>
                <div style={{ fontSize: 11, color: theme.textMute }}>kcal</div>
              </div>
              <button onClick={() => removeFood(f.id)} style={{
                width: 28, height: 28, borderRadius: 8, border: 'none',
                background: 'transparent', color: theme.textMute, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon.X s={16}/></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Add food sheet ──────────────────────────────────────────────────────
export function AddFoodSheet({ theme, open, onClose, onAdd, recent }) {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [meal, setMeal] = useState('lunch');

  useEffect(() => {
    if (open) { setName(''); setKcal(''); }
  }, [open]);

  const submit = () => {
    if (!name.trim() || !kcal) return;
    onAdd({ name: name.trim(), kcal: parseInt(kcal, 10), meal });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Log a meal" theme={theme} height={620}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 6 }}>
        <Field theme={theme} label="What did you eat?" value={name} onChange={setName} placeholder="e.g. Grilled chicken bowl" autoFocus={open}/>
        <Field theme={theme} label="Calories" value={kcal} onChange={setKcal} placeholder="0" suffix="kcal" type="number"/>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Meal</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['breakfast','lunch','dinner','snack'].map(m => (
              <Chip key={m} active={meal === m} onClick={() => setMeal(m)} theme={theme}>
                <span style={{ textTransform: 'capitalize' }}>{m}</span>
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Quick add</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.map((r, i) => (
              <button key={i} onClick={() => { setName(r.name); setKcal(String(r.kcal)); }} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 12,
                background: theme.surfaceAlt, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>{r.name}</span>
                <span style={{ fontSize: 13, color: theme.textSoft, fontWeight: 600, fontFeatureSettings: '"tnum"' }}>{r.kcal} kcal</span>
              </button>
            ))}
          </div>
        </div>

        <Btn theme={theme} kind="primary" full onClick={submit} disabled={!name.trim() || !kcal} style={{ marginTop: 8 }}>
          Add to log
        </Btn>
      </div>
    </Sheet>
  );
}

// ─── Gym status sheet ────────────────────────────────────────────────────
export function GymSheet({ theme, open, onClose, current, onSet }) {
  const opts = [
    { k: 'completed', label: 'Done',     desc: 'Hit the gym today',              c: theme.primary,  bg: theme.primarySoft, I: Icon.Check },
    { k: 'leave',     label: 'Leave',    desc: 'Rest, illness, travel — planned', c: theme.warn,    bg: theme.accentSoft,  I: Icon.Bell  },
    { k: 'missed',    label: 'Missed',   desc: 'Skipped without plan',           c: theme.danger,   bg: theme.dangerSoft,  I: Icon.X     },
    { k: 'rest',      label: 'Rest day', desc: 'Off-day on schedule',            c: theme.textSoft, bg: theme.chip,        I: Icon.Moon  },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Today's gym status" theme={theme} height={460}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6 }}>
        {opts.map(o => {
          const active = current === o.k;
          return (
            <button key={o.k} onClick={() => { onSet(o.k); onClose(); }} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, borderRadius: 16,
              background: active ? o.bg : theme.surfaceAlt,
              border: active ? `2px solid ${o.c}` : `2px solid transparent`,
              cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit', transition: 'all 0.18s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: o.bg, color: o.c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><o.I s={22}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{o.label}</div>
                <div style={{ fontSize: 13, color: theme.textSoft }}>{o.desc}</div>
              </div>
              {active && <div style={{ color: o.c }}><Icon.Check s={20}/></div>}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
