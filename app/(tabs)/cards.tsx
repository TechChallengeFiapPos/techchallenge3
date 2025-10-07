import { useThemeColor } from '@hooks/useThemeColor';
import { useFocusEffect } from '@react-navigation/native';
import { CardData } from '@src/api/firebase/Card';
import { CardItem } from '@src/components/lists/cards/CardItem';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedView } from '@src/components/ThemedView';
import { useCardActions } from '@src/hooks/useCardActions';
import { useCards } from '@src/hooks/useCards';
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

  const { cards, loading, refetch } = useCards();
  const { deleteCard } = useCardActions();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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

  const handleEdit = (card: CardData) => {
    router.push(`/(pages)/edit-card/${card.id}`);
  };

  const handleDelete = (card: CardData) => {
    Alert.alert(
      'Deletar Cartão',
      `Deseja deletar o cartão **** ${card.number.slice(-4)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteCard(card.id!);
            if (result.success) {
              Alert.alert('Sucesso', 'Cartão deletado!');
              refetch();
            } else {
              Alert.alert('Erro', result.error || 'Erro ao deletar');
            }
          },
        },
      ],
    );
  };

  const renderCard = useCallback(
    ({ item }: { item: CardData }) => (
      <CardItem
        card={item}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    ),
    [],
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={{ color: onSurfaceColor, textAlign: 'center' }}>
        Nenhum cartão encontrado
      </Text>
      <Text variant="bodyMedium" style={{ color: onSurfaceColor, opacity: 0.7, marginTop: 8, textAlign: 'center' }}>
        Adicione seu primeiro cartão
      </Text>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Cartões" showBackButton={true} />

      <View style={styles.addSection}>
        <Text variant="labelLarge" style={{ color: onSurfaceColor, fontWeight: 'bold' }}>
          Adicionar Cartão
        </Text>
        <FAB
          icon="plus"
          size="small"
          onPress={() => router.push('/create-card')}
          style={[styles.fab, { backgroundColor: secondaryColor }]}
          color="white"
        />
      </View>

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

      <View style={[styles.listCard, { backgroundColor: surfaceColor }]}>
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={item => item.id!}
          ListEmptyComponent={renderEmpty}
          refreshing={loading}
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
    paddingTop: 16,
  },
  listContent: { paddingBottom: 100 },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});