// import { Ionicons } from '@expo/vector-icons';
// import { ThemedButton } from '@src/components/ThemedButton';
// import { ThemedText } from '@src/components/ThemedText';
// import { ThemedView } from '@src/components/ThemedView';
// import { useAuth } from '@src/context/AuthContext';

// export default function TransactionsScreen() {
//   const { user, logout } = useAuth();
//   return (
//     <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <ThemedText textType="bodyMedium" colorName="onSurface">
//         Olá, {user?.email}
//       </ThemedText>
//       <ThemedButton
//         title="SAIRRRR"
//         type="defaultSemiBold"
//         onPress={logout}
//         icon={<Ionicons name="log-in-outline" size={20} />}
//         iconPosition="left"
//         outline
//       />
//     </ThemedView>
//   );
// }
// app/(tabs)/register-transaction.tsx
import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionRegisterForm } from '@src/components/forms';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import { useTransactions } from '@src/context/TransactionsContext';
import { CreateTransactionData } from '@src/models/transactions';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

type FieldErrors = Record<string, string>;

export default function RegisterTransactionScreen({ lightColor, darkColor }: ThemedProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const { createTransaction, loading, error, clearError } = useTransactions();

  const handleSubmit = async (data: CreateTransactionData) => {
    setMessage(null);
    setFieldErrors({});
    clearError();

    try {
      const result = await createTransaction(data);

      if (result.success) {
        setMessage('Transação cadastrada com sucesso!');
        Alert.alert('Sucesso!', 'Transação cadastrada com sucesso!', [
          {
            text: 'Ver transações',
            onPress: () => router.push('/(tabs)/transactions'),
          },
          {
            text: 'Nova transação',
            onPress: () => {
              setMessage(null);
            },
          },
        ]);
      } else {
        setMessage(`Erro ao cadastrar transação: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      setMessage(`Erro inesperado: ${err.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title} colorName="onSurfaceVariant" textType="titleSmall">
              Nova Transação
            </ThemedText>
            <ThemedText style={styles.subtitle} colorName="onSurfaceVariant" textType="bodyMedium">
              Registre seus gastos e ganhos
            </ThemedText>
          </View>

          <View style={styles.cardWrapper}>
            <ThemedCard style={styles.card}>
              <TransactionRegisterForm
                onSubmit={handleSubmit}
                disabled={loading}
                errors={fieldErrors}
                mode="create"
              />

              {message && (
                <ThemedText
                  style={styles.message}
                  textType="default"
                  colorName={message.startsWith('Erro') ? 'error' : 'primary'}
                >
                  {message}
                </ThemedText>
              )}

              {error && !message && (
                <ThemedText style={styles.message} textType="default" colorName="error">
                  {error}
                </ThemedText>
              )}
            </ThemedCard>

            {loading && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText} textType="default">
                  Salvando transação...
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  cardWrapper: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  card: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    padding: 25,
    justifyContent: 'flex-start',
    minHeight: 600,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
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
    color: '#fff',
  },
});
