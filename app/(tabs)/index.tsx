import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@src/components/ThemedText';
import { ThemedButton } from 'components/ThemedButton';
import { ThemedView } from 'components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Olá, mundo!</ThemedText>
      <ThemedButton title="clique aqui" type="default" onPress={() => console.log('Botão clicado')}>
        Clique aqui
      </ThemedButton>
      <ThemedButton
        title="Entrar"
        type="defaultSemiBold"
        onPress={() => console.log('Pressed')}
        icon={<Ionicons name="log-in-outline" size={20} />}
        iconPosition="left"
        outline
      />
    </ThemedView>
  );
}
