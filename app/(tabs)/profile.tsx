import { ThemedView } from '@components/ThemedView';
import { useThemeColor } from '@hooks/useThemeColor';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedText } from '@src/components/ThemedText';
import { useAuth } from '@src/contexts/AuthContext';
import { useTheme } from '@src/contexts/ThemeContext';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, List, Switch } from 'react-native-paper';


export default function ProfileScreen() {
  const { profile, logout } = useAuth();
  const { theme, setThemeMode } = useTheme();

  const isDarkMode = theme === 'dark';

  const handleThemeToggle = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'error');


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
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Perfil" showBackButton={true}/>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.logoContainer}>
          <View style={[styles.logoBig, { backgroundColor: primaryColor }]}>
            <Image
              source={require('../../assets/images/bytebank-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <ThemedText textType="titleMedium" style={styles.cardTitle}>
            Informações da Conta
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText textType="bodyMedium" colorName="onSurfaceVariant">
              Nome
            </ThemedText>
            <ThemedText textType="bodyLarge" style={styles.infoValue}>
              {profile?.name || 'Não informado'}
            </ThemedText>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <ThemedText textType="bodyMedium" colorName="onSurfaceVariant">
              Email
            </ThemedText>
            <ThemedText textType="bodyLarge" style={styles.infoValue}>
              {profile?.email}
            </ThemedText>
          </View>
        </View>

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

        <View style={[styles.logoutButton, { backgroundColor: surfaceColor }]}>
          <List.Item
            title="Sair da Conta"
            titleStyle={{ color: danger, fontWeight: '600' }}
            left={props => <List.Icon {...props} icon="logout" color={danger} />}
            onPress={handleLogout}
          />
        </View>

      {/* REMOVER DEPOIS - ADICIONADO TEMPORARIAMENTE PARA MENSURAR MÉTRICAS */}
       {__DEV__ && (
        <>
        <View style={{ padding: 10 }}>
          <Button 
            onPress={() => {
              const report = (global as any).metrics.printReport();
              console.log('📄 Relatório gerado!');
            }} 
          >Ver Métricas</Button>


          <Button 
            onPress={() => {
              const report = (global as any).metrics.reset();
              console.log('📄 Relatório resetado!');
            }} 
          >Resetar Métricas</Button>
        </View>
        </>
      )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  logoContainer: { alignItems: 'center', paddingVertical: 14 },
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
  logoutButton: { borderRadius: 12, elevation: 2 },
});