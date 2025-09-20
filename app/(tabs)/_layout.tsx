import { ThemedView } from '@components/ThemedView';
import { Colors } from '@constants/Colors';
import { useColorScheme } from '@hooks/useColorScheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '@src/context/AuthContext'; // 👈 pega usuário logado
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

const ICONS: Record<string, string> = {
  index: 'chart-line',
  explore: 'credit-card-multiple',
  login: 'account',
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.surface }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const iconName = ICONS[route.name] || 'help-circle'; // fallback

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            android_ripple={{ color: themeColors.primary, borderless: false }}
            style={styles.tab}
          >
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: isFocused ? themeColors.primary : 'transparent',
                },
              ]}
            >
              <Icon
                source={iconName}
                size={26}
                color={isFocused ? themeColors.onBackground : themeColors.onSurfaceVariant}
              />
            </View>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

export default function TabLayout() {
  const { user, loading } = useAuth();

  // Enquanto checa login, não renderiza nada
  if (loading) return null;

  // Usuário não logado → só login/registro e sem tab bar
  if (!user) {
    return (
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tabs.Screen name="login" options={{ title: 'Login / Registro' }} />
      </Tabs>
    );
  }

  // Usuário logado → mostra menu com abas
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="explore" options={{ title: 'Layers' }} />
      {/* aqui você pode adicionar mais rotas internas */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 90,
    alignItems: 'center',
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 90,
    overflow: 'hidden', // necessário para ripple circular
    alignItems: 'center',
    justifyContent: 'center',
  },
});
