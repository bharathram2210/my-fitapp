// FitTrack Pro — design tokens
// Forest green + amber on warm cream / dark surface

export const FT_THEMES = {
  light: {
    bg: '#F5F1E8',
    bgElev: '#FFFFFF',
    surface: '#FBF7EE',
    surfaceAlt: '#EFE9DC',
    line: '#E2DBCB',
    lineStrong: '#CDC4AE',
    text: '#1A2520',
    textSoft: '#5C6660',
    textMute: '#8A9189',
    primary: '#1F4A3A',
    primarySoft: '#D6E4DC',
    primaryInk: '#0D2A20',
    accent: '#E8B84F',
    accentSoft: '#F8E7B8',
    danger: '#C8462C',
    dangerSoft: '#F5DCD3',
    success: '#2F7A4F',
    warn: '#D49327',
    chip: '#EFE9DC',
    overlay: 'rgba(20,30,25,0.45)',
    statusFG: '#1A2520',
    skeleton: '#E8E1D0',
  },
  dark: {
    bg: '#0E1714',
    bgElev: '#16201C',
    surface: '#16201C',
    surfaceAlt: '#1F2B26',
    line: '#26332D',
    lineStrong: '#384842',
    text: '#F1ECDD',
    textSoft: '#B5BDB5',
    textMute: '#7E8881',
    primary: '#7BC9A8',
    primarySoft: '#1F362D',
    primaryInk: '#E6F4EC',
    accent: '#F0C25F',
    accentSoft: '#3A2F12',
    danger: '#E07A60',
    dangerSoft: '#3A1E16',
    success: '#7BC9A8',
    warn: '#F0C25F',
    chip: '#1F2B26',
    overlay: 'rgba(0,0,0,0.55)',
    statusFG: '#F1ECDD',
    skeleton: '#1F2B26',
  },
};

export const FT_ACCENTS = {
  amber: { accent: '#E8B84F', accentSoft: '#F8E7B8', accentDark: '#F0C25F', accentSoftDark: '#3A2F12' },
  rust:  { accent: '#D9633C', accentSoft: '#F4D9CB', accentDark: '#E07A60', accentSoftDark: '#3A1E16' },
  ochre: { accent: '#C29A2C', accentSoft: '#EFE0AC', accentDark: '#D9B84F', accentSoftDark: '#332811' },
  sage:  { accent: '#7BA77F', accentSoft: '#D6E5D6', accentDark: '#9DC9A1', accentSoftDark: '#1E2E20' },
  clay:  { accent: '#B8755A', accentSoft: '#EBD4C7', accentDark: '#D08A6E', accentSoftDark: '#33211B' },
};

export function useTheme(mode = 'light', accentKey = 'amber') {
  const base = FT_THEMES[mode];
  const a = FT_ACCENTS[accentKey] || FT_ACCENTS.amber;
  if (mode === 'dark') {
    return { ...base, accent: a.accentDark, accentSoft: a.accentSoftDark };
  }
  return { ...base, accent: a.accent, accentSoft: a.accentSoft };
}
