import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionItem } from '@src/components/list/TransactionItem';
import { ThemedView } from '@src/components/ThemedView';
import { useTransactions } from '@src/context/TransactionsContext';
import { Transaction } from '@src/models/transactions';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export default function TransactionsScreen({ lightColor, darkColor }: ThemedProps) {
  const router = useRouter();
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  // Context do Firebase integrado
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
      headerPadding: isTablet ? 32 : 24,
      horizontalPadding: isTablet ? 24 : 16,
    };
  }, []);

  // Renderização otimizada do item
  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem
        transaction={item}
        onPress={(transaction) => {
          // Por enquanto só log - implemente navegação quando tiver a rota
          console.log('Transaction pressed:', transaction.id);
          // Futuro: router.push(`/transaction/${transaction.id}`);
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

  // Loading footer - só mostra se estiver carregando e tem mais dados
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
  }, [loading, hasMore, primaryColor, onSurfaceVariantColor]);

  // Empty state
  const renderEmpty = useCallback(() => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={[styles.emptyTitle, { color: onSurfaceColor }]}>
          Nenhuma transação encontrada
        </Text>
        <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: onSurfaceVariantColor }]}>
          Suas transações aparecerão aqui quando forem adicionadas
        </Text>
      </View>
    );
  }, [loading, onSurfaceColor, onSurfaceVariantColor]);

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

  // Header da seção
  const renderHeader = useCallback(() => {
    return (
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: screenMetrics.horizontalPadding,
            paddingTop: screenMetrics.headerPadding,
          },
        ]}
      >
        <Text
          variant={screenMetrics.isTablet ? 'headlineMedium' : 'headlineSmall'}
          style={[styles.headerTitle, { color: onSurfaceColor }]}
        >
          Transações
        </Text>
        <Text
          variant={screenMetrics.isTablet ? 'bodyLarge' : 'bodyMedium'}
          style={[styles.transactionCount, { color: onSurfaceVariantColor }]}
        >
          {transactions.length} {transactions.length === 1 ? 'transação' : 'transações'}
        </Text>
      </View>
    );
  }, [screenMetrics, onSurfaceColor, onSurfaceVariantColor, transactions.length]);

  // Estilos dinâmicos
  const dynamicStyles = useMemo(
    () => ({
      listContent: {
        paddingBottom: screenMetrics.isTablet ? 100 : 80, // Espaço para FAB
        paddingHorizontal: screenMetrics.horizontalPadding,
      },
    }),
    [screenMetrics],
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        // Header da lista
        ListHeaderComponent={renderHeader}
        // Otimizações de performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={screenMetrics.isTablet ? 15 : 10}
        windowSize={screenMetrics.isTablet ? 15 : 10}
        initialNumToRender={screenMetrics.isTablet ? 20 : 15}
        updateCellsBatchingPeriod={50}
        // Scroll infinito integrado com Context
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        // Pull to refresh integrado com Context
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

      {/* FAB para adicionar nova transação */}
      <FAB
        icon="plus"
        label="Nova transação"
        onPress={() => router.push('/register-transaction')}
        style={[styles.fab, { backgroundColor: primaryColor }]}
        color="white"
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
        style={styles.errorSnackbar}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  transactionCount: {
    opacity: 0.7,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});
