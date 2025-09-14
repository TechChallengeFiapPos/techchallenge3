import { darkTheme, lightTheme } from '@config/theme';

export const Colors = {
  light: {
    text: lightTheme.colors.onBackground,
    background: lightTheme.colors.background,
    onBackground: lightTheme.colors.onBackground,
    primary: lightTheme.colors.primary,
    secondary: lightTheme.colors.secondary,
    surface: lightTheme.colors.surface,
    onSurface: lightTheme.colors.onSurface,
    onSurfaceVariant: lightTheme.colors.onSurfaceVariant,
    outline: lightTheme.colors.outline,
    icon: lightTheme.colors.inversePrimary,
  },
  dark: {
    text: darkTheme.colors.onBackground,
    background: darkTheme.colors.background,
    onBackground: darkTheme.colors.onBackground,
    primary: darkTheme.colors.primary,
    secondary: darkTheme.colors.secondary,
    surface: darkTheme.colors.surface,
    onSurface: darkTheme.colors.onSurface,
    onSurfaceVariant: darkTheme.colors.onSurfaceVariant,
    outline: darkTheme.colors.outline,
    icon: darkTheme.colors.inversePrimary,
  },
};
