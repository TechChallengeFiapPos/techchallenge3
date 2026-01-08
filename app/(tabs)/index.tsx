import { useThemeColor } from '@hooks/useThemeColor';
import { useAuth } from '@src/contexts/AuthContext';
import { FinancialDashboard } from '@src/presentation/components/dashboard/FinancialDashboard';
import { PageHeader } from '@src/presentation/components/navigation/PageHeader';
import { ThemedView } from '@src/presentation/components/ThemedView';
import { useAllTransactions } from '@src/presentation/hooks/transaction';
import { metrics } from '@src/utils/metrics';
import { useRouter } from 'expo-router';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LazyFinancialCharts = lazy(() =>
  import('@src/presentation/components/charts/FinancialCharts').then(module => ({
    default: module.FinancialCharts
  }))
);

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const negative = useThemeColor({}, 'error');

  const { data: allTransactions = [], isLoading, error } = useAllTransactions();
  const { profile } = useAuth();
  const [loadStart] = useState(Date.now());

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    metrics.logNavigation('App', 'Dashboard');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    return () => {
      const loadTime = Date.now() - loadStart;
      metrics.logLoadTime('Dashboard', loadTime);
    };
  }, []);

  const recentTransactions = useMemo(() => {
    return allTransactions.slice(0, 3);
  }, [allTransactions]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Dashboard" showBackButton={false} />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={{ color: onSurfaceColor, marginTop: 16 }}>Carregando...</Text>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Dashboard" showBackButton={false} />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
          <Text style={{ color: negative, textAlign: 'center' }}>
            {error.message || 'Erro ao carregar dados'}
          </Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Dashboard" showBackButton={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text variant="headlineSmall" style={[styles.welcomeText, { color: onSurfaceColor }]}>
            Olá, {profile?.name || 'Usuário'}!
          </Text>
        </View>

        <FinancialDashboard />

        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LazyFinancialCharts transactions={allTransactions} />

          <Suspense
            fallback={
              <View style={styles.chartsLoader}>
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            }
          >
            <LazyFinancialCharts transactions={allTransactions} />
          </Suspense>

        </Animated.View>

        <View style={styles.headerSection}>
          <View style={styles.sectionHeader}>
            <Text
              variant="headlineSmall"
              style={[styles.sectionTitle, { color: onSurfaceColor }]}
            >
              Transações Recentes
            </Text>
            <Button
              mode="text"
              onPress={() => router.push('/transactions')}
              textColor={primaryColor}
            >
              Ver todas
            </Button>
          </View>
        </View>

        <View style={[styles.transactionsCard, { backgroundColor: surfaceColor }]}>
          {recentTransactions.length > 0 ? (
            <View>
              {recentTransactions.map((transaction, index) => (
                <View
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    index !== recentTransactions.length - 1 && styles.transactionBorder,
                  ]}
                >
                  <View style={styles.transactionInfo}>
                    <Text variant="bodyLarge" style={{ color: onSurfaceColor }}>
                      {transaction.description || 'Sem descrição'}
                    </Text>
                    <Text variant="bodySmall" style={{ color: onSurfaceColor, opacity: 0.7 }}>
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text
                    variant="titleMedium"
                    style={{
                      color: transaction.type === 'income' ? primaryColor : negative,
                      fontWeight: '600',
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {(transaction.value / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text
                variant="bodyMedium"
                style={{ color: onSurfaceColor, opacity: 0.7, textAlign: 'center' }}
              >
                Você não possui transação ainda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  welcomeText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  headerSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  transactionsCard: {
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  transactionInfo: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  chartsLoader: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});