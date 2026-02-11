/**
 * Theme System - Deep Teal "Premium Mode" Design
 * 
 * Design Philosophy:
 * - Minimal: Clean lines, generous whitespace
 * - Premium: Deep teal gradients, mint accents
 * - Polished: Frosted glass, smooth transitions
 * 
 * Color Palette:
 * - Primary: #0D4A4A → #1A6B6B → #0F3D3D (Deep Teal)
 * - Accent: #3DDC97 (Mint Green)
 * - Surface: rgba(255,255,255,0.08) (Frosted Glass)
 */

// =============================================================================
// CORE COLOR PALETTE - Deep Teal
// =============================================================================

// Primary: Deep Teal (Professional, Trustworthy)
export const Primary = {
  50: '#E6F5F5',
  100: '#CCEBEB',
  200: '#99D7D7',
  300: '#66C3C3',
  400: '#33AFAF',
  500: '#1A6B6B',  // Mid Teal
  600: '#0F766E',  // Teal 600
  700: '#0D4A4A',  // Deep Teal - Main Primary
  800: '#0A3D3D',
  900: '#082E2E',
  950: '#041A1A',
} as const;

// Accent: Mint Green (Fresh, Modern)
export const Accent = {
  light: '#7AE8BC',
  main: '#3DDC97',    // Main Accent
  dark: '#2AB87A',
  glow: 'rgba(61, 220, 151, 0.2)',
} as const;

// Success: Vibrant Green (Present)
export const Success = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',  // Main Success
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
} as const;

// Danger: Elegant Red (Absent)
export const Danger = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',  // Main Danger
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const;

// Warning: Warm Amber (Pending)
export const Warning = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',  // Main Warning
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

// Info: Calm Blue (OD/Leave)
export const Info = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',  // Main Info
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const;

// Neutral: Slate Gray
export const Neutral = {
  0: '#FFFFFF',
  50: '#F8FAFC',
  100: '#F1F5F9',
  150: '#E8EDF2',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  850: '#172033',
  900: '#0F172A',
  950: '#020617',
} as const;

// =============================================================================
// LIGHT THEME - Clean, Bright
// =============================================================================

export const LightTheme = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: Neutral[50],
  backgroundTertiary: Neutral[100],
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: Neutral[50],
  
  // Text (High contrast)
  textPrimary: Neutral[900],
  textSecondary: Neutral[500],
  textTertiary: Neutral[400],
  textMuted: Neutral[300],
  textInverse: '#FFFFFF',
  
  // Borders
  border: Neutral[200],
  borderLight: Neutral[150],
  borderFocus: Primary[700],
  separator: Neutral[100],
  
  // Primary
  primary: Primary[700],
  primaryLight: Primary[500],
  primaryDark: Primary[800],
  primaryForeground: '#FFFFFF',
  
  // Accent (Mint)
  accent: Accent.main,
  accentLight: Accent.light,
  accentGlow: Accent.glow,
  
  // Status
  success: Success[500],
  danger: Danger[500],
  warning: Warning[500],
  info: Info[500],
  
  // Semantic
  present: Success[500],
  absent: Danger[500],
  pending: Warning[500],
  od: Info[500],
  leave: Info[600],
  
  // Interactive
  hover: 'rgba(0, 0, 0, 0.04)',
  pressed: 'rgba(0, 0, 0, 0.08)',
  disabled: Neutral[200],
  
  // Overlay & Glass
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  
  // Card
  card: '#FFFFFF',
  cardBorder: Neutral[150],
} as const;

// =============================================================================
// DARK THEME - Deep Teal (Premium)
// =============================================================================

export const DarkTheme = {
  // Backgrounds (Deep Teal)
  background: '#0A2525',
  backgroundSecondary: Primary[700],
  backgroundTertiary: Primary[800],
  surface: 'rgba(255,255,255,0.08)',
  surfaceElevated: 'rgba(255,255,255,0.12)',
  surfaceSecondary: 'rgba(255,255,255,0.06)',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  textMuted: 'rgba(255, 255, 255, 0.35)',
  textInverse: Primary[700],
  
  // Borders
  border: 'rgba(255, 255, 255, 0.15)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderFocus: Accent.main,
  separator: 'rgba(255, 255, 255, 0.06)',
  
  // Primary (Mint in dark mode for visibility)
  primary: Accent.main,
  primaryLight: Accent.light,
  primaryDark: Accent.dark,
  primaryForeground: Primary[700],
  
  // Accent
  accent: Accent.main,
  accentLight: Accent.light,
  accentGlow: 'rgba(61, 220, 151, 0.25)',
  
  // Status
  success: Success[400],
  danger: Danger[400],
  warning: Warning[400],
  info: Info[400],
  
  // Semantic
  present: Success[400],
  absent: Danger[400],
  pending: Warning[400],
  od: Info[400],
  leave: Info[500],
  
  // Interactive
  hover: 'rgba(255, 255, 255, 0.06)',
  pressed: 'rgba(255, 255, 255, 0.1)',
  disabled: Neutral[700],
  
  // Overlay & Glass
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(13, 74, 74, 0.92)',
  glassBorder: 'rgba(61, 220, 151, 0.15)',
  
  // Card
  card: 'rgba(255,255,255,0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
} as const;

