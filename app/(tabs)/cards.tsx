import { useThemeColor } from '@hooks/useThemeColor';
import { Card } from '@src/domain/entities/Card';
import { CardItem } from '@src/presentation/components/lists/cards/CardItem';
import { PageHeader } from '@src/presentation/components/navigation/PageHeader';
import { CardListSkeleton } from '@src/presentation/components/skeletons/CardListSkeleton';
import { ThemedView } from '@src/presentation/components/ThemedView';
import { useDeleteCard } from '@src/presentation/hooks/card/mutations/useCardsMutations';
import { useCards } from '@src/presentation/hooks/card/queries/useCardsQueries';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Chip, Divider, FAB, Text } from 'react-native-paper';

type FilterType = 'all' | 'credit' | 'debit';
type CategoryFilter = 'all' | 'platinum' | 'gold' | 'black';

export default function CardsScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');

  const {
    data: cards = [],
    isLoading,
    refetch
  } = useCards();

  const { mutate: deleteCard } = useDeleteCard();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (filterType !== 'all') {
        if (!card.functions.includes(filterType)) return false;
      }

      if (categoryFilter !== 'all') {
        if (card.category !== categoryFilter) return false;
      }

      return true;
    });
  }, [cards, filterType, categoryFilter]);

  const handleEdit = (card: Card) => {
    router.push(`/(pages)/edit-card/${card.id}`);
  };

  const handleDelete = (card: Card) => {
    Alert.alert(
      'Deletar Cartão',
      `Deseja deletar o cartão **** ${card.number.slice(-4)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            deleteCard(card.id!, {
              onSuccess: () => {
                Alert.alert('Sucesso', 'Cartão deletado!');
              },
              onError: (error: any) => {
                Alert.alert('Erro', error.message || 'Erro ao deletar');
              },
            });
          },
        },
      ],
    );
  };

  const renderCard = useCallback(
    ({ item }: { item: Card }) => (
      <CardItem
        card={item}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    ),
    [],
  );

  //skeleton depois do useCallback, rules of Hooks
  if (isLoading && cards.length === 0) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <PageHeader title="Cartões" showBackButton={true} />
        <View style={[styles.listCard, { backgroundColor: surfaceColor }]}>
          <CardListSkeleton count={3} />
        </View>
      </ThemedView>
    );
  }


  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={{ color: onSurfaceColor, textAlign: 'center' }}>
        Nenhum cartão encontrado
      </Text>
      <Text variant="bodyMedium" style={{ color: onSurfaceVariantColor, opacity: 0.7, marginTop: 8, textAlign: 'center' }}>
        {cards.length === 0
          ? 'Adicione seu primeiro cartão'
          : 'Nenhum cartão encontrado com este filtro'}
      </Text>
      {cards.length === 0 && (
        <View style={styles.emptyStateFAB}>
          {renderAddCart()}
        </View>
      )}
    </View>
  );

  const renderAddCart = () => (
    <View>
      <FAB
        icon="plus"
        size="small"
        onPress={() => router.push('/create-card')}
        style={[styles.fab, { backgroundColor: secondaryColor }]}
        color="white"
      />
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Cartões" showBackButton={true} />

      {cards?.length > 0 && (
        <View style={styles.addSection}>
          <Text variant="labelLarge" style={{ color: onSurfaceColor, fontWeight: 'bold' }}>
            Adicionar Cartão
          </Text>
          {renderAddCart()}
        </View>
      )}

      {cards?.length > 0 && (
        <View style={[styles.filterCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.filterRow}>
            <Chip
              selected={filterType === 'all'}
              onPress={() => setFilterType('all')}
              style={[
                styles.chip,
                filterType === 'all' && { backgroundColor: primaryColor }
              ]}
              textStyle={filterType === 'all' && { color: 'white' }}
              compact
            >
              Todos
            </Chip>
            <Chip
              selected={filterType === 'credit'}
              onPress={() => setFilterType('credit')}
              style={[
                styles.chip,
                filterType === 'credit' && { backgroundColor: primaryColor }
              ]}
              textStyle={filterType === 'credit' && { color: 'white' }}
              compact
            >
              Crédito
            </Chip>
            <Chip
              selected={filterType === 'debit'}
              onPress={() => setFilterType('debit')}
              style={[
                styles.chip,
                filterType === 'debit' && { backgroundColor: primaryColor }
              ]}
              textStyle={filterType === 'debit' && { color: 'white' }}
              compact
            >
              Débito
            </Chip>
          </View>

          <View style={styles.filterRow}>
            <Chip
              selected={categoryFilter === 'all'}
              onPress={() => setCategoryFilter('all')}
              style={[
                styles.chip,
                categoryFilter === 'all' && { backgroundColor: primaryColor }
              ]}
              textStyle={categoryFilter === 'all' && { color: 'white' }}
              compact
            >
              Todas
            </Chip>
            <Chip
              selected={categoryFilter === 'platinum'}
              onPress={() => setCategoryFilter('platinum')}
              style={[
                styles.chip,
                categoryFilter === 'platinum' && { backgroundColor: primaryColor }
              ]}
              textStyle={categoryFilter === 'platinum' && { color: 'white' }}
              compact
            >
              Platinum
            </Chip>
            <Chip
              selected={categoryFilter === 'gold'}
              onPress={() => setCategoryFilter('gold')}
              style={[
                styles.chip,
                categoryFilter === 'gold' && { backgroundColor: primaryColor }
              ]}
              textStyle={categoryFilter === 'gold' && { color: 'white' }}
              compact
            >
              Gold
            </Chip>
            <Chip
              selected={categoryFilter === 'black'}
              onPress={() => setCategoryFilter('black')}
              style={[
                styles.chip,
                categoryFilter === 'black' && { backgroundColor: primaryColor }
              ]}
              textStyle={categoryFilter === 'black' && { color: 'white' }}
              compact
            >
              Black
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <Text variant="bodySmall" style={styles.resultCount}>
            {filteredCards.length} {filteredCards.length === 1 ? 'cartão carregado' : 'cartões carregados'}
          </Text>
        </View>
      )}

      <View style={[styles.listCard, { backgroundColor: surfaceColor }]}>
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={item => item.id!}
          ListEmptyComponent={renderEmpty}
          refreshing={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  fab: { elevation: 4 },
  filterCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 4,
    borderRadius: 40,
  },
  divider: {
    marginVertical: 12,
  },
  resultCount: {
    opacity: 0.7,
    fontWeight: '500',
  },
  listCard: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginVertical: 0,
    paddingTop: 20,
    marginTop: 20,
  },
  listContent: { paddingBottom: 100 },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    marginTop: 160,
  },
  emptyStateFAB: {
    marginTop: 30,
  }
});