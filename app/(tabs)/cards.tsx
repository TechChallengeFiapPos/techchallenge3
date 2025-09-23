import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { CardRegisterForm } from '@src/components/forms';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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

export default function CardsScreen({ lightColor, darkColor }: ThemedProps) {
  const [card, setCard] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  //   const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const handleSubmit = () => {
    console.log('submiteeeeeiiiiii');
  };

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
              Cadastro de novo cartão
            </ThemedText>
          </View>

          <View style={styles.cardWrapper}>
            <ThemedCard style={styles.card}>
              <CardRegisterForm
                onSubmit={handleSubmit}
                disabled={loading}
                // errors={fieldErrors} // passa os erros para o form
              />

              {message && (
                <ThemedText
                  style={styles.message}
                  textType={message.startsWith('❌') ? 'default' : 'default'}
                >
                  {message}
                </ThemedText>
              )}
            </ThemedCard>

            {loading && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText} textType="default">
                  Processando...
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
    paddingTop: 120,
    paddingBottom: 60,
    minHeight: 200, // Altura fixa para evitar movimento do menu
  },
  title: {
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'bold',
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
    minHeight: 500, // Altura mínima fixa evitar movimento do menu
  },
  forgotText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  switchText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
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
  },
});
