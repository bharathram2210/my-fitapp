# FitTrack Pro — React App

A mobile fitness tracking prototype (Android-sized, 412×892), built with **React 18 + Vite**.
Forest green + amber on warm cream, Manrope type, animated calorie ring, bar charts, calendar heatmap.

## Run it

```bash
cd fittrack-pro
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## What's inside

- `src/main.jsx` — React entry
- `src/App.jsx` — app shell (phone frame, routing, state, tweaks panel)
- `src/theme/theme.js` — design tokens for light / dark and 5 accent swatches
- `src/components/`
  - `Icons.jsx` — tiny stroke icon set
  - `UI.jsx` — shared primitives (CalorieRing, Btn, Chip, Card, Ticker, Sheet, Field, Toggle, PhoneStatus, BottomNav, Logomark)
  - `Tweaks.jsx` — floating control panel
- `src/screens/`
  - `Auth.jsx` — login + 5-step onboarding
  - `Today.jsx` — Today dashboard + Add-Food and Gym sheets
  - `Analytics.jsx` — Weekly review, Monthly view, Profile
- `src/styles.css` — global styles, animations, phone frame
- `index.html` — loads Manrope from Google Fonts and mounts React
- `vite.config.js` — Vite + React plugin

## Try it

- Sign in to enter the app, or *Create account* for onboarding
- Tap the central **+** to log a meal — the ring fills and the counter ticks
- Tap the **Gym today** tile to mark Done / Leave / Missed / Rest
- Bottom tabs cycle Today / Weekly / Monthly / Profile

## Tweaks (bottom-right)

Dark mode, accent swap (amber / rust / ochre / sage / clay), name, calorie & monthly gym targets,
and a Route picker to jump to login or onboarding.

## Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # local static preview
```
