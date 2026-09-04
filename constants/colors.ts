import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── Screen Dimensions ────────────────────────
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Responsive scaling helpers
export const scale = (size: number) => (width / 375) * size;
export const verticalScale = (size: number) => (height / 812) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// ─── Brand / Macro Colors (same in both themes) ───
export const BrandColors = {
  green:        '#10B981',
  greenDark:    '#059669',
  greenLight:   '#34D399',
  greenMuted:   'rgba(16,185,129,0.15)',
  greenGlow:    'rgba(16,185,129,0.25)',
  cyan:         '#06B6D4',
  cyanMuted:    'rgba(6,182,212,0.15)',
  lime:         '#84CC16',
  purple:       '#8B5CF6',
  purpleMuted:  'rgba(139,92,246,0.20)',
  warning:      '#F59E0B',
  warningMuted: 'rgba(245,158,11,0.15)',
  error:        '#EF4444',
  errorMuted:   'rgba(239,68,68,0.15)',
  info:         '#3B82F6',
  protein:      '#10B981',
  proteinBg:    'rgba(16,185,129,0.15)',
  carbs:        '#F59E0B',
  carbsBg:      'rgba(245,158,11,0.15)',
  fats:         '#94A3B8',
  fatsBg:       'rgba(148,163,184,0.15)',
  calories:     '#06B6D4',
  caloriesBg:   'rgba(6,182,212,0.15)',
  tabActive:    '#10B981',
  white:        '#FFFFFF',
  black:        '#000000',
};

// ─── Dark Theme Palette ───────────────────────
export const DarkTheme = {
  ...BrandColors,
  isDark: true,

  // Backgrounds
  bgPrimary:    '#090D16',
  bgSecondary:  '#0F172A',
  bgCard:       '#1E293B',
  bgCardAlt:    '#162032',
  bgInput:      '#1A2540',

  // Borders
  border:       '#334155',
  borderMuted:  'rgba(255,255,255,0.08)',

  // Text
  textPrimary:  '#F8FAFC',
  textMuted:    '#94A3B8',
  textAccent:   '#34D399',
  textDim:      '#475569',

  // Tab Bar
  tabBg:        '#0F172A',
  tabInactive:  '#475569',

  // Misc
  overlay:      'rgba(0,0,0,0.75)',
  shimmer:      'rgba(255,255,255,0.05)',
  statusBar:    'light' as 'light' | 'dark',
};

// ─── Light Theme Palette ──────────────────────
export const LightTheme = {
  ...BrandColors,
  isDark: false,

  // Backgrounds
  bgPrimary:    '#F1F5F9',
  bgSecondary:  '#FFFFFF',
  bgCard:       '#FFFFFF',
  bgCardAlt:    '#F8FAFC',
  bgInput:      '#F1F5F9',

  // Borders
  border:       '#E2E8F0',
  borderMuted:  'rgba(0,0,0,0.06)',

  // Text
  textPrimary:  '#0F172A',
  textMuted:    '#64748B',
  textAccent:   '#059669',
  textDim:      '#94A3B8',

  // Tab Bar
  tabBg:        '#FFFFFF',
  tabInactive:  '#94A3B8',

  // Misc
  overlay:      'rgba(0,0,0,0.55)',
  shimmer:      'rgba(0,0,0,0.04)',
  statusBar:    'dark' as 'light' | 'dark',
};

export type AppTheme = typeof DarkTheme;

// ─── Default export (Dark — used as fallback) ─
export const Colors = DarkTheme;

// ─── Spacing ──────────────────────────────────
export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
};

// ─── Border Radius ────────────────────────────
export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  full: 9999,
};

// ─── Shadows ──────────────────────────────────
export const Shadows = {
  green: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
