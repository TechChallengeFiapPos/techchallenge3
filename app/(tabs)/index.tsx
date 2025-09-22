import { Ionicons } from '@expo/vector-icons';
import { ThemedButton } from '@src/components/ThemedButton';
import { ThemedText } from '@src/components/ThemedText';
import { ThemedView } from '@src/components/ThemedView';
import { useAuth } from '@src/context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText textType="bodyMedium" colorName="onSurface">
        Olá, {user?.email}
      </ThemedText>
      <ThemedButton
        title="SAIRRRR"
        type="defaultSemiBold"
        onPress={logout}
        icon={<Ionicons name="log-in-outline" size={20} />}
        iconPosition="left"
        outline
      />
    </ThemedView>
  );
}
