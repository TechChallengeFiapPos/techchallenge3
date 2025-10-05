import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { ThemedButton } from '@src/components/ThemedButton';
import { ThemedCard } from '@src/components/ThemedCard';
import { ThemedText } from '@src/components/ThemedText';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(buttonSlide, {
        toValue: 0,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedCard style={styles.card}>
        <View style={styles.headerContainer}>
          <Animated.View
            style={[
              styles.logoCircle,
              { backgroundColor: primaryColor },
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require('../assets/images/bytebank-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <Animated.View style={[styles.cardContent, { opacity: contentOpacity }]}>
          <ThemedText textType="displayMedium" style={styles.appName}>
            ByteBank
          </ThemedText>

          <ThemedText textType="bodyLarge" colorName="onSurfaceVariant" style={styles.tagline}>
            Seu gerenciador financeiro pessoal
          </ThemedText>

          <Animated.View style={{ transform: [{ translateY: buttonSlide }] }}>
            <ThemedButton
              title="Começar"
              onPress={() => router.replace('/login')}
              buttonStyle={styles.button}
              type="defaultSemiBold"
            />
          </Animated.View>
        </Animated.View>
      </ThemedCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContainer: {
    paddingTop: 120,
    paddingBottom: 60,
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  card: {
    width: '100%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 0,
    marginVertical: 0,
    marginBottom: 0,
  },
  cardContent: {
    alignItems: 'center',
    paddingBottom: 200,
  },
  appName: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.8,
  },
  button: {
    minWidth: 200,
  },
});