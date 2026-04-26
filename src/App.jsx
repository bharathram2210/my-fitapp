// FitTrack Pro — main app shell
import React, { useEffect, useState } from 'react';
import { useTheme } from './theme/theme.js';
import { BottomNav, PhoneStatus } from './components/UI.jsx';
import { ScreenLogin, ScreenOnboard } from './screens/Auth.jsx';
import { AddFoodSheet, GymSheet, ScreenToday } from './screens/Today.jsx';
import { ScreenMonthly, ScreenProfile, ScreenWeekly } from './screens/Analytics.jsx';

const PREF_DEFAULTS = {
  dark: false,
  accent: 'amber',
  userName: 'Bharath Kumar',
  calorieTarget: 2000,
  monthlyTarget: 22,
};

const PREFS_KEY = 'fittrack.prefs.v1';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return PREF_DEFAULTS;
    const saved = JSON.parse(raw);
    return { ...PREF_DEFAULTS, ...saved };
  } catch {
    return PREF_DEFAULTS;
  }
}

function savePrefs(prefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
}

export default function App() {
  const [prefs, setPrefsState] = useState(loadPrefs);
  const setPref = (key, val) => setPrefsState(p => {
    const next = { ...p, [key]: val };
    savePrefs(next);
    return next;
  });

  const theme = useTheme(prefs.dark ? 'dark' : 'light', prefs.accent);
  const [route, setRoute] = useState('login'); // login | onboard | app
  const [tab, setTab] = useState('today');

  const [appState, setAppState] = useState({
    foods: [
      { id: 1, name: 'Oats with banana & whey', kcal: 420, meal: 'breakfast', time: '7:45 AM' },
      { id: 2, name: 'Cold brew, no sugar',     kcal: 15,  meal: 'snack',     time: '10:20 AM' },
      { id: 3, name: 'Chicken rice bowl',       kcal: 680, meal: 'lunch',     time: '1:15 PM' },
    ],
    gymStatus: 'completed',
    weight: 80.4,
    streak: 12,
  });

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

  const weightSeries = [82.5, 82.3, 82.0, 81.8, 81.6, 81.5, 81.2, 80.9, 80.7, 80.6, 80.5, 80.4];

  const [addOpen, setAddOpen] = useState(false);
  const [gymOpen, setGymOpen] = useState(false);

  const addFood = (f) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setAppState({ ...appState, foods: [...appState.foods, { ...f, id: Date.now(), time }] });
  };

  const setGym = (status) => setAppState({ ...appState, gymStatus: status });

  let body;
  if (route === 'login') {
    body = <ScreenLogin theme={theme} onLogin={(target) => setRoute(target === 'onboard' ? 'onboard' : 'app')}/>;
  } else if (route === 'onboard') {
    body = <ScreenOnboard theme={theme} name={prefs.userName} setName={(v) => setPref('userName', v)} onDone={() => setRoute('app')}/>;
  } else {
    let screen;
    if (tab === 'today')   screen = <ScreenToday   theme={theme} state={appState} setState={setAppState} name={prefs.userName} target={prefs.calorieTarget} openAdd={() => setAddOpen(true)} openGym={() => setGymOpen(true)}/>;
    if (tab === 'weekly')  screen = <ScreenWeekly  theme={theme} target={prefs.calorieTarget} weekData={weekData}/>;
    if (tab === 'monthly') screen = <ScreenMonthly theme={theme} monthlyTarget={prefs.monthlyTarget} calendar={calendar} weightSeries={weightSeries}/>;
    if (tab === 'profile') screen = <ScreenProfile theme={theme} prefs={prefs} setPref={setPref} onLogout={() => setRoute('login')}/>;
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
