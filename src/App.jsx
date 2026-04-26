// FitTrack Pro — main app shell
import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from './theme/theme.js';
import { BottomNav, PhoneStatus } from './components/UI.jsx';
import { ScreenLogin, ScreenOnboard } from './screens/Auth.jsx';
import { AddFoodSheet, GymSheet, ScreenToday } from './screens/Today.jsx';
import { ScreenMonthly, ScreenProfile, ScreenWeekly } from './screens/Analytics.jsx';

// ── localStorage helpers ─────────────────────────────────────────────────
function lsGet(key, defaults) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    return Array.isArray(defaults) ? saved : { ...defaults, ...saved };
  } catch { return defaults; }
}

function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Per-account key helpers ──────────────────────────────────────────────
const AUTH_KEY = 'fittrack.auth.v1';           // { email, loggedIn }
const ACCOUNTS_KEY = 'fittrack.accounts.v1';  // { [email]: { prefs, appState } }

function accountPrefsKey(email) { return `fittrack.prefs.${email}`; }
function accountStateKey(email) { return `fittrack.state.${email}`; }

const PREF_DEFAULTS = {
  dark: false,
  accent: 'amber',
  userName: '',
  calorieTarget: 2000,
  monthlyTarget: 22,
};

const makeAppStateDefaults = () => ({
  foods: [],
  gymStatus: null,
  weight: 80,
  streak: 0,
});

function loadSession() {
  // Returns { email, route } or null
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    if (auth.loggedIn && auth.email) {
      const route = onboardingDone(auth.email) ? 'app' : 'onboard';
      return { email: auth.email, route };
    }
  } catch {}
  return null;
}

function accountExists(email) {
  const accounts = lsGet(ACCOUNTS_KEY, {});
  return !!accounts[email];
}

function onboardingDone(email) {
  const accounts = lsGet(ACCOUNTS_KEY, {});
  return accounts[email] === 'done';
}

function registerAccount(email) {
  const accounts = lsGet(ACCOUNTS_KEY, {});
  // only register if not already present — don't overwrite 'done'
  if (!accounts[email]) accounts[email] = 'pending';
  lsSet(ACCOUNTS_KEY, accounts);
}

