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
}: ThemedInputProps<T>) => {
  const [internalValue, setInternalValue] = useState<T>(() => value ?? ('' as T));

  const theme = useTheme();

  // Cores baseadas no tema
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface'); // verde claro no seu lightTheme
  const textColor = useThemeColor({}, 'onSurface'); // texto dentro do campo
  const primaryColor = useThemeColor({}, 'primary'); // cor de foco/borda ativa
  const borderColor = useThemeColor({}, 'outline'); // borda padrão (se tiver)
  const labelColor = useThemeColor({}, 'onSurfaceVariant'); // cor da label

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (text: string) => {
    if (onChange) {
      onChange(text as T);
    } else {
      setInternalValue(text as T);
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
    borderRadius: 999, // formato pill
    paddingHorizontal: 12,
  },
});

export default ThemedInput;
