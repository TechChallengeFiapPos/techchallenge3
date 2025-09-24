import { useThemeColor } from '@hooks/useThemeColor';
import { ThemedButton } from '@src/components/ThemedButton';
import { ThemedView } from '@src/components/ThemedView';
import { useRouter } from 'expo-router';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export default function CardsScreen({ lightColor, darkColor }: ThemedProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* ...sua listagem de cartões aqui */}

      <ThemedButton
        type="defaultSemiBold"
        title="Adicionar cartão"
        onPress={() => router.push('/register-card')}
      />
    </ThemedView>
  );
}
