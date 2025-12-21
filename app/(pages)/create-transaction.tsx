import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { useTransactions } from '@src/contexts/TransactionsContext';
import { CreateTransactionData } from '@src/domain/entities/Transaction';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function CreateTransactionScreen({ lightColor, darkColor }: ThemedProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formKey, setFormKey] = useState(0);
  const router = useRouter();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const surfaceColor = useThemeColor({}, 'surface');

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
              setFormKey(prev => prev + 1); 
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
        <PageHeader title="Nova Transação" showBackButton={true} />

        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TransactionRegisterForm
              onSubmit={handleSubmit}
              key={formKey}
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
          </ScrollView>

          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={styles.loadingText} textType="default">
                Salvando transação...
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 24,
    paddingHorizontal: 16,
    marginVertical: 0,
    marginTop: 42,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});