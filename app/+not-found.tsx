import { ThemedText } from '@components/ThemedText';
import { ThemedView } from '@components/ThemedView';
import { ThemedButton } from '@src/components/ThemedButton';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  const goToDashboard = () => {
    router.push('/(tabs)');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText textType="bodyMedium">Ops! Essa página não existe!</ThemedText>
        <ThemedButton style={styles.button} title='ir para dashboard' onPress={() => goToDashboard} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
