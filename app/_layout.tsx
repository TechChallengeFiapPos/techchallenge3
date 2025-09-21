import { darkTheme, lightTheme } from '@config/theme';
import { useColorScheme } from '@hooks/useColorScheme';
import { AuthProvider } from '@src/context/AuthContext';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

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

  useKeepAwake();

  if (!loaded) return null;

  return (
    <AuthProvider>
      <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
        {/* <AuthNavigator /> */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
