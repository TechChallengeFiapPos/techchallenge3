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
  icon?: React.ReactNode; // Se quiser permitir ícones manuais para campos não-senha
}

export function InputController<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  defaultValue = '',
  placeholder,
  secureTextEntry,
}: InputControllerProps<TFieldValues>) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Se for campo de senha, definimos o ícone dinamicamente
  const passwordIcon = secureTextEntry ? (
    <TextInput.Icon
      icon={isPasswordVisible ? 'eye-off' : 'eye'}
      onPress={togglePasswordVisibility}
    />
  ) : undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ThemedInput
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible} // ← oculta ou mostra
          error={!!error}
          icon={passwordIcon}
        />
      )}
    />
  );
}
