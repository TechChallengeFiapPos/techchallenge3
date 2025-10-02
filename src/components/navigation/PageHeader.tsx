import { useThemeColor } from '@hooks/useThemeColor';
import { useAuth } from '@src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  showLogout?: boolean;
}

export function PageHeader({
  title,
  showBackButton = true,
  showLogout = true,
}: PageHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const backgroundColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // O redirecionamento para /login será feito automaticamente
              // pelo seu sistema de autenticação no _layout.tsx
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <Appbar.Header
      style={[
        styles.header,
        {
          backgroundColor,
          paddingTop: insets.top,
          height: 60 + insets.top,
        },
      ]}
      elevated={true}
    >
      {/* Logo ou ícone do app */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoCircle, { backgroundColor: primaryColor }]}>
          <Text variant="titleMedium" style={styles.logoText}>
            $
          </Text>
        </View>
      </View>

      {/* Botão de voltar */}
      {showBackButton && (
        <Appbar.BackAction onPress={handleBack} color={onSurfaceColor} size={24} />
      )}

      {/* Título da página */}
      <Appbar.Content title={title} titleStyle={[styles.title, { color: onSurfaceColor }]} />

      {/* Botão de logout */}
      {showLogout && (
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
          android_ripple={{ color: primaryColor + '30', borderless: true }}
        >
          <Appbar.Action icon="logout" color={onSurfaceColor} size={24} onPress={handleLogout} />
        </Pressable>
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  logoContainer: {
    marginLeft: 8,
    marginRight: 4,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
  },
  logoutButton: {
    borderRadius: 20,
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
});