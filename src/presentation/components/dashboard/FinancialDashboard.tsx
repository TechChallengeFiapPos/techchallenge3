import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { useAllTransactions } from '@src/presentation/hooks/transaction';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ProgressBar, Surface, Text } from 'react-native-paper';
import { DashboardSkeleton } from '../skeletons/DashboardSkeleton';

export function FinancialDashboard() {
  const { 
    data: allTransactions = [], 
    isLoading,
    error 
  } = useAllTransactions();

  // calcula totais a partir das transações
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);

    const expenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [allTransactions]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.parallel([
      Animated.timing(cardFadeAnim, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.spring(cardSlideAnim, { toValue: 0, friction: 8, tension: 40, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const backgroundColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const secondary = useThemeColor({}, 'secondary');
  const errorColor = useThemeColor({}, 'error');

  const formatCurrency = (valueInCents: number): string => {
    const reais = valueInCents / 100;
    return reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const progressValue = Math.min(expensePercentage / 100, 1);

  const getStatusMessage = (): string => {
    if (expensePercentage <= 30) {
      return `${expensePercentage < 0.01 ? '<0,01' : expensePercentage.toFixed(2).replace('.', ',')}% da sua renda gasta. Muito bem!`;
    } else if (expensePercentage <= 70) {
      return `${expensePercentage.toFixed(2).replace('.', ',')}% da sua renda gasta. Fique atento.`;
    } else {
      return `${expensePercentage.toFixed(2).replace('.', ',')}% da sua renda gasta. Cuidado!`;
    }
  };

  // loading state
  if (isLoading) {
    return (
      <DashboardSkeleton />
    );
  }

  // error state
  if (error) {
    return (
      <Surface style={[styles.mainCard, { backgroundColor }]}>
        <Text style={{ color: errorColor, textAlign: 'center' }}>
          Erro ao carregar dados financeiros
        </Text>
      </Surface>
    );
  }

  return (
    <View>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Surface style={[styles.mainCard, { backgroundColor }]}>
          <View style={styles.balanceItem}>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet" size={16} color={onSurfaceVariantColor} />
              <Text variant="bodySmall" style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}>
                Saldo Total
              </Text>
            </View>
            <Text variant="displaySmall" style={[styles.balanceValue, { color: onSurfaceColor }]}>
              {formatCurrency(balance)}
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: onSurfaceVariantColor + '30' }]} />

          <View style={styles.balanceItem}>
            <View style={styles.balanceHeader}>
              <Ionicons name="trending-down" size={16} color={onSurfaceVariantColor} />
              <Text variant="bodySmall" style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}>
                Total de Despesas
              </Text>
            </View>
            <Text variant="headlineMedium" style={[styles.expenseValue, { color: onSurfaceColor }]}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
        </Surface>
      </Animated.View>

      <Animated.View style={{ opacity: cardFadeAnim, transform: [{ translateY: cardSlideAnim }] }}>
        <View style={styles.cardsContainer}>
          <Surface style={[styles.card, { backgroundColor: surfaceColor }]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: primaryColor }]}>
                <Ionicons name="arrow-down" size={24} color="white" />
              </View>
              <View style={styles.cardInfo}>
                <Text variant="bodySmall" style={[styles.cardLabel, { color: onSurfaceVariantColor }]}>
                  Receitas
                </Text>
                <Text variant="titleLarge" style={[styles.cardValue, { color: onSurfaceColor }]}>
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
            </View>
          </Surface>

          <Surface style={[styles.card, { backgroundColor: surfaceColor }]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: errorColor }]}>
                <Ionicons name="arrow-up" size={24} color="white" />
              </View>
              <View style={styles.cardInfo}>
                <Text variant="bodySmall" style={[styles.cardLabel, { color: onSurfaceVariantColor }]}>
                  Despesas
                </Text>
                <Text variant="titleLarge" style={[styles.cardValue, { color: onSurfaceColor }]}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
            </View>
          </Surface>

          <View>
            <View style={styles.progressLabels}>
              <Text variant="bodySmall" style={[styles.progressLabel, { color: onSurfaceColor }]}>
                {expensePercentage < 0.01 ? '<0,01%' : `${expensePercentage.toFixed(2).replace('.', ',')}%`}
              </Text>
              <Text variant="bodySmall" style={[styles.progressTarget, { color: onSurfaceVariantColor }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <ProgressBar
              progress={Math.max(progressValue, 0.02)}
              color={errorColor}
              style={[styles.progressBar, { backgroundColor: secondary }]}
            />
          </View>

          <View style={styles.statusSection}>
            <Ionicons name="checkmark-circle" size={16} color={secondary} />
            <Text variant="bodySmall" style={[styles.statusText, { color: onSurfaceVariantColor }]}>
              {getStatusMessage()}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    borderRadius: 20,
    elevation: 2,
    margin: 16,
    padding: 16,
  },
  balanceItem: {
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  balanceLabel: {
    opacity: 0.8,
  },
  balanceValue: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  expenseValue: {
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  separator: {
    height: 1,
    marginVertical: 16,
    opacity: 0.5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontWeight: '600',
  },
  progressTarget: {
    opacity: 0.7,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 20,
  },
  statusText: {
    flex: 1,
    fontSize: 12,
  },
  cardsContainer: {
    marginTop: 0,
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    elevation: 1,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    marginBottom: 4,
  },
  cardValue: {
    fontWeight: '600',
  },
});