export default function App() {
  // Restore session on mount
  const session = loadSession();
  const [currentEmail, setCurrentEmail] = useState(() => session?.email ?? null);
  const [route, setRoute] = useState(() => session ? session.route : 'login');
  const [tab, setTab] = useState('today');

  // Per-account prefs
  const [prefs, setPrefsRaw] = useState(() =>
    session?.email ? lsGet(accountPrefsKey(session.email), PREF_DEFAULTS) : PREF_DEFAULTS
  );
  const setPref = (key, val) => {
    setPrefsRaw(p => {
      const next = { ...p, [key]: val };
      if (currentEmail) lsSet(accountPrefsKey(currentEmail), next);
      return next;
    });
  };

  // Per-account app state
  const [appState, setAppStateRaw] = useState(() =>
    session?.email ? lsGet(accountStateKey(session.email), makeAppStateDefaults()) : makeAppStateDefaults()
  );
  const appStateRef = useRef(appState);
  const emailRef = useRef(currentEmail);

  const setAppState = useCallback((next) => {
    const val = typeof next === 'function' ? next(appStateRef.current) : next;
    appStateRef.current = val;
    if (emailRef.current) lsSet(accountStateKey(emailRef.current), val);
    setAppStateRaw(val);
  }, []);

  const theme = useTheme(prefs.dark ? 'dark' : 'light', prefs.accent);

  // Switch into an account's data
  const loadAccount = (email) => {
    const p = lsGet(accountPrefsKey(email), PREF_DEFAULTS);
    const s = lsGet(accountStateKey(email), makeAppStateDefaults());
    setCurrentEmail(email);
    emailRef.current = email;
    setPrefsRaw(p);
    setAppStateRaw(s);
    appStateRef.current = s;
    lsSet(AUTH_KEY, { loggedIn: true, email });
  };

  const handleLogin = ({ email, password, signup } = {}) => {
    if (signup) { setRoute('onboard'); return; }
    if (!email) return;

    if (!accountExists(email)) {
      // New account — register as pending, go through onboarding first
      registerAccount(email);
      loadAccount(email);
      lsSet(AUTH_KEY, { loggedIn: true, email });
      setRoute('onboard');
    } else if (!onboardingDone(email)) {
      // Account exists but onboarding was never finished
      loadAccount(email);
      lsSet(AUTH_KEY, { loggedIn: true, email });
      setRoute('onboard');
    } else {
      // Fully set up account
      loadAccount(email);
      lsSet(AUTH_KEY, { loggedIn: true, email });
      setRoute('app');
    }
  };

  const handleOnboardDone = ({ target, monthlyTarget, weight } = {}) => {
    if (target) setPref('calorieTarget', target);
    if (monthlyTarget) setPref('monthlyTarget', monthlyTarget);
    if (weight) setAppState(prev => ({ ...prev, weight }));
    // Mark onboarding complete for this account
    const accounts = lsGet(ACCOUNTS_KEY, {});
    accounts[emailRef.current] = 'done';
    lsSet(ACCOUNTS_KEY, accounts);
    setRoute('app');
  };

  const handleLogout = () => {
    lsSet(AUTH_KEY, { loggedIn: false, email: null });
    setCurrentEmail(null);
    emailRef.current = null;
    setRoute('login');
  };

  const recent = [
    { name: 'Greek yogurt + granola', kcal: 320 },
    { name: 'Eggs (3) on toast',      kcal: 410 },
    { name: 'Protein shake',          kcal: 180 },
    { name: 'Apple',                  kcal: 95 },
  ];

  const weekData = [
    { day: 'M', kcal: 1980, status: 'completed' },
    { day: 'T', kcal: 2240, status: 'missed' },
    { day: 'W', kcal: 1620, status: 'completed' },
    { day: 'T', kcal: 1840, status: 'leave' },
    { day: 'F', kcal: 2080, status: 'completed' },
    { day: 'S', kcal: 1920, status: 'completed' },
    { day: 'S', kcal: appState.foods.reduce((s, f) => s + f.kcal, 0), status: appState.gymStatus || 'rest' },
  ];

  const calendar = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    if (day > 18) return { day, status: 'none' };
    const cycle = day % 7;
    let status = 'completed';
    if (cycle === 0) status = 'rest';
    else if (cycle === 3 && day < 12) status = 'leave';
    else if (cycle === 5) status = 'missed';
    return { day, status };
  });

  const weightSeries = [82.5, 82.3, 82.0, 81.8, 81.6, 81.5, 81.2, 80.9, 80.7, 80.6, 80.5, appState.weight];

  const [addOpen, setAddOpen] = useState(false);
  const [gymOpen, setGymOpen] = useState(false);

  const addFood = (f) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setAppState(prev => ({ ...prev, foods: [...prev.foods, { ...f, id: Date.now(), time }] }));
  };

  const setGym = (status) => setAppState(prev => ({ ...prev, gymStatus: status }));

  let body;
  if (route === 'login') {
    body = <ScreenLogin theme={theme} onLogin={handleLogin}/>;
  } else if (route === 'onboard') {
    body = <ScreenOnboard
      theme={theme}
      name={prefs.userName}
      setName={(v) => setPref('userName', (v || '').slice(0, 40))}
      onDone={handleOnboardDone}
    />;
  } else {
    let screen;
    if (tab === 'today')   screen = <ScreenToday   theme={theme} state={appState} setState={setAppState} name={prefs.userName} target={prefs.calorieTarget} openAdd={() => setAddOpen(true)} openGym={() => setGymOpen(true)}/>;
    if (tab === 'weekly')  screen = <ScreenWeekly  theme={theme} target={prefs.calorieTarget} weekData={weekData}/>;
    if (tab === 'monthly') screen = <ScreenMonthly theme={theme} monthlyTarget={prefs.monthlyTarget} calendar={calendar} weightSeries={weightSeries}/>;
    if (tab === 'profile') screen = <ScreenProfile theme={theme} prefs={prefs} setPref={setPref} onLogout={handleLogout} weight={appState.weight} onWeightChange={(w) => setAppState(prev => ({ ...prev, weight: w }))}/>;
    body = (
      <>
        {screen}
        <BottomNav theme={theme} tab={tab} setTab={setTab} onAdd={() => setAddOpen(true)}/>
        <AddFoodSheet theme={theme} open={addOpen} onClose={() => setAddOpen(false)} onAdd={addFood} recent={recent}/>
        <GymSheet     theme={theme} open={gymOpen} onClose={() => setGymOpen(false)} current={appState.gymStatus} onSet={setGym}/>
      </>
    );
  }

  return (
    <div className="phone" style={{ background: prefs.dark ? '#0a0a0a' : '#1a1a1a' }}>
      <div className="phone-screen" style={{ background: theme.bg }}>
        <div className="phone-notch"/>
        <PhoneStatus theme={theme}/>
        {body}
      </div>
    </div>
  );
}
