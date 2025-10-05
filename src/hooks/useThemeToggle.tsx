import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const THEME_KEY = '@bytebank_theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

export const useThemeToggle = () => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) setThemeMode(saved as ThemeMode);
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const currentTheme = themeMode === 'auto' ? systemTheme : themeMode;

  return {
    themeMode,
    currentTheme,
    setTheme: saveTheme,
  };
};