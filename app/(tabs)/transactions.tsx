import { useThemeColor } from '@hooks/useThemeColor';
import { FinancialDashboard } from '@src/components/dashboard/FinancialDashboard';
import { TransactionItem } from '@src/components/list/TransactionItem';
import { ThemedView } from '@src/components/ThemedView';
import { useTransactions } from '@src/context/TransactionsContext';
import { Transaction } from '@src/models/transactions';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export default function TransactionsScreen({ lightColor, darkColor }: ThemedProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  const {
    transactions,
    loading,
    error,
    hasMore,
    loadMoreTransactions,
    refreshTransactions,
    clearError,
  } = useTransactions();

  // Responsividade baseada na largura da tela
  const screenMetrics = useMemo(() => {
    const isTablet = screenWidth > 768;
    const isLandscape = screenWidth > 600;

    return {
      isTablet,
      isLandscape,
      itemHeight: isTablet ? 80 : isLandscape ? 70 : 64,
      horizontalPadding: isTablet ? 24 : 16,
    };
  }, []);

  // Renderização otimizada do item
  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem
        transaction={item}
        onPress={(transaction) => {
          console.log('Transaction pressed:', transaction.id);
        }}
      />
    ),
    [],
  );

  // KeyExtractor estável
  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  // Layout otimizado para performance - altura dinâmica
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenMetrics.itemHeight,
      offset: screenMetrics.itemHeight * index,
      index,
    }),
    [screenMetrics.itemHeight],
  );

  // Loading footer
  const renderFooter = useCallback(() => {
    if (!loading || !hasMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator animating size="small" color={primaryColor} />
        <Text variant="bodySmall" style={[styles.footerText, { color: onSurfaceVariantColor }]}>
          Carregando mais transações...
        </Text>
      </View>
    );
  }, [loading, hasMore]);

  // Empty state
  const renderEmpty = useCallback(() => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={[styles.emptyTitle, { color: onSurfaceColor }]}>
          Nenhuma transação encontrada
        </Text>
        <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: onSurfaceVariantColor }]}>
          Adicione sua primeira transação para começar
        </Text>
      </View>
    );
  }, [loading]);

  // Handle scroll infinito
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMoreTransactions();
    }
  }, [loading, hasMore, loadMoreTransactions]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  // Header da lista com dashboard, título E FAB
  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        {/* Dashboard Financeiro */}
        <FinancialDashboard />

        {/* Título da seção de transações com FAB */}
        <View
          style={[
            styles.transactionsHeader,
            { paddingHorizontal: screenMetrics.horizontalPadding },
          ]}
        >
          <Text
            variant={screenMetrics.isTablet ? 'headlineMedium' : 'headlineSmall'}
            style={[styles.transactionsTitle, { color: onSurfaceColor }]}
          >
            Suas Transações
          </Text>

          {/* FAB integrado no header */}
          <FAB
            icon="plus"
            size="small"
            onPress={() => router.push('/register-transaction')}
            style={[styles.headerFab, { backgroundColor: primaryColor }]}
            color="white"
          />
        </View>
      </View>
    );
  }, [screenMetrics, onSurfaceColor, primaryColor, router]);

  // Estilos dinâmicos com safe area insets e espaço para tab bar
  const dynamicStyles = useMemo(
    () => ({
      listContent: {
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, 80) + 20, // Garante espaço mínimo para tab bar
      },
    }),
    [insets],
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        // Header com dashboard E FAB
        ListHeaderComponent={renderHeader}
        // Otimizações de performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={screenMetrics.isTablet ? 15 : 10}
        windowSize={screenMetrics.isTablet ? 15 : 10}
        initialNumToRender={screenMetrics.isTablet ? 20 : 15}
        updateCellsBatchingPeriod={50}
        // Scroll infinito
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        // Pull to refresh
        onRefresh={handleRefresh}
        refreshing={loading}
        // Estados
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        // Estilo
        contentContainerStyle={[
          dynamicStyles.listContent,
          transactions.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Snackbar para erros */}
      <Snackbar
        visible={!!error}
        onDismiss={clearError}
        duration={4000}
        action={{
          label: 'OK',
          onPress: clearError,
        }}
        style={[styles.errorSnackbar, { bottom: Math.max(insets.bottom, 60) }]}
      >
        {error}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    // Container do header com dashboard
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 24,
  },
  transactionsTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  headerFab: {
    marginLeft: 12,
    elevation: 4,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    marginLeft: 8,
    opacity: 0.7,
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});
