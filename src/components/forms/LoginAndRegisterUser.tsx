import { ThemedButton } from '@src/components/ThemedButton';
import { ThemedText } from '@src/components/ThemedText';
import { FieldValues, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { InputController } from '../input/InputController';

export type FormField = {
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  required?: boolean;
  rules?: object;
};

interface Props {
  type?: 'login' | 'register';
  onSubmit: (data: FieldValues) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
}

// Campos do formulário
const loginFields: FormField[] = [
  { name: 'email', label: 'Seu Email', placeholder: 'Digite seu e-mail', required: true },
  {
    name: 'senha',
    label: 'Sua Senha',
    placeholder: 'Digite sua senha',
    required: true,
    secureTextEntry: true,
  },
];

const registerFields: FormField[] = [
  { name: 'nome', label: 'Seu Nome', placeholder: 'Digite seu nome', required: true },
  { name: 'email', label: 'Seu email', placeholder: 'Digite seu e-mail', required: true },
  {
    name: 'senha',
    label: 'Sua melhor senha',
    placeholder: 'Digite sua senha',
    secureTextEntry: true,
    required: true,
  },
  {
    name: 'confirmPassword',
    label: 'Confirme sua senha',
    placeholder: 'Repita a senha',
    secureTextEntry: true,
    required: true,
  },
];

export function LoginRegisterUserForm({ type = 'login', onSubmit, disabled, errors }: Props) {
  const { control, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const fieldsToRender = type === 'login' ? loginFields : registerFields;

  return (
    <View style={styles.container}>
      {fieldsToRender.map((field) => (
        <View key={field.name} style={{ marginBottom: 12 }}>
          <InputController
            control={control}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            secureTextEntry={field.secureTextEntry}
            rules={{ required: `${field.label} é obrigatório` }}
          />
          {errors?.[field.name] && (
            <ThemedText textType="default" colorName="error" style={{ marginTop: 4, fontSize: 12 }}>
              {errors[field.name]}
            </ThemedText>
          )}
        </View>
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
