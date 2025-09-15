import { Colors } from '@constants/Colors';
import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: keyof typeof Colors.light;
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'link';
  style?: StyleProp<TextStyle>;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  colorName = 'text',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorName);
  const theme = useTheme();

  const secondaryColor = useThemeColor({}, 'secondary');

  const typeToFontKey = {
    default: 'bodyLarge',
    defaultSemiBold: 'bodyLarge',
    title: 'headlineLarge',
    subtitle: 'titleLarge',
    link: 'labelLarge',
  } as const;

  const fontKey = typeToFontKey[type] || 'bodyLarge';
  const fontStyle = theme.fonts[fontKey];

  const overrideWeight: StyleProp<TextStyle> =
    type === 'defaultSemiBold'
      ? { fontWeight: '600' }
      : type === 'link'
        ? { color: secondaryColor }
        : {};

  return <Text style={[{ color }, fontStyle, overrideWeight, style]} {...rest} />;
}
