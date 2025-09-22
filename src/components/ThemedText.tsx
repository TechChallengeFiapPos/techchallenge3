import { Colors } from '@constants/Colors';
import { useThemeColor } from '@hooks/useThemeColor';
import { Text, type TextProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ThemeColorName = keyof typeof Colors.light;

export type TextType =
  | 'default'
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export type ThemedTextProps = TextProps & {
  colorName?: ThemeColorName;
  textType?: TextType;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedText({
  style,
  colorName,
  textType = 'default',
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  const themeColor = useThemeColor({}, colorName || 'text');
  const fallbackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const color = colorName ? themeColor : fallbackColor;

  const textStyle = textType === 'default' ? theme.fonts.bodyMedium : theme.fonts[textType];

  return <Text style={[textStyle, { color }, style]} {...rest} />;
}
