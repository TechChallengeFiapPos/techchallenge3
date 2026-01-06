import { useThemeColor } from '@hooks/useThemeColor';
import { useAuth } from '@src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  showLogo?: boolean;
}

export function PageHeader({
  title,
  showBackButton = true,
  showLogo = true,
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

  return (
    <Appbar.Header
      style={[
        styles.header,
        {
          backgroundColor,
          paddingTop: insets.top,
          height: 60 + insets.top,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        },
      ]}
      elevated={true}
    >
      {showLogo && (
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: primaryColor }]}>
            <Image
              source={require('../assets/images/bytebank-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      {showBackButton && (
        <Appbar.BackAction onPress={handleBack} color={onSurfaceColor} size={24} />
      )}

      <Appbar.Content title={title} titleStyle={[styles.title, { color: onSurfaceColor }]} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  logoContainer: {
    marginLeft: 8,
    marginRight: 16,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 24,
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