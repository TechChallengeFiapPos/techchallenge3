import { ThemedView } from '@components/ThemedView';
import { auth, db } from '@config/firebaseConfig';
import { useThemeColor } from '@hooks/useThemeColor';
import { LoginRegisterForm } from '@src/components/form';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import { useAuth } from '@src/context/AuthContext';
import { ThemedButton } from 'components/ThemedButton';
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

export default function LoginAndRegister({ lightColor, darkColor }: ThemedProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const link = useThemeColor({}, 'secondary');

  const handleSubmit = async (data: FieldValues) => {
    setLoading(true);
    setMessage(null);

    const email = data.email;
    const password = data.senha;
    const name = data.nome;

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
      <ThemedText style={styles.welcome} colorName="onSurfaceVariant" type="title">
        Bem-vindo
      </ThemedText>

      <ThemedView style={styles.cardWrapper}>
        <ThemedCard style={styles.card}>
          <LoginRegisterForm
            type={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            disabled={loading}
          />

          {/* Mensagem de erro ou sucesso */}
          {message && (
            <ThemedText
              style={styles.message}
              type="caption"
              colorName={message.startsWith('❌') ? 'error' : 'primary'}
            >
              {message}
            </ThemedText>
          )}

          {/* Esqueci minha senha */}
          {isLogin && (
            <TouchableRipple onPress={() => console.log('Esqueci minha senha')} disabled={loading}>
              <ThemedText style={styles.forgotText} type="link">
                Esqueceu a senha?
              </ThemedText>
            </TouchableRipple>
          )}

          {/* Alternar Login/Registro */}
          <TouchableRipple onPress={() => setIsLogin(!isLogin)} disabled={loading}>
            <ThemedText style={[styles.switchText, { color: link }]} type="link">
              {isLogin ? 'Ainda não possui conta? Registre-se' : 'Já possui conta? Entre'}
            </ThemedText>
          </TouchableRipple>

          {/* Usuário atual */}
          <>
            <ThemedText>Olá, {user?.email}</ThemedText>
            <ThemedButton type="default" onPress={logout} title="sair" />
          </>
        </ThemedCard>

        {/* Overlay de carregamento */}
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={link} />
            <ThemedText style={styles.loadingText} type="body">
              Processando...
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  welcome: {
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 120,
    marginBottom: 60,
  },
  cardWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    position: 'relative',
  },
  card: {
    flex: 1,
    width: '100%',
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
  message: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  currentUser: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    color: '#777',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
