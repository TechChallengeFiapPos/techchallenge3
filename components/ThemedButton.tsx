import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  outline?: boolean;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  type = 'default',
  title,
  loading = false,
  icon,
  iconPosition = 'left',
  outline = false,
  textStyle,
  buttonStyle,
  disabled,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');
  const textColor = useThemeColor({}, 'text');
  const linkColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'primary');

  const isLink = type === 'link';

  function getTextStyle(type: ThemedButtonProps['type']) {
    switch (type) {
      case 'defaultSemiBold':
        return styles.defaultSemiBold;
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'link':
        return styles.link;
      default:
        return {};
    }
  }

  const finalTextColor = isLink ? linkColor : outline ? borderColor : textColor;

  const containerStyle = [
    !isLink && styles.default,
    outline && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor,
    },
    !isLink && !outline && { backgroundColor },
    disabled && { opacity: 0.5 },
    buttonStyle,
    style,
  ];

  const content = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={finalTextColor} />
      ) : (
        <View style={styles.row}>
          {icon && iconPosition === 'left' && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextStyle(type), { color: finalTextColor }, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity style={containerStyle} disabled={disabled || loading} {...rest}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    textDecorationLine: 'underline',
    color: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
