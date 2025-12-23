import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { CreateCardData } from '@src/api/firebase/Card';
import { CardRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { useCardActions } from '@src/presentation/hooks/card/useCardActions';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FieldValues } from 'react-hook-form';
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

export default function CreateCardScreen({ lightColor, darkColor }: ThemedProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formKey, setFormKey] = useState(0);
  const router = useRouter();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const surfaceColor = useThemeColor({}, 'surface');

  const { createCard, loading, error, clearError } = useCardActions();

  const handleSubmit = async (data: FieldValues) => {
    setMessage(null);
    setFieldErrors({});
    clearError();

    const cardData: CreateCardData = {
      number: data.number,
      functions: data.functions || [],
      category: data.category,
      expiryDate: data.expiryDate,
    };

    const result = await createCard(cardData);

    if (result.success) {
      setMessage('Cartão cadastrado com sucesso!');
      Alert.alert('Sucesso!', 'Cartão cadastrado com sucesso!', [
        {
          text: 'Ver cartões',
          onPress: () => router.push('/(tabs)/cards'),
        },
        {
          text: 'Novo cartão',
          onPress: () => {
            setMessage(null);
            setFormKey(prev => prev + 1);
          },
        },
      ]);
    } else {
      setMessage(result.error || 'Erro ao cadastrar cartão');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Cadastre um novo cartão" showBackButton={true} />

        <View style={styles.headerContainer}>
          <ThemedText style={styles.subtitle} colorName="onSurfaceVariant" textType="bodyMedium">
            Registre seus cartões para maior controle
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <CardRegisterForm 
              key={formKey}
              onSubmit={handleSubmit} 
              disabled={loading} 
              errors={fieldErrors} 
            />

            {message && (
              <ThemedText
                style={styles.message}
                textType="default"
                colorName={message.startsWith('❌') ? 'error' : 'primary'}
              >
                {message}
              </ThemedText>
            )}

            {error && !message && (
              <ThemedText style={styles.message} textType="default" colorName="error">
                ❌ {error}
              </ThemedText>
            )}
          </ScrollView>

          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={styles.loadingText} textType="default">
                Salvando cartão...
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
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 140,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 32,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  scrollContent: {
    paddingBottom: 100,
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