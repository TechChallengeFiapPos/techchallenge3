// src/contexts/ThemeContext.tsx - VERSÃO SIMPLES SEM LOOPS

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = '@bytebank_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) setThemeModeState(saved as ThemeMode);
    } catch (error) {
      console.error('Erro ao carregar tema');
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Erro ao salvar tema');
    }
  };

  const theme = themeMode === 'system' ? (systemTheme ?? 'light') : themeMode;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be within ThemeProvider');
  return context;
}