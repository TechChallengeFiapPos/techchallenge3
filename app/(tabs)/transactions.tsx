import { useThemeColor } from '@hooks/useThemeColor';
import { useAuth } from '@src/contexts/AuthContext';
import { Transaction } from '@src/domain/entities/Transaction';
import { TransactionFilters as TransactionFiltersComponent } from '@src/presentation/components/filters/transactions/TransactionFilters';
import { TransactionItem } from '@src/presentation/components/lists/transactions/TransactionItem';
import { PageHeader } from '@src/presentation/components/navigation/PageHeader';
import { ThemedView } from '@src/presentation/components/ThemedView';
import {
  useAllTransactions,
  useDeleteTransaction,
  useInfiniteTransactions,
} from '@src/presentation/hooks/transaction';
import { metrics } from '@src/utils/metrics';
import { formatCurrency, paymentMethods, transactionCategories } from '@src/utils/transactions';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  const { user } = useAuth();
  const [loadStart] = useState(Date.now());
  const { mutate: deleteTransaction } = useDeleteTransaction();
  
  // verifica se existem transações (mostra/oculta filtros)
  const { data: allTransactions = [] } = useAllTransactions();

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [advancedFilters, setAdvancedFilters] = useState<{
    categoryId?: string;
    methodId?: string;
    startDate?: Date;
    endDate?: Date;
  }>({});

  // filtros para React Query
  const filters = useMemo(() => {
    const f: any = {};
    
    if (filterType !== 'all') {
      f.type = filterType;
    }
    
    if (advancedFilters.categoryId) {
      f.categoryId = advancedFilters.categoryId;
    }
    
    if (advancedFilters.methodId) {
      f.methodId = advancedFilters.methodId;
    }
    
    if (advancedFilters.startDate) {
      f.startDate = advancedFilters.startDate;
    }
    
    if (advancedFilters.endDate) {
      f.endDate = advancedFilters.endDate;
    }
    
    return Object.keys(f).length > 0 ? f : undefined;
  }, [filterType, advancedFilters]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteTransactions(filters);

  // flatten páginas em array único
  const transactions = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.transactions);
  }, [data]);

  // Métricas
  useEffect(() => {
    if (!user) return;
    metrics.logNavigation('Previous', 'Transactions');

    return () => {
      const loadTime = Date.now() - loadStart;
      metrics.logLoadTime('Transactions', loadTime);
    };
  }, [user, loadStart]);

  const handleEdit = (transaction: Transaction) => {
    router.push(`/(pages)/edit-transaction/${transaction.id}`);
  };

  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Deletar Transação',
      `Tem certeza que deseja deletar esta transação de ${formatCurrency(transaction.value)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(transaction.id, {
              onSuccess: () => {
                console.info('Transação deletada com sucesso');
              },
              onError: (error: any) => {
                Alert.alert('Erro', error.message || 'Erro ao deletar transação');
              },
            });
          },
        },
      ],
    );
  };

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem transaction={item} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  //  mostra "Carregando mais..." quando busca próxima página
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator animating size="small" color={primaryColor} />
        <Text variant="bodySmall" style={[styles.footerText, { color: onSurfaceVariantColor }]}>
          Carregando mais transações...
        </Text>
      </View>
    );
  }, [isFetchingNextPage, primaryColor, onSurfaceVariantColor]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    
    const hasAnyTransactions = allTransactions.length > 0;
    
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={[styles.emptyTitle, { color: onSurfaceColor }]}>
          Nenhuma transação encontrada
        </Text>
        <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: onSurfaceVariantColor }]}>
          {hasAnyTransactions
            ? 'Nenhuma transação encontrada com este filtro'
            : 'Adicione uma transação para começar'}
        </Text>
        
        {!hasAnyTransactions && (
          <View style={styles.emptyStateFAB}>{renderAddTransactionButton()}</View>
        )}
      </View>
    );
  }, [isLoading, allTransactions.length, onSurfaceColor, onSurfaceVariantColor]);

  // carregando mais ao chegar no fim da lista
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const dynamicStyles = useMemo(() => {
    const tabBarHeight = 90 + Math.max(insets.bottom, 0) + 20;
    return { listContent: { paddingBottom: tabBarHeight } };
  }, [insets]);

  const renderAddTransactionButton = () => (
    <View>
      <FAB
        icon="plus"
        size="small"
        onPress={() => router.push('/create-transaction')}
        style={[styles.headerFab, { backgroundColor: secondaryColor }]}
        color="white"
      />
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Transações" showBackButton />
      
      {allTransactions.length > 0 && (
        <View style={styles.headerSection}>
          <View style={[styles.transactionsHeader, { paddingHorizontal: 16 }]}>
            <Text variant="labelLarge" style={[styles.transactionsTitle, { color: onSurfaceColor }]}>
              Adicionar Transação
            </Text>
            {renderAddTransactionButton()}
          </View>

          <TransactionFiltersComponent
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onFilterChange={setAdvancedFilters}
            activeFilters={advancedFilters}
            resultsCount={transactions.length}
            horizontalPadding={16}
            categories={transactionCategories}
            methods={paymentMethods}
          />
        </View>
      )}

      <View style={[styles.card, { backgroundColor: surfaceColor }]}>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={keyExtractor}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={15}
          updateCellsBatchingPeriod={50}   
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={[
            dynamicStyles.listContent,
            transactions.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={() => {}}
        duration={4000}
        action={{ label: 'OK', onPress: () => {} }}
        style={[styles.errorSnackbar, { bottom: Math.max(insets.bottom, 60) }]}
      >
        {error?.message || 'Erro ao carregar transações'}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { marginBottom: 0 },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 8,
  },
  transactionsTitle: { fontWeight: 'bold', marginRight: 8 },
  headerFab: { marginLeft: 12, elevation: 4 },
  card: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginVertical: 0,
    paddingTop: 16,
    marginTop: 20,
  },
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
  emptyStateFAB: {
    marginTop: 30,
  },
});