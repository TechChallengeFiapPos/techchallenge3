import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { useAuth } from '@src/contexts/AuthContext';
import { useTheme } from '@src/contexts/ThemeContext';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, List, Switch } from 'react-native-paper';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'error');

  const { user, logout } = useAuth();
  const { theme, setThemeMode } = useTheme();

  const isDarkMode = theme === 'dark';

  const handleThemeToggle = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Perfil" showBackButton={false} showLogout={false} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoBig, { backgroundColor: primaryColor }]}>
            <Image
              source={require('../../assets/images/bytebank-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Informações do Usuário */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ThemedText textType="titleMedium" style={styles.cardTitle}>
            Informações da Conta
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText textType="bodyMedium" colorName="onSurfaceVariant">
              Nome
            </ThemedText>
            <ThemedText textType="bodyLarge" style={styles.infoValue}>
              {user?.displayName || 'Não informado'}
            </ThemedText>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <ThemedText textType="bodyMedium" colorName="onSurfaceVariant">
              Email
            </ThemedText>
            <ThemedText textType="bodyLarge" style={styles.infoValue}>
              {user?.email}
            </ThemedText>
          </View>
        </View>

        {/* Configurações de Aparência */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ThemedText textType="titleMedium" style={styles.cardTitle}>
            Aparência
          </ThemedText>

          <List.Item
            title="Modo Escuro"
            description={isDarkMode ? 'Ativado' : 'Desativado'}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={primaryColor} />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                color={primaryColor}
              />
            )}
          />
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <List.Item
            title="Sair da Conta"
            titleStyle={{ color: danger, fontWeight: '600' }}
            left={props => <List.Icon {...props} icon="logout" color={danger} />}
            onPress={logout}
            style={[styles.logoutButton, { backgroundColor: surfaceColor }]}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  logoContainer: { alignItems: 'center', paddingVertical: 32 },
  logoBig: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  logo: { width: 80, height: 80 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontWeight: 'bold', marginBottom: 16 },
  infoRow: { paddingVertical: 12 },
  infoValue: { marginTop: 4, fontWeight: '600' },
  divider: { marginVertical: 8 },
  logoutContainer: { marginTop: 16 },
  logoutButton: { borderRadius: 12, elevation: 2 },
});