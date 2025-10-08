import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
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
  const surfaceColor = useThemeColor({}, 'surface');
  
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
        <PageHeader title="Editar Transação" showBackButton={true} />

        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
          </ScrollView>

          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={styles.loadingText} textType="default">
                Atualizando transação...
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