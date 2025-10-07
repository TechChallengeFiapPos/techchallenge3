import { useThemeColor } from '@hooks/useThemeColor';
import { FinancialCharts } from '@src/components/charts/FinancialCharts';
import { FinancialDashboard } from '@src/components/dashboard/FinancialDashboard';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedView } from '@src/components/ThemedView';
import { useTransactions } from '@src/contexts/TransactionsContext';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const negative = useThemeColor({}, 'error');

  const { allTransactions } = useTransactions();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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
  }, []);

  const recentTransactions = useMemo(() => {
    return allTransactions.slice(0, 3);
  }, [allTransactions]);

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
        <FinancialDashboard />

        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <FinancialCharts transactions={allTransactions} />
        </Animated.View>

        <View style={styles.section}>
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

          {recentTransactions.length > 0 ? (
            <Card style={[styles.transactionsCard, { backgroundColor: surfaceColor }]}>
              <Card.Content>
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
              </Card.Content>
            </Card>
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: surfaceColor }]}>
              <Card.Content>
                <Text
                  variant="bodyMedium"
                  style={{ color: onSurfaceColor, opacity: 0.7, textAlign: 'center' }}
                >
                  Você não possui transação ainda.
                </Text>
              </Card.Content>
            </Card>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  transactionsCard: {
    borderRadius: 16,
    elevation: 2,
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
  emptyCard: {
    borderRadius: 16,
    elevation: 2,
    padding: 24,
  },
});