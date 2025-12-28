import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { CreateTransactionData } from '@src/domain/entities/Transaction';
import { useCreateTransaction } from '@src/presentation/hooks/transaction';
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

export default function CreateTransactionScreen({ lightColor, darkColor }: ThemedProps) {
  const [formKey, setFormKey] = useState(0);
  const router = useRouter();
  const { mutate: createTransaction, isPending, error } = useCreateTransaction();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const surfaceColor = useThemeColor({}, 'surface');



  const handleSubmit = (data: CreateTransactionData) => {
    createTransaction(data, {
      onSuccess: () => {
        Alert.alert('Sucesso!', 'Transação cadastrada com sucesso!', [
          {
            text: 'Ver transações',
            onPress: () => router.push('/(tabs)/transactions'),
          },
          {
            text: 'Nova transação',
            onPress: () => {
              setFormKey((prev) => prev + 1);
            },
          },
        ]);
      },
      onError: (error: any) => {
        Alert.alert('Erro', error.message || 'Erro ao cadastrar transação');
      },
    }); 
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
              disabled={isPending}
              mode="create"
            />

            {error && (
              <ThemedText style={styles.message} textType="default" colorName="error">
                {error.message}
              </ThemedText>
            )}
          </ScrollView>

          {isPending && (
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