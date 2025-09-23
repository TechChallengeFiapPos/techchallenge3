import { ThemedView } from '@components/ThemedView';
import { auth, db } from '@config/firebaseConfig';
import { useThemeColor } from '@hooks/useThemeColor';
import { LoginRegisterUserForm } from '@src/components/forms';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

type FieldErrors = Record<string, string>;

function validateFormFields(
  email: string,
  password: string,
  name?: string,
  confirmPassword?: string,
): FieldErrors {
  const errors: FieldErrors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) errors.email = 'Email é obrigatório.';
  else if (!emailRegex.test(email)) errors.email = 'Email inválido.';

  if (!password) errors.senha = 'Senha é obrigatória.';
  else {
    if (password.length < 8) errors.senha = 'Senha precisa ter no mínimo 8 caracteres.';
    else if (!/[A-Z]/.test(password))
      errors.senha = 'Senha precisa ter pelo menos uma letra maiúscula.';
    else if (!/[a-z]/.test(password))
      errors.senha = 'Senha precisa ter pelo menos uma letra minúscula.';
    else if (!/[0-9]/.test(password)) errors.senha = 'Senha precisa ter pelo menos um número.';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.senha = 'Senha precisa ter pelo menos um símbolo.';
  }

  if (name !== undefined && !name.trim()) errors.nome = 'Nome é obrigatório.';
  if (confirmPassword !== undefined && password !== confirmPassword)
    errors.confirmPassword = 'As senhas não coincidem.';

  return errors;
}

export default function LoginAndRegister({ lightColor, darkColor }: ThemedProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const link = useThemeColor({}, 'secondary');

  const handleSubmit = async (data: FieldValues) => {
    setLoading(true);
    setMessage(null);
    setFieldErrors({});

    const email = data.email;
    const password = data.senha;
    const name = data.nome;
    const confirmPassword = data.confirmPassword;

    const errors = validateFormFields(
      email,
      password,
      isLogin ? undefined : name,
      isLogin ? undefined : confirmPassword,
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('✅ Login realizado com sucesso');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: serverTimestamp(),
        });
        setMessage('✅ Registro realizado com sucesso');
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.welcome} colorName="onSurfaceVariant" textType="titleMedium">
        Bem-vindo
      </ThemedText>

      <ThemedView style={styles.cardWrapper}>
        <ThemedCard style={styles.card}>
          <LoginRegisterUserForm
            type={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            disabled={loading}
            errors={fieldErrors} // passa os erros para o formulário
          />

          {message && (
            <ThemedText
              style={styles.message}
              textType={message.startsWith('❌') ? 'default' : 'default'}
            >
              {message}
            </ThemedText>
          )}

          {isLogin && (
            <TouchableRipple onPress={() => console.log('Esqueci minha senha')} disabled={loading}>
              <ThemedText style={styles.forgotText} textType="bodyMedium" colorName="secondary">
                Esqueceu a senha?
              </ThemedText>
            </TouchableRipple>
          )}

          <TouchableRipple onPress={() => setIsLogin(!isLogin)} disabled={loading}>
            <ThemedText
              style={[styles.switchText, { color: link }]}
              textType="bodyMedium"
              colorName="secondary"
            >
              {isLogin ? 'Ainda não possui conta? Registre-se' : 'Já possui conta? Entre'}
            </ThemedText>
          </TouchableRipple>
        </ThemedCard>

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={link} />
            <ThemedText style={styles.loadingText} textType="default">
              Processando...
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  welcome: {
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 120,
    marginBottom: 60,
  },
  cardWrapper: { alignItems: 'center', alignSelf: 'center', width: '100%', position: 'relative' },
  card: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    padding: 25,
    justifyContent: 'flex-start',
  },
  forgotText: { marginTop: 10, fontSize: 14, textAlign: 'center' },
  switchText: { marginTop: 20, fontSize: 14, textAlign: 'center' },
  message: { marginTop: 10, fontSize: 14, textAlign: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  loadingText: { marginTop: 10, fontSize: 16, textAlign: 'center' },
});
