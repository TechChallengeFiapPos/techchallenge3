import { useThemeColor } from '@hooks/useThemeColor';
import { CreateCardData } from '@src/domain/entities/Card';
import { CardRegisterForm } from '@src/presentation/components/forms';
import { PageHeader } from '@src/presentation/components/navigation/PageHeader';
import { ThemedText } from '@src/presentation/components/ThemedText';
import { ThemedView } from '@src/presentation/components/ThemedView';
import { useCreateCard } from '@src/presentation/hooks/card/mutations/useCardsMutations';
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

export default function CreateCardScreen({ lightColor, darkColor }: ThemedProps) {
  const [formKey, setFormKey] = useState(0);
  const router = useRouter();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const surfaceColor = useThemeColor({}, 'surface');

  const { 
    mutate: createCard, 
    isPending,
    error 
  } = useCreateCard();

  const handleSubmit = (data: FieldValues) => {
    const cardData: CreateCardData = {
      number: data.number,
      functions: data.functions || [],
      category: data.category,
      expiryDate: data.expiryDate,
    };

    createCard(cardData, {
      onSuccess: () => {
        Alert.alert('Sucesso!', 'Cartão cadastrado com sucesso!', [
          {
            text: 'Ver cartões',
            onPress: () => router.push('/(tabs)/cards'),
          },
          {
            text: 'Novo cartão',
            onPress: () => {
              setFormKey((prev) => prev + 1);
            },
          },
        ]);
      },
      onError: (error: any) => {
        Alert.alert('Erro', error.message || 'Erro ao cadastrar cartão');
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
              disabled={isPending}
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