import { useThemeColor } from '@hooks/useThemeColor';
import { UpdateCardData } from '@src/domain/entities/Card';
import { CardRegisterForm } from '@src/presentation/components/forms';
import { PageHeader } from '@src/presentation/components/navigation/PageHeader';
import { ThemedText } from '@src/presentation/components/ThemedText';
import { ThemedView } from '@src/presentation/components/ThemedView';
import { useUpdateCard } from '@src/presentation/hooks/card/mutations/useCardsMutations';
import { useCard } from '@src/presentation/hooks/card/queries/useCardsQueries';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
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

export default function EditCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');

  const { 
    data: card, 
    isLoading: isLoadingCard,
    error: loadError 
  } = useCard(id);

  const { 
    mutate: updateCard, 
    isPending,
    error: updateError 
  } = useUpdateCard();

  const handleSubmit = (data: FieldValues) => {
    if (!id) return;

    const updateData: UpdateCardData = {
      number: data.number,
      functions: data.functions || [],
      category: data.category,
      expiryDate: data.expiryDate,
    };

    updateCard(
      { id, data: updateData },
      {
        onSuccess: () => {
          Alert.alert('Sucesso!', 'Cartão atualizado!', [
            {
              text: 'OK',
              onPress: () => router.push('/(tabs)/cards'),
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Erro', error.message || 'Erro ao atualizar cartão');
        },
      }
    );
  };

  if (isLoadingCard) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Editar Cartão" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ThemedView>
    );
  }

  if (loadError || !card) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Editar Cartão" showBackButton={true} />
        <View style={[styles.loadingContainer, { padding: 32 }]}>
          <ThemedText style={styles.message} textType="default" colorName="error">
            {loadError?.message || 'Cartão não encontrado'}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Editar Cartão" showBackButton={true} />

        <View style={styles.headerContainer}>
          <ThemedText style={styles.subtitle} colorName="onSurfaceVariant" textType="bodyMedium">
            Atualize as informações do cartão
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <CardRegisterForm
              onSubmit={handleSubmit}
              disabled={isPending}
              initialData={card}
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
                Atualizando cartão...
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});