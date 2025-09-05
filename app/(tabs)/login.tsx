import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import LoginRegisterForm from '@src/components/form';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

export type ThemedProps =  {
  lightColor?: string;
  darkColor?: string;
};


export default function LoginAndRegister({ lightColor, darkColor }: ThemedProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const link = useThemeColor({}, 'secondary');

  const handleSubmit = (data: FieldValues) => {
    if (isLogin) {
      // Lógica de login
      console.log('Login:', {
        email: data.email,
        password: data.senha,
      });
    } else {
      // Lógica de registro
      console.log('Registro:', {
        nome: data.nome,
        email: data.email,
        password: data.senha,
      });
    }
  };
  return (
    <ThemedView style={styles.container}>
      <ThemedCard align='center' style={styles.card}>
        <ThemedText style={styles.title} type="title">
          {isLogin ? 'Entre' : 'Se Cadastre'}
        </ThemedText>
        <LoginRegisterForm type={isLogin ? 'login' : 'register'} onSubmit={handleSubmit} />
        <TouchableRipple onPress={() => setIsLogin(!isLogin)}>
          <ThemedText style={styles.switchText} type="link">
            {isLogin ? 'Ainda não possui conta? Registre-se' : 'Já possui conta? Login'}
          </ThemedText>
        </TouchableRipple>
      </ThemedCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    alignSelf: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
  },
  card: {
    height: '80%',
    justifyContent:'center',
  }
});

