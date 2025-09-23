import { useThemeColor } from '@hooks/useThemeColor';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

interface ThemedInputProps<T = string> {
  label: string;
  value?: T;
  onChange?: (value: T) => void;
  secureTextEntry?: boolean;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  lightColor?: string;
  darkColor?: string;
  mode?: 'outlined' | 'flat';
  icon?: React.ReactNode;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'number-pad';
  maxLength?: number;
  autoComplete?:
    | 'off'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-csc'
    | 'name'
    | 'email'
    | 'tel'
    | 'street-address'
    | 'postal-code';
}

export const ThemedInput = <T extends string = string>({
  label,
  value,
  onChange,
  secureTextEntry = false,
  error = false,
  disabled = false,
  placeholder,
  lightColor,
  darkColor,
  mode = 'outlined',
  icon,
  keyboardType = 'default',
  maxLength,
  autoComplete = 'off',
}: ThemedInputProps<T>) => {
  const [internalValue, setInternalValue] = useState<T>(() => value ?? ('' as T));

  const theme = useTheme();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');
  const textColor = useThemeColor({}, 'onSurface'); // texto dentro do campo
  const primaryColor = useThemeColor({}, 'primary'); // cor de foco/borda ativa
  const borderColor = useThemeColor({}, 'outline'); // borda padrão
  const labelColor = useThemeColor({}, 'onSurfaceVariant'); // cor da label

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (text: string) => {
    const processedText = applyFormatting(text, autoComplete);

    if (onChange) {
      onChange(processedText as T);
    } else {
      setInternalValue(processedText as T);
    }
  };

  const applyFormatting = (text: string, type?: string): string => {
    switch (type) {
      case 'cc-number':
        const numbers = text.replace(/\D/g, '').substring(0, 16);
        return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');

      case 'cc-exp':
        const nums = text.replace(/\D/g, '');
        return nums.length >= 2
          ? nums.substring(0, 2) + (nums.length > 2 ? '/' + nums.substring(2, 4) : '')
          : nums;

      default:
        return text;
    }
  };

  return (
    <TextInput
      label={label}
      value={currentValue}
      onChangeText={handleChange}
      secureTextEntry={secureTextEntry}
      error={error}
      disabled={disabled}
      placeholder={placeholder}
      mode={mode}
      underlineColor={borderColor}
      activeUnderlineColor={primaryColor}
      activeOutlineColor={primaryColor}
      outlineColor={borderColor}
      textColor={textColor}
      right={icon}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoComplete={autoComplete}
      style={[
        styles.input,
        {
          backgroundColor,
        },
      ]}
      theme={{
        roundness: 50,
        colors: {
          ...theme.colors,
          background: backgroundColor, // fix global: ERA PRA EVITAR fundo amarelo do autofill :(
          onSurfaceVariant: labelColor, // aplica cor à label
        },
      }}
      outlineStyle={{ borderRadius: 999 }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
  },
});

export default ThemedInput;
