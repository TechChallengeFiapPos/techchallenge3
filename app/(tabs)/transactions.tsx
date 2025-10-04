// app/(tabs)/transactions.tsx

import { useThemeColor } from '@hooks/useThemeColor';
import { TransactionFilters } from '@src/components/filters/TransactionFilters';
import { TransactionItem } from '@src/components/list/TransactionItem';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedView } from '@src/components/ThemedView';
import { useTransactions } from '@src/context/TransactionsContext';
import { Transaction } from '@src/models/transactions';
import { formatCurrency, paymentMethods, transactionCategories } from '@src/utils/transactions';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width: screenWidth } = Dimensions.get('window');

export default function TransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  const {
    transactions,
    loading,
    error,
    hasMore,
    loadTransactions,
    loadMoreTransactions,
    refreshTransactions,
    clearError,
    deleteTransaction
  } = useTransactions();

  // Estados dos filtros
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [advancedFilters, setAdvancedFilters] = useState<{
    categoryId?: string;
    methodId?: string;
    startDate?: Date;
    endDate?: Date;
  }>({});

  // ⬇️ AQUI VAI O useEffect DOS FILTROS ⬇️
  // Aplicar filtros quando mudarem
  useEffect(() => {
    const filters: any = {};
    
    // Filtro de tipo (Todas/Receitas/Despesas)
    if (filterType !== 'all') {
      filters.type = filterType;
    }
    
    // Filtro de categoria
    if (advancedFilters.categoryId) {
      filters.categoryId = advancedFilters.categoryId;
    }
    
    // Filtro de método
    if (advancedFilters.methodId) {
      filters.methodId = advancedFilters.methodId;
    }
    
    // Filtro de período
    if (advancedFilters.startDate) {
      filters.startDate = advancedFilters.startDate;
    }
    
    if (advancedFilters.endDate) {
      filters.endDate = advancedFilters.endDate;
    }
    
    // Carrega transações com todos os filtros combinados
    loadTransactions(filters);
  }, [filterType, advancedFilters]); // Reexecuta quando qualquer filtro mudar
  // ⬆️ FIM DO useEffect DOS FILTROS ⬆️

  // Responsividade
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

  const handleEdit = (transaction: Transaction) => {
    router.push(`/(pages)/edit-transaction/${transaction.id}`);
  };

   const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Deletar Transação',
      `Tem certeza que deseja deletar esta transação de ${formatCurrency(transaction.value)}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTransaction(transaction.id);
            
            if (result.success) {
              Alert.alert('Sucesso', 'Transação deletada com sucesso!');
            } else {
              Alert.alert('Erro', result.error || 'Erro ao deletar transação');
            }
          },
        },
      ],
    );
  };

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem
        transaction={item}
        onEdit={handleEdit} // ← Deve passar aqui
        onDelete={handleDelete}
      />
    ),
    [handleEdit, handleDelete],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenMetrics.itemHeight,
      offset: screenMetrics.itemHeight * index,
      index,
    }),
    [screenMetrics.itemHeight],
  );

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

  const renderEmpty = useCallback(() => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={[styles.emptyTitle, { color: onSurfaceColor }]}>
          Nenhuma transação encontrada
        </Text>
        <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: onSurfaceVariantColor }]}>
          {filterType === 'all'
            ? 'Adicione sua primeira transação para começar'
            : 'Nenhuma transação encontrada com este filtro'}
        </Text>
      </View>
    );
  }, [loading, onSurfaceColor, onSurfaceVariantColor, filterType]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMoreTransactions();
    }
  }, [loading, hasMore, loadMoreTransactions]);

  const handleRefresh = useCallback(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.transactionsHeader,
            { paddingHorizontal: screenMetrics.horizontalPadding },
          ]}
        >
          <Text
            variant={screenMetrics.isTablet ? 'headlineMedium' : 'labelLarge'}
            style={[styles.transactionsTitle, { color: onSurfaceColor }]}
          >
            Adicionar Transação
          </Text>

          <FAB
            icon="plus"
            size="small"
            onPress={() => router.push('/register-transaction')}
            style={[styles.headerFab, { backgroundColor: primaryColor }]}
            color="white"
          />
        </View>

        {/* Componente de Filtros */}
        <TransactionFilters
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          onFilterChange={setAdvancedFilters}
          activeFilters={advancedFilters}
          resultsCount={transactions.length}
          horizontalPadding={screenMetrics.horizontalPadding}
          categories={transactionCategories}
          methods={paymentMethods}
        />
      </View>
    );
  }, [screenMetrics, onSurfaceColor, primaryColor, router, filterType, advancedFilters, transactions.length]);
 
  const dynamicStyles = useMemo(
    () => {
      const tabBarHeight = 90 + Math.max(insets.bottom, 0) + 20;
      return {
        listContent: {
          paddingBottom: tabBarHeight,
        },
      };
    },
    [insets],
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Transações" showBackButton={false} showLogout={true} />

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={renderHeader}
        removeClippedSubviews={true}
        maxToRenderPerBatch={screenMetrics.isTablet ? 15 : 10}
        windowSize={screenMetrics.isTablet ? 15 : 10}
        initialNumToRender={screenMetrics.isTablet ? 20 : 15}
        updateCellsBatchingPeriod={50}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={loading}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter} 
        contentContainerStyle={[
          dynamicStyles.listContent,
          transactions.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
      />

      <Snackbar
        visible={!!error}
        onDismiss={clearError}
        duration={4000}
        action={{ label: 'OK', onPress: clearError }}
        style={[styles.errorSnackbar, { bottom: Math.max(insets.bottom, 60) }]}
      >
        {error}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { marginBottom: 8 },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 24,
  },
  transactionsTitle: { fontWeight: 'bold', marginRight: 8,},
  headerFab: { marginLeft: 12, elevation: 4 },
  emptyList: { flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: { textAlign: 'center', marginBottom: 8, fontWeight: '600' },
  emptySubtitle: { textAlign: 'center', opacity: 0.7 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: { marginLeft: 8, opacity: 0.7 },
  errorSnackbar: { backgroundColor: '#F44336' },
});