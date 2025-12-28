import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { useAuth } from '@src/contexts/AuthContext';
import { UpdateTransactionData } from '@src/domain/entities/Transaction';
import { useTransaction, useUpdateTransaction } from '@src/presentation/hooks/transaction';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
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
  const { data: transaction,  isLoading: isLoadingTransaction, error: loadError } = useTransaction(id);
  const { mutate: updateTransaction, isPending, error: updateError } = useUpdateTransaction();  
  const router = useRouter();
  const { user } = useAuth();

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');

  const handleSubmit = (data: UpdateTransactionData) => {
    if (!id) return;

    updateTransaction(
      { id, data },
      { onSuccess: () => {
          Alert.alert('Sucesso!', 'Transação atualizada com sucesso!', [
            {
              text: 'Ver transações',
              onPress: () => router.push('/(tabs)/transactions'),
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Erro', error.message || 'Erro ao atualizar transação');
        },
      }
    );
  };

  if (!user || isLoadingTransaction) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (loadError || !transaction) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', padding: 32 }]}>
        <ThemedText style={styles.message} textType="default" colorName="error">
          {loadError?.message || 'Transação não encontrada'}
        </ThemedText>
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
              disabled={isPending}
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

            {updateError && (
              <ThemedText style={styles.message} textType="default" colorName="error">
                {updateError.message}
              </ThemedText>
            )}
          </ScrollView>

          {isPending && (
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