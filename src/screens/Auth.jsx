// FitTrack Pro — Auth & Onboarding screens
import React, { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { Btn, Chip, Field, Logomark, Toggle } from '../components/UI.jsx';

export function ScreenLogin({ theme, onLogin }) {
  const [email, setEmail] = useState('bharath@fittrack.app');
  const [pw, setPw] = useState('••••••••');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => onLogin(), 700);
  };

  return (
    <div style={{
      flex: 1, padding: '32px 26px 20px',
      display: 'flex', flexDirection: 'column',
      background: theme.bg,
      animation: 'ftFadeIn 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
        <Logomark theme={theme} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>FitTrack Pro</div>
          <div style={{ fontSize: 12, color: theme.textSoft }}>One app. One minute a day.</div>
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: theme.text, lineHeight: 1.1, letterSpacing: -0.8, marginBottom: 8 }}>
          Welcome back.
        </div>
        <div style={{ fontSize: 15, color: theme.textSoft, lineHeight: 1.5 }}>
          Pick up your streak. Your last log was <b style={{ color: theme.text }}>yesterday at 9:12 PM</b>.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field theme={theme} label="Email" value={email} onChange={setEmail} type="email" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
            Password
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: theme.surfaceAlt, borderRadius: 14,
            padding: '0 16px', height: 52,
          }}>
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 16, color: theme.text, fontFamily: 'inherit', fontWeight: 500,
              }}
            />
            <button onClick={() => setShow(!show)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: theme.textSoft, padding: 4,
            }}>{show ? <Icon.EyeOff s={20}/> : <Icon.Eye s={20}/>}</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right', marginTop: 12, marginBottom: 28 }}>
        <a style={{ fontSize: 13, color: theme.primary, fontWeight: 600 }}>Forgot password?</a>
      </div>

      <Btn theme={theme} kind="primary" full onClick={submit} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Btn>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0',
        color: theme.textMute, fontSize: 12, fontWeight: 600, letterSpacing: 0.6,
      }}>
        <div style={{ flex: 1, height: 1, background: theme.line }}/>
        OR
        <div style={{ flex: 1, height: 1, background: theme.line }}/>
      </div>

      <Btn theme={theme} kind="ghost" full icon={<Icon.Apple s={20}/>} onClick={submit}>
        Continue with Apple
      </Btn>

      <div style={{ flex: 1 }}/>
      <div style={{ textAlign: 'center', fontSize: 14, color: theme.textSoft, paddingTop: 16 }}>
        New here?{' '}
        <span onClick={() => onLogin('onboard')} style={{ color: theme.primary, fontWeight: 700, cursor: 'pointer' }}>
          Create account
        </span>
      </div>
    </div>
  );
}

