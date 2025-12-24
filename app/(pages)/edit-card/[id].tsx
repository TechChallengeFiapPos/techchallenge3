import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { CardRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { UpdateCardData } from '@src/domain/entities/Card';
import { useCardActions } from '@src/presentation/hooks/card/useCardActions';
import { useCards } from '@src/presentation/hooks/card/useCards';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

  const [message, setMessage] = useState<string | null>(null);
  const [cardData, setCardData] = useState<any>(null);

  const { getCard } = useCards();
  const { updateCard, loading } = useCardActions();

  useEffect(() => {
    loadCard();
  }, [id]);

  const loadCard = async () => {
    if (!id) return;

    const result = await getCard(id);
    if (result.success && result.card) {
      setCardData(result.card);
    } else {
      Alert.alert('Erro', 'Cartão não encontrado');
      router.back();
    }
  };

  const handleSubmit = async (data: FieldValues) => {
    if (!id) return;

    setMessage(null);

    const updateData: UpdateCardData = {
      number: data.number,
      functions: data.functions || [],
      category: data.category,
      expiryDate: data.expiryDate,
    };

    const result = await updateCard(id, updateData);

    if (result.success) {
      Alert.alert('Sucesso!', 'Cartão atualizado!', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/cards'),
        },
      ]);
    } else {
      setMessage(result.error || 'Erro ao atualizar cartão');
    }
  };

  if (!cardData) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Editar Cartão" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
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
              disabled={loading}
              initialData={cardData}
            />

            {message && (
              <ThemedText style={styles.message} textType="default" colorName="error">
                {message}
              </ThemedText>
            )}
          </ScrollView>

          {loading && (
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