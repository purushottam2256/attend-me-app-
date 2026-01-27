/**
 * ThemeContext - Global theme provider with light/dark mode support
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../constants/Theme';

// Theme type definition
export type Theme = typeof LightTheme;

// Theme context value
interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

// Export themes for convenience
export const lightTheme = LightTheme;
export const darkTheme = DarkTheme;

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Provider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');

  // Determine actual dark mode state
  const isDark = mode === 'system' 
    ? systemColorScheme === 'dark' 
    : mode === 'dark';

  // Get the active theme
  const theme = isDark ? DarkTheme : LightTheme;

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setMode(prev => {
      if (prev === 'system') {
        return systemColorScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [systemColorScheme]);

  // Set specific theme mode
  const setThemeMode = useCallback((newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
  }, []);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDark, 
        toggleTheme, 
        setTheme: setThemeMode 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