// ─── Onboarding (5 steps) ────────────────────────────────────────────────
export function ScreenOnboard({ theme, onDone, name, setName }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ age: '28', height: '178', weight: '82', goal: '76', activity: 'moderate' });
  const [target, setTarget] = useState(2000);
  const [gymDays, setGymDays] = useState(['Mon','Tue','Thu','Fri','Sat']);
  const [monthlyTarget, setMonthlyTarget] = useState(22);
  const [notif, setNotif] = useState({ daily: true, gym: true, weekly: true });

  const steps = ['Profile', 'Target', 'Schedule', 'Reminders', 'Ready'];

  const next = () => (step < 4 ? setStep(step + 1) : onDone());
  const back = () => step > 0 && setStep(step - 1);

  const toggleDay = (d) => {
    setGymDays(gymDays.includes(d) ? gymDays.filter(x => x !== d) : [...gymDays, d]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={step === 0 ? undefined : back} style={{
          width: 40, height: 40, borderRadius: 20, border: 'none',
          background: theme.chip, color: theme.text, cursor: step === 0 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: step === 0 ? 0.4 : 1,
        }}><Icon.Back s={20}/></button>
        <div style={{ fontSize: 13, color: theme.textSoft, fontWeight: 600 }}>
          Step {step + 1} of {steps.length}
        </div>
        <button onClick={onDone} style={{
          background: 'transparent', border: 'none', color: theme.textSoft,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Skip</button>
      </div>
      {/* Progress */}
      <div style={{ padding: '0 22px 18px', display: 'flex', gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? theme.primary : theme.line,
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>

      <div key={step} style={{ flex: 1, padding: '8px 26px 16px', overflow: 'auto', animation: 'ftSlideIn 0.32s ease' }}>
        {step === 0 && (
          <>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, lineHeight: 1.15, letterSpacing: -0.6 }}>
              Tell us about you.
            </div>
            <div style={{ fontSize: 14, color: theme.textSoft, marginTop: 6, marginBottom: 24 }}>
              We use this to suggest a daily calorie target.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field theme={theme} label="Name" value={name} onChange={setName} placeholder="Your name" />
              <div style={{ display: 'flex', gap: 12 }}>
                <Field theme={theme} label="Age" value={profile.age} onChange={(v) => setProfile({...profile, age: v})} suffix="yrs" style={{ flex: 1 }}/>
                <Field theme={theme} label="Height" value={profile.height} onChange={(v) => setProfile({...profile, height: v})} suffix="cm" style={{ flex: 1 }}/>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Field theme={theme} label="Current weight" value={profile.weight} onChange={(v) => setProfile({...profile, weight: v})} suffix="kg" style={{ flex: 1 }}/>
                <Field theme={theme} label="Goal weight" value={profile.goal} onChange={(v) => setProfile({...profile, goal: v})} suffix="kg" style={{ flex: 1 }}/>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Activity</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['light','moderate','active','very active'].map(a => (
                    <Chip key={a} active={profile.activity === a} onClick={() => setProfile({...profile, activity: a})} theme={theme}>{a}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, lineHeight: 1.15, letterSpacing: -0.6 }}>
              Daily calorie target.
            </div>
            <div style={{ fontSize: 14, color: theme.textSoft, marginTop: 6, marginBottom: 28 }}>
              Based on your TDEE, we suggest <b style={{ color: theme.text }}>2,140 kcal</b>. Adjust if you want a steeper deficit.
            </div>
            <div style={{
              background: theme.bgElev, borderRadius: 22, padding: 28,
              border: `1px solid ${theme.line}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
            }}>
              <div style={{ fontSize: 12, color: theme.textSoft, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>Daily target</div>
              <div style={{ fontSize: 64, fontWeight: 700, color: theme.text, fontFeatureSettings: '"tnum"', lineHeight: 1, letterSpacing: -2 }}>
                {target.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: theme.textSoft }}>kcal / day</div>
              <input type="range" min="1400" max="3200" step="50" value={target} onChange={(e) => setTarget(+e.target.value)}
                style={{ width: '100%', accentColor: theme.primary }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 12, color: theme.textMute }}>
                <span>1,400</span><span>3,200</span>
              </div>
              <div style={{
                marginTop: 4, padding: '8px 14px', borderRadius: 10,
                background: theme.primarySoft, color: theme.primary,
                fontSize: 13, fontWeight: 600,
              }}>
                ~{Math.round((2140 - target) * 7 / 7700 * 10) / 10} kg / week deficit
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, lineHeight: 1.15, letterSpacing: -0.6 }}>
              Gym schedule.
            </div>
            <div style={{ fontSize: 14, color: theme.textSoft, marginTop: 6, marginBottom: 24 }}>
              Pick your training days. We'll auto-plan the month.
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => {
                const on = gymDays.includes(d);
                return (
                  <button key={d} onClick={() => toggleDay(d)} style={{
                    flex: 1, height: 64, borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: on ? theme.primary : theme.surfaceAlt,
                    color: on ? '#fff' : theme.textSoft,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                    fontFamily: 'inherit', transition: 'background 0.2s',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{d.slice(0,1)}</div>
                    {on && <Icon.Check s={16}/>}
                  </button>
                );
              })}
            </div>
            <div style={{
              background: theme.bgElev, borderRadius: 22, padding: 22, border: `1px solid ${theme.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 13, color: theme.textSoft, fontWeight: 600 }}>Monthly target</div>
                <div style={{ fontSize: 14, color: theme.textMute }}>Sessions you commit to</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={() => setMonthlyTarget(Math.max(8, monthlyTarget - 1))} style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: theme.chip, color: theme.text, cursor: 'pointer', fontSize: 18 }}>−</button>
                <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, fontFeatureSettings: '"tnum"', minWidth: 36, textAlign: 'center' }}>{monthlyTarget}</div>
                <button onClick={() => setMonthlyTarget(Math.min(31, monthlyTarget + 1))} style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: theme.chip, color: theme.text, cursor: 'pointer', fontSize: 18 }}>+</button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, lineHeight: 1.15, letterSpacing: -0.6 }}>
              Reminders.
            </div>
            <div style={{ fontSize: 14, color: theme.textSoft, marginTop: 6, marginBottom: 24 }}>
              Gentle nudges, never spam.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { k: 'daily', title: 'Daily log reminder', sub: '9:00 PM if no entry yet', I: Icon.Bell },
                { k: 'gym', title: 'Gym day morning', sub: '7:30 AM on training days', I: Icon.Dumbbell },
                { k: 'weekly', title: 'Weekly summary', sub: 'Sunday night recap', I: Icon.Trend },
              ].map(({ k, title, sub, I }) => (
                <div key={k} style={{
                  background: theme.bgElev, borderRadius: 18, padding: 16,
                  border: `1px solid ${theme.line}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: theme.primarySoft, color: theme.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><I s={22}/></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{title}</div>
                    <div style={{ fontSize: 13, color: theme.textSoft }}>{sub}</div>
                  </div>
                  <Toggle theme={theme} value={notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })}/>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 120, height: 120, borderRadius: 60,
              background: theme.primarySoft, color: theme.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 28, animation: 'ftPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <Icon.Check s={56} sw={2.5}/>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: theme.text, letterSpacing: -0.6, marginBottom: 10 }}>
              You're set, {name.split(' ')[0]}.
            </div>
            <div style={{ fontSize: 15, color: theme.textSoft, lineHeight: 1.5, maxWidth: 280 }}>
              Target <b style={{ color: theme.text }}>{target.toLocaleString()} kcal</b>, gym <b style={{ color: theme.text }}>{monthlyTarget}× this month</b>. Let's log your first meal.
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 26px 20px' }}>
        <Btn theme={theme} kind="primary" full onClick={next}>
          {step === 4 ? 'Open dashboard' : 'Continue'}
        </Btn>
      </div>
    </div>
  );
}
