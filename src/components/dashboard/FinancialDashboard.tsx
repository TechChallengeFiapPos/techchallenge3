import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { useTransactions } from '@src/context/TransactionsContext';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ProgressBar, Surface, Text } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

export function FinancialDashboard() {
  const { totalIncome, totalExpenses, balance } = useTransactions();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const secondary = useThemeColor({}, 'secondary');
  const error = useThemeColor({}, 'error');

  // Responsividade
  const isTablet = screenWidth > 768;
  const isLandscape = screenWidth > 600;

  // Estilos dinâmicos
  const dynamicStyles = {
    container: {
      padding: isTablet ? 24 : 16,
    },
    cardsContainer: {
      flexDirection: isLandscape ? ('row' as const) : ('column' as const),
      gap: isTablet ? 16 : 12,
    },
    card: {
      flex: isLandscape ? 1 : undefined,
      padding: isTablet ? 20 : 16,
    },
    iconSize: isTablet ? 28 : 24,
  };

  // Formatar valores em centavos para reais
  const formatCurrency = (valueInCents: number): string => {
    const reais = valueInCents / 100;
    return reais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Calcular percentual de gastos em relação à renda
  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const progressValue = Math.min(expensePercentage / 100, 1); // Max 100%

  // Mensagem de status baseada no percentual
  const getStatusMessage = (): string => {
    if (expensePercentage <= 30) {
      return `${expensePercentage < 0.01 ? '<0,01' : expensePercentage.toFixed(2).replace('.', ',')}% da sua renda gasta. Muito bem!`;
    } else if (expensePercentage <= 70) {
      return `${expensePercentage.toFixed(2).replace('.', ',')}% da sua renda gasta. Fique atento.`;
    } else {
      return `${expensePercentage.toFixed(2).replace('.', ',')}% da sua renda gasta. Cuidado!`;
    }
  };

  return (
    <View>
      {/* Card Principal com Balance, Expense e Barra de Progresso */}
      <Surface style={[styles.mainCard, dynamicStyles.container, { backgroundColor }]}>
        {/* Total Balance */}
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
          <Text variant="displaySmall" style={[styles.balanceValue, { color: onSurfaceColor }]}>
            {formatCurrency(balance)}
          </Text>
        </View>

        {/* Separador */}
        <View style={[styles.separator, { backgroundColor: onSurfaceVariantColor + '30' }]} />

        {/* Total Expense */}
        <View style={styles.balanceItem}>
          <View style={styles.balanceHeader}>
            <Ionicons name="trending-down" size={16} color={onSurfaceVariantColor} />
            <Text
              variant="bodySmall"
              style={[styles.balanceLabel, { color: onSurfaceVariantColor }]}
            >
              Total de Despesas
            </Text>
          </View>
          <Text variant="headlineMedium" style={[styles.expenseValue, { color: onSurfaceColor }]}>
            {formatCurrency(totalExpenses)}
          </Text>
        </View>
      </Surface>

      {/* Cards de Receitas e Despesas */}
      <View style={[styles.cardsContainer, dynamicStyles.cardsContainer, dynamicStyles.container]}>
        {/* Card de Receitas */}
        <Surface style={[styles.card, dynamicStyles.card, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: primaryColor }]}>
              <Ionicons name="arrow-down" size={dynamicStyles.iconSize} color="white" />
            </View>
            <View style={styles.cardInfo}>
              <Text variant="bodySmall" style={[styles.cardLabel, { color: onSurfaceVariantColor }]}>
                Receitas
              </Text>
              <Text
                variant={isTablet ? 'headlineSmall' : 'titleLarge'}
                style={[styles.cardValue, { color: onSurfaceColor }]}
              >
                {formatCurrency(totalIncome)}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Card de Despesas */}
        <Surface style={[styles.card, dynamicStyles.card, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: error }]}>
              <Ionicons name="arrow-up" size={dynamicStyles.iconSize} color="white" />
            </View>
            <View style={styles.cardInfo}>
              <Text variant="bodySmall" style={[styles.cardLabel, { color: onSurfaceVariantColor }]}>
                Despesas
              </Text>
              <Text
                variant={isTablet ? 'headlineSmall' : 'titleLarge'}
                style={[styles.cardValue, { color: onSurfaceColor }]}
              >
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Card de Progresso */}
          {/* Barra de Progresso */}
          <View>
            <View style={styles.progressLabels}>
              <Text variant="bodySmall" style={[styles.progressLabel, { color: onSurfaceColor }]}>
                {expensePercentage < 0.01
                  ? '<0,01%'
                  : `${expensePercentage.toFixed(2).replace('.', ',')}%`}
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

          {/* Mensagem de Status */}
          <View style={styles.statusSection}>
            <Ionicons name="checkmark-circle" size={16} color={secondary} />
            <Text variant="bodySmall" style={[styles.statusText, { color: onSurfaceVariantColor }]}>
              {getStatusMessage()}
            </Text>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    borderRadius: 20,
    elevation: 2,
    margin: 16,
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
  progressSection: {
    marginTop: 0,
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
    marginTop: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 12,
    opacity: 0.8,
  },
  cardsContainer: {
    marginTop: 0,
  },
  card: {
    borderRadius: 16,
    elevation: 1,
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