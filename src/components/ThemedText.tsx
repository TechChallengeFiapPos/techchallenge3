import { useThemeColor } from '@hooks/useThemeColor';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'link';
  style?: StyleProp<TextStyle>;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const theme = useTheme();
  const linkColor = useThemeColor({}, 'secondary'); 
  
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
      ? { color: linkColor } 
      : {};

  return (
    <Text
      style={[{ color }, fontStyle, overrideWeight, style]}
      {...rest}
    />
  );
}
