/**
 * Colors - Deep Teal "Premium Mode" Color System
 * 
 * Premium color palette with frosted glass effects
 * Primary: #0D4A4A (Deep Teal)
 * Accent: #3DDC97 (Mint Green)
 */

import { 
  Primary,
  Accent, 
  Success, 
  Danger, 
  Warning, 
  Info,
  Neutral,
  Gradients,
  LightTheme,
  DarkTheme 
} from './Theme';

// =============================================================================
// MAIN COLORS EXPORT
// =============================================================================

export const Colors = {
  // Premium palette (screens with gradient backgrounds)
  premium: {
    // Gradient (Deep Teal)
    gradientStart: '#0D4A4A',
    gradientMid: '#1A6B6B',
    gradientEnd: '#0F3D3D',
    
    // Accent (Mint Green)
    accent: '#3DDC97',
    accentGlow: 'rgba(61, 220, 151, 0.2)',
    
    // Frosted Glass Surfaces
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceLight: 'rgba(255, 255, 255, 0.12)',
    surfaceSolid: '#0D4A4A',
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    
    // Borders
    border: 'rgba(255, 255, 255, 0.15)',
    borderFocus: 'rgba(255, 255, 255, 0.25)',
    
    // Status
    success: Success[500],
    danger: Danger[500],
    warning: Warning[500],
    info: Info[500],
    
    // Attendance
    present: Success[500],
    absent: Danger[500],
    pending: Warning[500],
    od: Info[500],
  },
  
  // Light theme
  light: {
    background: LightTheme.background,
    backgroundSecondary: LightTheme.backgroundSecondary,
    surface: LightTheme.surface,
    textPrimary: LightTheme.textPrimary,
    textSecondary: LightTheme.textSecondary,
    textTertiary: LightTheme.textTertiary,
    border: LightTheme.border,
    separator: LightTheme.separator,
    primary: LightTheme.primary,
    card: LightTheme.card,
  },
  
  // Dark theme
  dark: {
    background: DarkTheme.background,
    backgroundSecondary: DarkTheme.backgroundSecondary,
    surface: DarkTheme.surface,
    textPrimary: DarkTheme.textPrimary,
    textSecondary: DarkTheme.textSecondary,
    textTertiary: DarkTheme.textTertiary,
    border: DarkTheme.border,
    separator: DarkTheme.separator,
    primary: DarkTheme.primary,
    card: DarkTheme.card,
  },
  
  // Neutral (UI components)
  neutral: {
    ...Neutral,
    white: '#FFFFFF',
    black: '#000000',
    background: Neutral[50],
    card: '#FFFFFF',
    border: Neutral[200],
    textLight: Neutral[400],
    textDark: Neutral[900],
  },
  
  // Primary (Deep Teal)
  primary: {
    ...Primary,
    main: '#0D4A4A',
    light: '#1A6B6B',
    dark: '#0A3D3D',
    lightest: Primary[100],
    foreground: '#FFFFFF',
  },
  
  // Glass
  glass: {
    white: 'rgba(255, 255, 255, 0.85)',
    dark: 'rgba(13, 74, 74, 0.92)',
    border: 'rgba(255, 255, 255, 0.15)',
  },
  
  // Status
  status: {
    success: Success[500],
    error: Danger[500],
    warning: Warning[500],
    info: Info[500],
  },
  
  // Attendance
  attendance: {
    present: Success[500],
    absent: Danger[500],
    pending: Warning[500],
    od: Info[500],
    leave: Info[600],
  },
  
  // Direct palettes
  success: Success,
  danger: Danger,
  warning: Warning,
  info: Info,
  accent: Accent,
};

export default Colors;
