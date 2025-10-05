import { darkTheme, lightTheme } from '@config/theme';
import { AuthProvider, useAuth } from '@src/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@src/contexts/ThemeContext';
import { TransactionProvider } from '@src/contexts/TransactionsContext';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { pt, registerTranslation } from 'react-native-paper-dates';
import 'react-native-reanimated';

function ProtectedLayout() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isInWelcome = pathname.includes('welcome');
    const isInLogin = pathname.includes('login');
    const isInTabs = pathname.includes('(tabs)');

    // Se não tem user e está nas tabs -> /welcome
    if (!user && isInTabs) {
      router.replace('/welcome');
    }
    // Se não tem user e não está em welcome nem login ->  /welcome
    else if (!user && !isInWelcome && !isInLogin) {
      router.replace('/welcome');
    }
    // Se tem user e está em welcome ou login -> /tabs
    else if (user && (isInWelcome || isInLogin)) {
      router.replace('/(tabs)');
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TransactionProvider>
      <PaperProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </PaperProvider>
    </TransactionProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  registerTranslation('pt', pt);
  useKeepAwake();

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}