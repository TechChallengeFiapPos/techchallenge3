import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { UpdateCardData } from '@src/api/firebase/Card';
import { CardRegisterForm } from '@src/components/forms';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import { useCardActions } from '@src/hooks/useCardActions';
import { useCards } from '@src/hooks/useCards';
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
          onPress: () => router.back(),
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
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Editar Cartão" showBackButton={true}/>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title} colorName="onSurfaceVariant" textType="titleSmall">
              Edição de cartão
            </ThemedText>
          </View>

          <View style={styles.cardWrapper}>
            <ThemedCard style={styles.card}>
              <CardRegisterForm
                onSubmit={handleSubmit}
                disabled={loading}
                initialData={cardData}
              />

              {message && (
                <ThemedText style={styles.message} textType="default" colorName="error">
                  ❌ {message}
                </ThemedText>
              )}
            </ThemedCard>

            {loading && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText} textType="default">
                  Atualizando...
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
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  headerContainer: { paddingTop: 120, paddingBottom: 60, minHeight: 200 },
  title: { alignSelf: 'center', fontSize: 28, fontWeight: 'bold' },
  cardWrapper: { width: '100%', flex: 1, position: 'relative' },
  card: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    padding: 25,
    justifyContent: 'flex-start',
    minHeight: 500,
  },
  message: { marginTop: 16, fontSize: 14, textAlign: 'center', fontWeight: '500' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  loadingText: { marginTop: 10, fontSize: 16, textAlign: 'center', color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});