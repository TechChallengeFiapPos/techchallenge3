import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

const fontConfig: MD3Theme['fonts'] = {
  default: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    letterSpacing: 0,
  },
  displayLarge: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: 'Poppins-Light',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

// 🎨 Paleta personalizada
const colors = {
  primary: '#00D09E', // Caribbean Green
  onPrimary: '#ffffff',
  inversePrimary: '#052224', // Fence Green
  secondary: '#3298FF', // Vivid Blue
  onSecondary: '#ffffff',
  tertiary: '#0E3E3E', // Cyprus
  background: '#00D09E',
  onBackground: '#031314', // Void
  outline: '#052224', // Fence Green
  surface: '#F1FFF3',
  onSurface: '#052224', // Fence Green
  onSurfaceVariant: '#0E3E3E', // Fence Green
  error: '#B00020',
  onError: '#ffffff',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: fontConfig,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...colors,
    inversePrimary: '#00D09E', // Fence Green
    background: '#052224', // Void
    secondary: '#0068FF', //Ocean Blue
    outline: '#f1fff3', // Honeydew
    onBackground: '#f1fff3', // Honeydew
    surface: '#093030',
    onSurface: '#d7ffe2', // Light Green
    onSurfaceVariant: '#f1fff3', // Honeydew
    error: '#ea5b2bff',
  },
  fonts: fontConfig,
};
