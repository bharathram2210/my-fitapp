// FitTrack Pro — Weekly, Monthly, Profile
import React from 'react';
import { Icon } from '../components/Icons.jsx';
import { Card, Ticker, Toggle } from '../components/UI.jsx';

export function ScreenWeekly({ theme, target, weekData }) {
  const totalSessions = weekData.filter(d => d.status === 'completed').length;
  const missedCount   = weekData.filter(d => d.status === 'missed').length;
  const leaveCount    = weekData.filter(d => d.status === 'leave').length;
  const loggedDays    = weekData.filter(d => d.kcal > 0);
  const avgKcal       = Math.round(loggedDays.reduce((s,d)=>s+d.kcal,0) / Math.max(1, loggedDays.length));
  const avgDeficit    = target - avgKcal;
  const score = Math.round((totalSessions / 5) * 50 + (avgKcal <= target ? 50 : Math.max(0, 50 - (avgKcal - target) / 10)));
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'E';

  const maxBar = Math.max(target, ...weekData.map(d => d.kcal)) * 1.05;

  const statusColor = {
    completed: theme.primary, missed: theme.danger, leave: theme.warn, rest: theme.textMute
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: theme.bg, animation: 'ftFadeIn 0.3s' }}>
      <div style={{ padding: '20px 22px 8px' }}>
        <div style={{ fontSize: 13, color: theme.textSoft, fontWeight: 500 }}>This week</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>Weekly review</div>
      </div>

      {/* Score card */}
      <div style={{ padding: '8px 18px 0' }}>
        <Card theme={theme} padding={20} style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryInk} 100%)`,
          color: '#fff', border: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Weekly score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <div style={{ fontSize: 56, fontWeight: 700, fontFeatureSettings: '"tnum"', lineHeight: 1, letterSpacing: -2 }}>{score}</div>
                <div style={{ fontSize: 16, opacity: 0.7, fontWeight: 600 }}>/100</div>
              </div>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
                {totalSessions} sessions · avg {avgKcal} kcal · {avgDeficit > 0 ? `${avgDeficit} deficit` : `${-avgDeficit} surplus`}
              </div>
            </div>
            <div style={{
              width: 78, height: 78, borderRadius: 24,
              background: theme.accent, color: theme.primaryInk,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, fontWeight: 800, letterSpacing: -2,
              animation: 'ftPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>{grade}</div>
          </div>
        </Card>
      </div>

      {/* Calorie bar chart */}
      <div style={{ padding: '14px 18px 0' }}>
        <Card theme={theme} padding={18}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Calories</div>
            <div style={{ fontSize: 12, color: theme.textSoft }}>Goal {target.toLocaleString()}</div>
          </div>
          <div style={{ position: 'relative', height: 160, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              position: 'absolute', left: 0, right: 0,
              bottom: `${(target / maxBar) * 100}%`,
              borderTop: `1.5px dashed ${theme.lineStrong}`,
              zIndex: 1, pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute', right: 0, top: -18,
                fontSize: 10, color: theme.textMute, fontWeight: 600,
                background: theme.bgElev, padding: '0 4px',
              }}>Goal</div>
            </div>
            {weekData.map((d, i) => {
              const h = (d.kcal / maxBar) * 100;
              const over = d.kcal > target;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 10, color: theme.textMute, fontWeight: 600, fontFeatureSettings: '"tnum"' }}>{d.kcal || '—'}</div>
                  <div style={{
                    width: '100%', borderRadius: 8,
                    background: d.kcal === 0 ? theme.line : (over ? theme.danger : theme.primary),
                    height: `${h}%`, minHeight: d.kcal ? 4 : 0,
                    animation: `ftBarRise 0.6s ${i * 0.06}s both`,
                    transformOrigin: 'bottom',
                  }}/>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: theme.textSoft, fontWeight: 600 }}>{d.day}</div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gym heatmap */}
      <div style={{ padding: '14px 18px 0' }}>
        <Card theme={theme} padding={18}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Gym attendance</div>
            <div style={{ fontSize: 12, color: theme.textSoft }}>{totalSessions} done · {missedCount} missed · {leaveCount} leave</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 50, borderRadius: 12,
                  background: statusColor[d.status] || theme.line,
                  opacity: d.status === 'rest' ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                  animation: `ftPop 0.4s ${i * 0.05}s both`,
                }}>
                  {d.status === 'completed' && <Icon.Check s={18}/>}
                  {d.status === 'missed' && <Icon.X s={18}/>}
                  {d.status === 'leave' && <Icon.Bell s={16}/>}
                  {d.status === 'rest' && <Icon.Moon s={16}/>}
                </div>
                <div style={{ fontSize: 11, color: theme.textSoft, fontWeight: 600, marginTop: 6 }}>{d.day}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Highlights */}
      <div style={{ padding: '14px 18px 24px', display: 'flex', gap: 12 }}>
        <Card theme={theme} padding={16} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Best day</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginTop: 6 }}>Wednesday</div>
          <div style={{ fontSize: 12, color: theme.success, fontWeight: 600, marginTop: 2 }}>−380 deficit · gym ✓</div>
        </Card>
        <Card theme={theme} padding={16} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Weight Δ</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginTop: 6 }}>−0.6 kg</div>
          <div style={{ fontSize: 12, color: theme.success, fontWeight: 600, marginTop: 2 }}>This week</div>
        </Card>
      </div>
    </div>
  );
}

// ─── Monthly ─────────────────────────────────────────────────────────────
export function ScreenMonthly({ theme, monthlyTarget, calendar, weightSeries }) {
  const completed = calendar.filter(d => d.status === 'completed').length;
  const leave     = calendar.filter(d => d.status === 'leave').length;
  const compliance = Math.round((completed / Math.max(1, monthlyTarget - leave)) * 100);
  const today = 18;

  const statusColor = {
    completed: theme.primary, missed: theme.danger, leave: theme.warn, rest: theme.surfaceAlt, none: theme.surface
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: theme.bg, animation: 'ftFadeIn 0.3s' }}>
      <div style={{ padding: '20px 22px 8px' }}>
        <div style={{ fontSize: 13, color: theme.textSoft, fontWeight: 500 }}>April 2026</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>Monthly view</div>
      </div>

      {/* Compliance hero */}
      <div style={{ padding: '8px 18px 0', display: 'flex', gap: 12 }}>
        <Card theme={theme} padding={18} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Compliance</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
            <Ticker value={compliance} style={{ fontSize: 38, fontWeight: 700, color: theme.text, letterSpacing: -1 }}/>
            <span style={{ fontSize: 18, color: theme.textSoft, fontWeight: 700 }}>%</span>
          </div>
          <div style={{ fontSize: 12, color: theme.textSoft, marginTop: 2 }}>{completed}/{monthlyTarget} sessions</div>
          <div style={{ height: 6, background: theme.line, borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${Math.min(100, compliance)}%`,
              background: theme.primary,
              borderRadius: 3, transition: 'width 0.6s ease',
            }}/>
          </div>
        </Card>
        <Card theme={theme} padding={18} style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: theme.textMute, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Weight Δ</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: theme.text, letterSpacing: -1, fontFeatureSettings: '"tnum"' }}>−2.1</span>
            <span style={{ fontSize: 18, color: theme.textSoft, fontWeight: 700 }}>kg</span>
          </div>
          <div style={{ fontSize: 12, color: theme.success, fontWeight: 600, marginTop: 2 }}>On track for goal</div>
          <svg width="100%" height="32" viewBox="0 0 100 32" style={{ marginTop: 6 }}>
            <polyline
              fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              points={weightSeries.map((w, i) => `${(i / (weightSeries.length - 1)) * 100},${32 - ((w - 79) / 4) * 32}`).join(' ')}
            />
          </svg>
        </Card>
      </div>

      {/* Calendar grid */}
      <div style={{ padding: '14px 18px 0' }}>
        <Card theme={theme} padding={18}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Calendar</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: theme.textSoft, fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: theme.primary }}/>Done</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: theme.danger }}/>Miss</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: theme.warn }}/>Leave</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 10, color: theme.textMute, fontWeight: 700 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {[0,1].map(i => <div key={'b'+i}/>)}
            {calendar.map((d, i) => {
              const isToday = d.day === today;
              const c = statusColor[d.status || 'none'];
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: 8,
                  background: c,
                  border: isToday ? `2px solid ${theme.text}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  color: ['completed','missed'].includes(d.status) ? '#fff' : (d.status === 'leave' ? theme.primaryInk : theme.textSoft),
                  animation: `ftPop 0.3s ${i * 0.012}s both`,
                }}>{d.day}</div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Calorie trend */}
      <div style={{ padding: '14px 18px 24px' }}>
        <Card theme={theme} padding={18}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 12 }}>30-day calories</div>
          <CalorieTrend theme={theme} target={2000}/>
        </Card>
      </div>
    </div>
  );
}

function CalorieTrend({ theme, target }) {
  const data = Array.from({ length: 30 }, (_, i) => 1700 + Math.sin(i / 3) * 280 + Math.cos(i) * 100 + (i > 25 ? -120 : 0));
  const max = Math.max(...data, target) * 1.05;
  const min = Math.min(...data) * 0.9;
  const W = 100, H = 60;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min)) * H}`);
  const targetY = H - ((target - min) / (max - min)) * H;
  const moving = data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - 4), i + 1);
    return slice.reduce((s, x) => s + x, 0) / slice.length;
  });
  const mvPts = moving.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min)) * H}`);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 140, display: 'block' }}>
        <line x1="0" x2={W} y1={targetY} y2={targetY} stroke={theme.lineStrong} strokeWidth="0.4" strokeDasharray="1.5 1.5"/>
        <polyline fill="none" stroke={theme.line} strokeWidth="0.6" points={pts.join(' ')}/>
        <polyline fill="none" stroke={theme.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" points={mvPts.join(' ')}/>
        <polygon fill={theme.primary} fillOpacity="0.08" points={`0,${H} ${mvPts.join(' ')} ${W},${H}`}/>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textMute, marginTop: 8 }}>
        <span>Apr 1</span><span>Apr 15</span><span>Apr 30</span>
      </div>
    </div>
  );
}

// ─── Profile ─────────────────────────────────────────────────────────────
const ACCENT_SWATCHES = {
  amber: '#E8B84F',
  rust:  '#D9633C',
  ochre: '#C29A2C',
  sage:  '#7BA77F',
  clay:  '#B8755A',
};

export function ScreenProfile({ theme, prefs, setPref, onLogout, weight, onWeightChange }) {
  const name = prefs.userName;
  const target = prefs.calorieTarget;
  const monthlyTarget = prefs.monthlyTarget;

  return (
    <div style={{ flex: 1, overflow: 'auto', background: theme.bg, animation: 'ftFadeIn 0.3s' }}>
      <div style={{ padding: '24px 22px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 24,
          background: theme.primary, color: theme.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 700, letterSpacing: -1,
          flexShrink: 0,
        }}>{name.trim().split(/\s+/).map(s => s[0]).slice(0,2).join('').toUpperCase() || 'FT'}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: -0.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ fontSize: 13, color: theme.textSoft }}>Member since Jan 2026 · 92 days logged</div>
        </div>
      </div>

      <div style={{ padding: '0 18px', display: 'flex', gap: 10 }}>
        {[
          { label: 'Streak', val: '12',  sub: 'days',     I: Icon.Flame,    c: theme.warn },
          { label: 'Total',  val: '47',  sub: 'sessions', I: Icon.Dumbbell, c: theme.primary },
          { label: 'Lost',   val: '3.2', sub: 'kg',       I: Icon.Trophy,   c: theme.accent },
        ].map((s, i) => (
          <Card theme={theme} key={i} padding={14} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: s.c + '22', color: s.c,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
            }}><s.I s={20}/></div>
            <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, fontFeatureSettings: '"tnum"', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: theme.textSoft, marginTop: 2 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      <Section theme={theme} title="Preferences">
        <SettingsRow
          theme={theme}
          label="Dark mode"
          trailing={<Toggle theme={theme} value={prefs.dark} onChange={(v) => setPref('dark', v)}/>}
        />
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 15, color: theme.text, fontWeight: 500, marginBottom: 12 }}>Accent color</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(ACCENT_SWATCHES).map(([key, color]) => {
              const active = prefs.accent === key;
              return (
                <button key={key} onClick={() => setPref('accent', key)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 999,
                  border: `1.5px solid ${active ? theme.text : theme.line}`,
                  background: active ? theme.surfaceAlt : 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 600,
                  color: theme.text, textTransform: 'capitalize',
                }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: color, border: `1px solid ${theme.line}` }}/>
                  {key}
                </button>
              );
            })}
          </div>
        </div>
        <EditableRow
          theme={theme}
          label="Display name"
          value={name}
          onCommit={(v) => setPref('userName', (v || 'FitTrack').slice(0, 40))}
        />
        <NumberRow
          theme={theme}
          label="Daily calorie target"
          value={target}
          suffix="kcal"
          min={1200} max={4000} step={50}
          onChange={(v) => setPref('calorieTarget', v)}
        />
        <NumberRow
          theme={theme}
          label="Current weight"
          value={weight}
          suffix="kg"
          min={30} max={250} step={0.1}
          decimals={1}
          onChange={onWeightChange}
        />
        <NumberRow
          theme={theme}
          label="Monthly gym target"
          value={monthlyTarget}
          suffix="sessions"
          min={4} max={31} step={1}
          onChange={(v) => setPref('monthlyTarget', v)}
        />
      </Section>

      <Section theme={theme} title="Reminders">
        <SettingsRow theme={theme} label="Daily log reminder" trailing={<Toggle theme={theme} value={true} onChange={() => {}}/>}/>
        <SettingsRow theme={theme} label="Gym morning push" trailing={<Toggle theme={theme} value={true} onChange={() => {}}/>}/>
        <SettingsRow theme={theme} label="Weekly summary" trailing={<Toggle theme={theme} value={true} onChange={() => {}}/>}/>
      </Section>

      <Section theme={theme} title="Account">
        <SettingsRow theme={theme} label="Saved foods library" value="14 items"/>
        <SettingsRow theme={theme} label="Export data" value="CSV / PDF"/>
        <SettingsRow theme={theme} label="Privacy" value="Local only"/>
      </Section>

      <div style={{ padding: '8px 22px 24px' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: '14px 0',
          background: theme.dangerSoft, color: theme.danger,
          border: 'none', borderRadius: 14, cursor: 'pointer',
          fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
        }}>Sign out</button>
        <div style={{ textAlign: 'center', fontSize: 11, color: theme.textMute, marginTop: 14 }}>
          FitTrack Pro v1.0
        </div>
      </div>
    </div>
  );
}

function EditableRow({ theme, label, value, onCommit }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  const commit = () => { setEditing(false); if (draft !== value) onCommit(draft); };
  return (
    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ fontSize: 15, color: theme.text, fontWeight: 500, flexShrink: 0 }}>{label}</div>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
          style={{
            flex: 1, minWidth: 0, textAlign: 'right',
            background: 'transparent', border: 'none', outline: 'none',
            color: theme.text, fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <button onClick={() => setEditing(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: theme.textSoft, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: '60%',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
    </div>
  );
}

function NumberRow({ theme, label, value, suffix, min, max, step, decimals = 0, onChange }) {
  const clamp = (v) => Math.max(min, Math.min(max, parseFloat(v.toFixed(decimals))));
  const dec = () => onChange(clamp(value - step));
  const inc = () => onChange(clamp(value + step));
  const display = decimals > 0 ? value.toFixed(decimals) : value.toLocaleString();
  const btnStyle = (disabled) => ({
    width: 32, height: 32, borderRadius: 10,
    border: `1px solid ${theme.line}`,
    background: disabled ? 'transparent' : theme.surfaceAlt,
    color: disabled ? theme.textMute : theme.text,
    cursor: disabled ? 'default' : 'pointer',
    fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });
  return (
    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <div style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={dec} disabled={value <= min} style={btnStyle(value <= min)}>−</button>
        <div style={{ minWidth: 72, textAlign: 'center', fontSize: 14, fontWeight: 700, color: theme.text, fontFeatureSettings: '"tnum"' }}>
          {display}<span style={{ fontSize: 11, color: theme.textSoft, marginLeft: 4, fontWeight: 600 }}>{suffix}</span>
        </div>
        <button onClick={inc} disabled={value >= max} style={btnStyle(value >= max)}>+</button>
      </div>
    </div>
  );
}

function Section({ theme, title, children }) {
  return (
    <div style={{ padding: '20px 18px 0' }}>
      <div style={{ fontSize: 12, color: theme.textMute, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{title}</div>
      <Card theme={theme} padding={0}>
        {React.Children.map(children, (c, i) => (
          <div style={{ borderTop: i === 0 ? 'none' : `1px solid ${theme.line}` }}>{c}</div>
        ))}
      </Card>
    </div>
  );
}

function SettingsRow({ theme, label, value, trailing }) {
  return (
    <div style={{
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: 'pointer',
    }}>
      <div style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{label}</div>
      {trailing || (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.textSoft, fontSize: 14, fontWeight: 600 }}>
          {value}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
    </div>
  );
}
