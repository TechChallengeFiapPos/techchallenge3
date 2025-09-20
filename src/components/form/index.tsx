import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import { ThemedButton } from 'components/ThemedButton';
import { StyleSheet, View } from 'react-native';
import { InputController } from '../input/InputController';

export type FormField = {
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
};

interface Props {
  type?: 'login' | 'register';
  onSubmit: (data: FieldValues) => void;
  disabled?: boolean;
}

// Campos do formulário
const loginFields: FormField[] = [
  { name: 'email', label: 'Email', placeholder: 'Digite seu e-mail' },
  { name: 'senha', label: 'Senha', placeholder: 'Digite sua senha', secureTextEntry: true },
];

const registerFields: FormField[] = [
  { name: 'nome', label: 'Nome', placeholder: 'Digite seu nome' },
  { name: 'email', label: 'Email', placeholder: 'Digite seu e-mail' },
  { name: 'senha', label: 'Senha', placeholder: 'Digite sua senha', secureTextEntry: true },
];

export function LoginRegisterForm({ type = 'login', onSubmit, disabled }: Props) {
  const { control, handleSubmit } = useForm();
  const fieldsToRender = type === 'login' ? loginFields : registerFields;

  return (
    <View style={styles.container}>
      {fieldsToRender.map((field) => (
        <InputController
          key={field.name}
          control={control}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          secureTextEntry={field.secureTextEntry}
        />
      ))}

      <ThemedButton
        title="Enviar"
        onPress={handleSubmit(onSubmit)}
        disabled={disabled}
        type="defaultSemiBold"
        buttonStyle={{ marginTop: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
  },
});
