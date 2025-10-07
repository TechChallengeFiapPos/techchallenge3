import { ThemedView } from '@components/ThemedView';
import { Colors } from '@constants/Colors';
import { useColorScheme } from '@hooks/useColorScheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS: Record<string, string> = {
  index: 'chart-line',
  cards: 'credit-card-multiple',
  transactions: 'bank-transfer-in',
  profile: 'account',
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: themeColors.inverseSurface,
          paddingBottom: insets.bottom,
        },
      ]}
    >
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

        const iconName = ICONS[route.name] || 'help-circle';

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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transações' }} />
      <Tabs.Screen name="cards" options={{ title: 'Cartões' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 90,
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 90,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
