import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import LoginRegisterForm from '@src/components/form';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export default function LoginAndRegister({ lightColor, darkColor }: ThemedProps) {
  const [isLogin, setIsLogin] = useState(true);

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const link = useThemeColor({}, 'secondary');

  const handleSubmit = (data: FieldValues) => {
    if (isLogin) {
      console.log('Login:', {
        email: data.email,
        password: data.senha,
      });
    } else {
      console.log('Registro:', {
        nome: data.nome,
        email: data.email,
        password: data.senha,
      });
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.welcome} colorName='onSurfaceVariant' type="title">
        Bem-vindo
      </ThemedText>

      <ThemedCard style={styles.card}>
        <LoginRegisterForm type={isLogin ? 'login' : 'register'} onSubmit={handleSubmit} />

        {/* Esqueci minha senha */}
        {isLogin && (
          <TouchableRipple onPress={() => console.log('Esqueci minha senha')}>
            <ThemedText style={styles.forgotText} type="link">
              Esqueceu a senha?
            </ThemedText>
          </TouchableRipple>
        )}

        {/* Alternar Login/Registro */}
        <TouchableRipple onPress={() => setIsLogin(!isLogin)}>
          <ThemedText style={[styles.switchText, { color: link }]} type="link">
            {isLogin ? 'Ainda não possui conta? Registre-se' : 'Já possui conta? Entre'}
          </ThemedText>
        </TouchableRipple>
      </ThemedCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 120,
    marginBottom: 60,
  },
  card: {
    flex: 1,
    width: '95%',
    minHeight: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    padding: 25,
    justifyContent: 'flex-start',
  },
  forgotText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  switchText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 10,
    color: '#aaa',
  },
});
