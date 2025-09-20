import { darkTheme, lightTheme } from '@config/theme';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@hooks/useColorScheme';
import { AuthProvider, useAuth } from '@src/context/AuthContext';
import { Text, View } from 'react-native';

function DebugAuth() {
  const { user, profile, loading } = useAuth();
  if (loading) return <Text>Carregando...</Text>;
  return (
    <View style={{ padding: 16 }}>
      <Text>Usuário: {user?.email || 'Nenhum'}</Text>
      <Text>Nome: {profile?.name || 'Nenhum'}</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useKeepAwake(); // mantém a tela acordada

  if (!loaded) return null;

  return (
    <AuthProvider>
      <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
        <DebugAuth />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
