import { useThemeColor } from '@hooks/useThemeColor';
import { useFocusEffect } from '@react-navigation/native';
import { CardData } from '@src/api/firebase/Card';
import { CardItem } from '@src/components/lists/cards/CardItem';
import { PageHeader } from '@src/components/navigation/PageHeader';
import { ThemedView } from '@src/components/ThemedView';
import { useCardActions } from '@src/hooks/useCardActions';
import { useCards } from '@src/hooks/useCards';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Chip, FAB, Text } from 'react-native-paper';

type FilterType = 'all' | 'credit' | 'debit';
type CategoryFilter = 'all' | 'platinum' | 'gold' | 'black';

export default function CardsScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
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

  // Filtrar cartões
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Filtro de tipo (crédito/débito)
      if (filterType !== 'all') {
        if (!card.functions.includes(filterType)) return false;
      }

      // Filtro de categoria
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <Text variant="labelLarge" style={{ color: onSurfaceColor, fontWeight: 'bold', flex: 1 }}>
          Adicionar Cartão
        </Text>
        <FAB
          icon="plus"
          size="small"
          onPress={() => router.push('/register-card')}
          style={[styles.fab, { backgroundColor: primaryColor }]}
          color="white"
        />
      </View>

      {/* Filtros de Tipo */}
      <View style={styles.filterRow}>
        <Chip
          selected={filterType === 'all'}
          onPress={() => setFilterType('all')}
          style={styles.chip}
        >
          Todos
        </Chip>
        <Chip
          selected={filterType === 'credit'}
          onPress={() => setFilterType('credit')}
          style={styles.chip}
        >
          Crédito
        </Chip>
        <Chip
          selected={filterType === 'debit'}
          onPress={() => setFilterType('debit')}
          style={styles.chip}
        >
          Débito
        </Chip>
      </View>

      {/* Filtros de Categoria */}
      <View style={styles.filterRow}>
        <Chip
          selected={categoryFilter === 'all'}
          onPress={() => setCategoryFilter('all')}
          style={styles.chip}
        >
          Todas
        </Chip>
        <Chip
          selected={categoryFilter === 'platinum'}
          onPress={() => setCategoryFilter('platinum')}
          style={styles.chip}
        >
          Platinum
        </Chip>
        <Chip
          selected={categoryFilter === 'gold'}
          onPress={() => setCategoryFilter('gold')}
          style={styles.chip}
        >
          Gold
        </Chip>
        <Chip
          selected={categoryFilter === 'black'}
          onPress={() => setCategoryFilter('black')}
          style={styles.chip}
        >
          Black
        </Chip>
      </View>

      <Text variant="bodySmall" style={styles.resultCount}>
        {filteredCards.length} {filteredCards.length === 1 ? 'cartão' : 'cartões'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={{ color: onSurfaceColor }}>
        Nenhum cartão encontrado
      </Text>
      <Text variant="bodyMedium" style={{ color: onSurfaceColor, opacity: 0.7, marginTop: 8 }}>
        Adicione seu primeiro cartão
      </Text>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <PageHeader title="Cartões" showBackButton={false} showLogout={true} />

      <FlatList
        data={filteredCards}
        renderItem={renderCard}
        keyExtractor={item => item.id!}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshing={loading}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { padding: 16, paddingTop: 24 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fab: { elevation: 4 },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: { marginRight: 4 },
  resultCount: { marginTop: 8, opacity: 0.7 },
  listContent: { paddingBottom: 100 },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});