// =============================================================================
// GRADIENTS - Deep Teal Premium
// =============================================================================

export const Gradients = {
  // Premium header gradient
  header: ['#0D4A4A', '#1A6B6B', '#0F3D3D'] as const,
  
  // Dark header
  headerDark: ['#082E2E', '#0D4A4A', '#0A3D3D'] as const,
  
  // Scanning radar
  radar: ['#0D4A4A', '#1A6B6B', '#0D4A4A'] as const,
  
  // Success shimmer
  success: [Success[700], Success[500], Success[400]] as const,
  
  // Premium dark background
  premiumDark: ['#0A2525', '#0D4A4A', '#0A2525'] as const,
  
  // Floating dock
  dock: ['#0D4A4A', '#1A6B6B'] as const,
  
  // Glass effects
  glassLight: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'] as const,
  glassDark: ['rgba(13,74,74,0.95)', 'rgba(10,37,37,0.9)'] as const,
  
  // Accent shimmer (Mint)
  accentShimmer: [Accent.dark, Accent.main, Accent.light] as const,
} as const;

// =============================================================================
// SHADOWS - Refined
// =============================================================================

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 24,
  },
  // Primary glow (Teal)
  primaryGlow: {
    shadowColor: Primary[700],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  // Accent glow (Mint)
  accentGlow: {
    shadowColor: Accent.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  // Success glow
  successGlow: {
    shadowColor: Success[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// =============================================================================
// BORDER RADIUS - Modern
// =============================================================================

export const Radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  full: 9999,
} as const;

// =============================================================================
// SPACING - 4pt Grid
// =============================================================================

export const Spacing = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
} as const;

// =============================================================================
// ANIMATION TIMING
// =============================================================================

export const Animations = {
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },
  spring: {
    snappy: { damping: 20, stiffness: 400, mass: 0.8 },
    gentle: { damping: 15, stiffness: 150, mass: 1 },
    bouncy: { damping: 10, stiffness: 200, mass: 0.8 },
    smooth: { damping: 25, stiffness: 100, mass: 1.2 },
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

import { scale, verticalScale, moderateScale, normalizeFont } from '../utils/responsive';

export const Typography = {
  size: {
    '2xs': normalizeFont(10),
    xs: normalizeFont(12),
    sm: normalizeFont(14),
    base: normalizeFont(16),
    lg: normalizeFont(18),
    xl: normalizeFont(20),
    '2xl': normalizeFont(24),
    '3xl': normalizeFont(30),
    '4xl': normalizeFont(36),
    '5xl': normalizeFont(48),
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const Components = {
  // Buttons
  button: {
    height: {
      sm: verticalScale(40),
      md: verticalScale(48),
      lg: verticalScale(56),
    },
    padding: {
      sm: scale(16),
      md: scale(20),
      lg: scale(24),
    },
    radius: Radius['2xl'],
    iconSize: {
      sm: moderateScale(18),
      md: moderateScale(20),
      lg: moderateScale(24),
    },
  },
  
  // Input fields
  input: {
    height: verticalScale(56),
    padding: scale(16),
    radius: Radius.xl,
    fontSize: normalizeFont(17),
  },
  
  // Cards
  card: {
    padding: {
      sm: scale(12),
      md: scale(16),
      lg: scale(20),
    },
    radius: Radius['3xl'],
    gap: scale(12),
  },
  
  // Header
  header: {
    height: verticalScale(60),
    paddingHorizontal: scale(20),
    titleSize: normalizeFont(17),
  },
  
  // Tab bar
  tabBar: {
    height: verticalScale(72),
    iconSize: moderateScale(24),
    labelSize: normalizeFont(10),
    radius: moderateScale(36),
  },
  
  // Avatar
  avatar: {
    xs: moderateScale(28),
    sm: moderateScale(36),
    md: moderateScale(44),
    lg: moderateScale(64),
    xl: moderateScale(88),
  },
  
  // List items
  listItem: {
    height: verticalScale(56),
    padding: scale(16),
    iconSize: moderateScale(24),
  },
  
  // Modal
  modal: {
    radius: Radius['4xl'],
    padding: scale(24),
  },
  
  // Badge
  badge: {
    height: verticalScale(24),
    padding: scale(8),
    radius: Radius.full,
    fontSize: normalizeFont(12),
  },
  
  // Screen
  screen: {
    padding: scale(20),
    headerGap: verticalScale(24),
    sectionGap: verticalScale(32),
  },
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

export const Theme = LightTheme;

export default {
  Primary,
  Accent,
  Success,
  Danger,
  Warning,
  Info,
  Neutral,
  LightTheme,
  DarkTheme,
  Gradients,
  Shadows,
  Radius,
  Spacing,
  Animations,
  Typography,
  Components,
  Theme,
};
