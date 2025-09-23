import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import { ThemedInput } from './ThemedInput';

interface InputControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  defaultValue?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
  rules?: object;
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

export function InputController<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  defaultValue = '',
  placeholder,
  secureTextEntry,
  rules,
  keyboardType = 'default',
  maxLength,
  autoComplete,
}: InputControllerProps<TFieldValues>) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const passwordIcon = secureTextEntry ? (
    <TextInput.Icon
      icon={isPasswordVisible ? 'eye-off' : 'eye'}
      onPress={togglePasswordVisibility}
    />
  ) : undefined;

  return (
    <Controller
      rules={rules}
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedInput
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          error={false}
          icon={passwordIcon}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoComplete={autoComplete}
        />
      )}
    />
  );
}
