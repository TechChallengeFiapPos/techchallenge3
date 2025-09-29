import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { useTransactions } from '@src/context/TransactionsContext';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ProgressBar, Surface, Text } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

const isTablet = screenWidth > 768;
const isLandscape = screenWidth > 600;

const formatCurrency = (centavos: number): string => {
  const reais = centavos / 100;
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Estilos dinâmicos
const dynamicStyles = {
  container: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 20 : 16,
  },
  balanceSection: {
    marginBottom: isTablet ? 24 : 20,
  },
  cardsContainer: {
    flexDirection: isLandscape ? 'row' : 'column',
    gap: isTablet ? 16 : 12,
    marginBottom: isTablet ? 24 : 20,
  },
  card: {
    flex: isLandscape ? 1 : undefined,
    padding: isTablet ? 20 : 16,
  },
};

export const FinancialDashboard: React.FC = () => {
  const { totalIncome, totalExpenses, balance } = useTransactions();

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const progressValue = Math.min(expensePercentage / 100, 1);

  console.log('Dashboard:', {
    totalIncome,
    totalExpenses,
    balance,
    expensePercentage,
    progressValue,
  });

  const getStatusMessage = (): string => {
    if (expensePercentage <= 30) {
      return `${Math.round(expensePercentage)}% da sua renda gasta, parece bom.`;
    } else if (expensePercentage <= 70) {
      return `${Math.round(expensePercentage)}% da sua renda gasta, preste atenção.`;
    } else {
      return `${Math.round(expensePercentage)}% da sua renda gasta, tenha cuidado.`;
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container, { backgroundColor }]}>
      <Surface
        style={[
          styles.balanceSection,
          dynamicStyles.balanceSection,
          { backgroundColor: surfaceColor },
        ]}
      >
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet" size={16} color={onSurfaceVariantColor} />
              <Text
                variant="bodySmall"
                style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}
              >
                Saldo Total
              </Text>
            </View>
            <Text
              variant={isTablet ? 'displaySmall' : 'bodyLarge'}
              style={[styles.balanceAmount, { color: onSurfaceColor }]}
            >
              {formatCurrency(balance)}
            </Text>
          </View>

          <View style={[styles.separator, { backgroundColor: onSurfaceVariantColor }]} />

          <View style={styles.expenseItem}>
            <View style={styles.balanceHeader}>
              <Ionicons name="trending-down" size={16} color={secondaryColor} />
              <Text
                variant="bodySmall"
                style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}
              >
                Total de Despesas
              </Text>
            </View>
            <Text
              variant={isTablet ? 'headlineMedium' : 'bodyLarge'}
              style={[styles.expenseAmount, { color: secondaryColor }]}
            >
              -{formatCurrency(totalExpenses)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text variant="bodySmall" style={[styles.progressLabel, { color: onSurfaceColor }]}>
              {expensePercentage < 0.01
                ? '<0.01%'
                : `${Math.round(expensePercentage * 100) / 100}%`}
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.progressTarget, { color: onSurfaceVariantColor }]}
            >
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <ProgressBar
            progress={Math.max(progressValue, 0.02)}
            color={primaryColor}
            style={[styles.progressBar, { backgroundColor: onSurfaceVariantColor + '30' }]}
          />
        </View>
      </Surface>

      <View style={styles.statusSection}>
        <Ionicons name="checkmark-circle" size={16} color={primaryColor} />
        <Text variant="bodyMedium" style={[styles.statusMessage, { color: onSurfaceVariantColor }]}>
          {getStatusMessage()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Padding dinâmico dynamicStyles
    paddingTop: 70,
  },
  balanceSection: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceItem: {
    flex: 1,
  },
  expenseItem: {
    alignItems: 'flex-end',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    marginLeft: 6,
    opacity: 0.8,
  },
  balanceAmount: {
    fontWeight: 'bold',
  },
  expenseAmount: {
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    height: 60,
    marginHorizontal: 20,
    opacity: 0.3,
  },
  progressSection: {
    // Seção da barra de progresso
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
  cardsContainer: {
    // Flex dinâmico dynamicStyles
  },
  card: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardLabel: {
    fontSize: 16,
    opacity: 0.8,
  },
  cardAmount: {
    fontWeight: 'bold',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statusMessage: {
    marginLeft: 8,
    opacity: 0.8,
  },
});
