import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionRegisterForm } from '@src/components/forms';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import { useTransactions } from '@src/contexts/TransactionsContext';
import { Transaction, UpdateTransactionData } from '@src/models/transactions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const { updateTransaction, loading, error, clearError, allTransactions } = useTransactions();

  useEffect(() => {
    const found = allTransactions.find((t) => t.id === id);
    if (found) {
      setTransaction(found);
    } else {
      Alert.alert('Erro', 'Transação não encontrada', [
        { text: 'Voltar', onPress: () => router.back() },
      ]);
    }
  }, [id, allTransactions]);

  const handleSubmit = async (data: UpdateTransactionData) => {
    if (!transaction) return;

    setMessage(null);
    clearError();

    try {
      const result = await updateTransaction(transaction.id, data);

      if (result.success) {
        setMessage('Transação atualizada com sucesso!');
        Alert.alert('Sucesso!', 'Transação atualizada com sucesso!', [
          {
            text: 'Ver transações',
            onPress: () => router.push('/(tabs)/transactions'),
          },
        ]);
      } else {
        setMessage(`Erro ao atualizar: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      setMessage(`Erro inesperado: ${err.message}`);
    }
  };

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
              Editar Transação
            </ThemedText>
            <ThemedText style={styles.subtitle} colorName="onSurfaceVariant" textType="bodyMedium">
              Atualize os dados da transação
            </ThemedText>
          </View>

          <View style={styles.cardWrapper}>
            <ThemedCard style={styles.card}>
              <TransactionRegisterForm
                onSubmit={handleSubmit}
                disabled={loading}
                initialData={{
                  type: transaction.type,
                  value: transaction.value,
                  categoryId: transaction.categoryId,
                  methodId: transaction.methodId,
                  cardId: transaction.cardId,
                  description: transaction.description,
                  date: transaction.date,
                  attachment: transaction.attachment,
                }}
                mode="edit"
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
                  Atualizando transação...
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