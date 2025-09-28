// src/components/dashboard/FinancialDashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { useTransactions } from '@src/context/TransactionsContext';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ProgressBar, Surface, Text } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

export const FinancialDashboard: React.FC = () => {
  const { totalIncome, totalExpenses, balance } = useTransactions();

  // Cores do tema
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  // Responsividade
  const isTablet = screenWidth > 768;
  const isLandscape = screenWidth > 600;

  // Formatação de moeda
  const formatCurrency = (centavos: number): string => {
    const reais = centavos / 100;
    return reais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Calcular percentual de gastos
  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const progressValue = Math.min(expensePercentage / 100, 1); // Max 100%

  // Calcular meta fictícia para a barra de progresso (baseada na imagem)
  const targetAmount = 2000000; // R$ 20.000,00 em centavos (valor da imagem)
  const targetProgressValue = Math.min(totalExpenses / targetAmount, 1);

  // Mensagem de status
  const getStatusMessage = (): string => {
    if (expensePercentage <= 30) {
      return `${Math.round(expensePercentage)}% Of Your Expenses, Looks Good.`;
    } else if (expensePercentage <= 70) {
      return `${Math.round(expensePercentage)}% Of Your Expenses, Pay Attention.`;
    } else {
      return `${Math.round(expensePercentage)}% Of Your Expenses, Be Careful.`;
    }
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

  return (
    <View style={[styles.container, dynamicStyles.container, { backgroundColor }]}>
      {/* Seção de Saldo Total e Despesas */}
      <Surface
        style={[
          styles.balanceSection,
          dynamicStyles.balanceSection,
          { backgroundColor: surfaceColor },
        ]}
      >
        <View style={styles.balanceRow}>
          {/* Total Balance */}
          <View style={styles.balanceItem}>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet" size={16} color={onSurfaceVariantColor} />
              <Text
                variant="bodySmall"
                style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}
              >
                Total Balance
              </Text>
            </View>
            <Text
              variant={isTablet ? 'displaySmall' : 'headlineLarge'}
              style={[styles.balanceAmount, { color: onSurfaceColor }]}
            >
              {formatCurrency(balance)}
            </Text>
          </View>

          {/* Separador */}
          <View style={[styles.separator, { backgroundColor: onSurfaceVariantColor }]} />

          {/* Total Expense */}
          <View style={styles.expenseItem}>
            <View style={styles.balanceHeader}>
              <Ionicons name="trending-down" size={16} color={secondaryColor} />
              <Text
                variant="bodySmall"
                style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}
              >
                Total Expense
              </Text>
            </View>
            <Text
              variant={isTablet ? 'headlineMedium' : 'headlineSmall'}
              style={[styles.expenseAmount, { color: secondaryColor }]}
            >
              -{formatCurrency(totalExpenses)}
            </Text>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text variant="bodySmall" style={[styles.progressLabel, { color: onSurfaceColor }]}>
              {Math.round(expensePercentage)}%
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.progressTarget, { color: onSurfaceVariantColor }]}
            >
              {formatCurrency(targetAmount)}
            </Text>
          </View>
          <ProgressBar
            progress={targetProgressValue}
            color={primaryColor}
            style={[styles.progressBar, { backgroundColor: onSurfaceVariantColor + '30' }]}
          />
        </View>
      </Surface>

      {/* Cards de Income e Expense */}
      <View style={[styles.cardsContainer, dynamicStyles.cardsContainer]}>
        {/* Income Card */}
        <Surface style={[styles.card, dynamicStyles.card, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: primaryColor + '20' }]}>
              <Ionicons name="trending-up" size={24} color={primaryColor} />
            </View>
            <Text variant="bodyMedium" style={[styles.cardLabel, { color: onSurfaceVariantColor }]}>
              Income
            </Text>
          </View>
          <Text
            variant={isTablet ? 'headlineMedium' : 'headlineSmall'}
            style={[styles.cardAmount, { color: onSurfaceColor }]}
          >
            {formatCurrency(totalIncome)}
          </Text>
        </Surface>

        {/* Expense Card */}
        <Surface style={[styles.card, dynamicStyles.card, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: secondaryColor + '20' }]}>
              <Ionicons name="trending-down" size={24} color={secondaryColor} />
            </View>
            <Text variant="bodyMedium" style={[styles.cardLabel, { color: onSurfaceVariantColor }]}>
              Expense
            </Text>
          </View>
          <Text
            variant={isTablet ? 'headlineMedium' : 'headlineSmall'}
            style={[styles.cardAmount, { color: secondaryColor }]}
          >
            {formatCurrency(totalExpenses)}
          </Text>
        </Surface>
      </View>

      {/* Mensagem de Status */}
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
    // Padding dinâmico aplicado via dynamicStyles
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
    // Flex dinâmico aplicado via dynamicStyles
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
