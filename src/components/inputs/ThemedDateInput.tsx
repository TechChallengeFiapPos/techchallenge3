// src/components/input/ThemedDateInput.tsx
import { useThemeColor } from '@hooks/useThemeColor';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

interface ThemedDateInputProps {
  label: string;
  value?: Date | null;
  onChange: (value: Date | undefined) => void;
  error?: boolean;
  disabled?: boolean;
  mode?: 'outlined' | 'flat';
}

export const ThemedDateInput: React.FC<ThemedDateInputProps> = ({
  label,
  value,
  onChange,
  error = false,
  disabled = false,
  mode = 'outlined',
}) => {
  const theme = useTheme();

  const backgroundColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'outline');
  const textColor = useThemeColor({}, 'onSurface');

  return (
    <DatePickerInput
      locale="pt"
      label={label}
      value={value ?? undefined}
      onChange={onChange}
      inputMode="start"
      mode={mode}
      disabled={disabled}
      withDateFormatInLabel
      error={error}
      underlineColor={borderColor}
      activeOutlineColor={primaryColor}
      outlineColor={borderColor}
      textColor={textColor}
      style={[styles.input, { backgroundColor }]}
      theme={{
        ...theme,
        roundness: 50,
        colors: {
          ...theme.colors,
          background: backgroundColor,
          primary: primaryColor,
          onSurface: textColor,
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    borderRadius: 999,
  },
});

export default ThemedDateInput;
