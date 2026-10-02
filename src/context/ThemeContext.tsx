import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'auto' | 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  cardAlt: string;
  border: string;
  borderSoft: string;
  input: string;
  inputBorder: string;
  text: string;
  textSecondary: string;
  muted: string;
  accent: string;
  accentStrong: string;
  summary: string;
  summarySoft: string;
  onSummary: string;
  danger: string;
  overlay: string;
  nav: string;
};

const darkColors: ThemeColors = {
  background: '#0D1729',
  card: '#192841',
  cardAlt: '#162640',
  border: '#293B58',
  borderSoft: '#263952',
  input: '#0E1728',
  inputBorder: '#30415B',
  text: '#FFFFFF',
  textSecondary: '#C2CDDC',
  muted: '#8EA5C5',
  accent: '#3CC4C8',
  accentStrong: '#35C8CC',
  summary: '#FFD84D',
  summarySoft: '#FFF0A8',
  onSummary: '#15233B',
  danger: '#F04D58',
  overlay: 'rgba(0, 0, 0, 0.55)',
  nav: '#192841',
};

const lightColors: ThemeColors = {
  background: '#F4F7FB',
  card: '#FFFFFF',
  cardAlt: '#F8FAFD',
  border: '#D9E2EF',
  borderSoft: '#E5EBF4',
  input: '#F8FAFD',
  inputBorder: '#CBD5E1',
  text: '#142033',
  textSecondary: '#475569',
  muted: '#64748B',
 accent: '#126EED',
accentStrong: '#126EED',
  summary: '#FFD84D',
  summarySoft: '#FFF4B8',
  onSummary: '#18233A',
  danger: '#E54855',
  overlay: 'rgba(15, 23, 42, 0.30)',
  nav: '#FFFFFF',
};

type ThemeContextType = {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  changeTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = '@todo_theme';

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('auto');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          savedTheme === 'auto' ||
          savedTheme === 'light' ||
          savedTheme === 'dark'
        ) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch((error) => {
      console.log('Error saving theme:', error);
    });
  }, []);

  const changeTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme: ThemeMode =
        currentTheme === 'auto'
          ? 'light'
          : currentTheme === 'light'
            ? 'dark'
            : 'auto';

      AsyncStorage.setItem(STORAGE_KEY, nextTheme).catch((error) => {
        console.log('Error saving theme:', error);
      });

      return nextTheme;
    });
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'auto'
      ? systemTheme === 'light'
        ? 'light'
        : 'dark'
      : theme;

  const colors = resolvedTheme === 'light' ? lightColors : darkColors;

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      colors,
      setTheme,
      changeTheme,
    }),
    [theme, resolvedTheme, colors, setTheme, changeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
