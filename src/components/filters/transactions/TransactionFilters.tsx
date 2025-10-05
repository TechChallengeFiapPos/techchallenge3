// src/components/filters/TransactionFilters.tsx

import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, Menu, Text, Portal, Modal, Divider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

interface TransactionFiltersProps {
  filterType: 'all' | 'income' | 'expense';
  onFilterTypeChange: (type: 'all' | 'income' | 'expense') => void;
  // Filtros avançados
  onFilterChange: (filters: {
    categoryId?: string;
    methodId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => void;
  activeFilters: {
    categoryId?: string;
    methodId?: string;
    startDate?: Date;
    endDate?: Date;
  };
  resultsCount: number;
  horizontalPadding?: number;
  // Dados dos selects vindos dos utils
  categories: { label: string; value: string }[];
  methods: { label: string; value: string }[];
}

export function TransactionFilters({
  filterType,
  onFilterTypeChange,
  onFilterChange,
  activeFilters,
  resultsCount,
  horizontalPadding = 16,
  categories,
  methods,
}: TransactionFiltersProps) {
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
  
  // Estados dos menus
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [methodMenuVisible, setMethodMenuVisible] = useState(false);
  
  // Estados do DatePicker
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({
    startDate: activeFilters.startDate,
    endDate: activeFilters.endDate,
  });

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const onSurfaceVariantColor = useThemeColor({}, 'onSurfaceVariant');
  const backgroundColor = useThemeColor({}, 'background');

  const clearFilters = () => {
    onFilterTypeChange('all');
    onFilterChange({});
    setDateRange({});
  };

  const hasActiveFilters = 
    filterType !== 'all' || 
    activeFilters.categoryId || 
    activeFilters.methodId || 
    activeFilters.startDate || 
    activeFilters.endDate;

  const handleCategorySelect = (categoryId: string) => {
    onFilterChange({ 
      ...activeFilters, 
      categoryId: !categoryId || categoryId === '' ? undefined : categoryId 
    });
  };

  const handleMethodSelect = (methodId: string) => {
    onFilterChange({ 
      ...activeFilters, 
      methodId: !methodId || methodId === '' ? undefined : methodId 
    });
  };

  const handleDateRangeConfirm = ({ startDate, endDate }: any) => {
    setDateRange({ startDate, endDate });
    onFilterChange({ ...activeFilters, startDate, endDate });
    setDatePickerVisible(false);
  };

  const getSelectedCategoryLabel = () => {
    if (!activeFilters.categoryId) return 'Todas as categorias';
    return categories.find(c => c.value === activeFilters.categoryId)?.label || 'Categoria';
  };

  const getSelectedMethodLabel = () => {
    if (!activeFilters.methodId) return 'Todos os métodos';
    return methods.find(m => m.value === activeFilters.methodId)?.label || 'Método';
  };

  const getDateRangeLabel = () => {
    if (!dateRange.startDate && !dateRange.endDate) return 'Selecionar período';
    if (dateRange.startDate && dateRange.endDate) {
      return `${dateRange.startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${dateRange.endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
    }
    return 'Período incompleto';
  };

  return (
    <View
      style={[
        styles.filtersContainer,
        {
          paddingHorizontal: horizontalPadding,
          backgroundColor: surfaceColor,
        },
      ]}
    >
      {/* Filtros básicos (Chips de tipo) */}
      <View style={styles.filtersRow}>
        <Chip
          selected={filterType === 'all'}
          onPress={() => onFilterTypeChange('all')}
          style={[styles.filterChip, filterType === 'all' && { backgroundColor: primaryColor }]}
          textStyle={[styles.chipText, filterType === 'all' && { color: 'white' }]}
        >
          Todas
        </Chip>

        <Chip
          selected={filterType === 'income'}
          onPress={() => onFilterTypeChange('income')}
          style={[
            styles.filterChip,
            filterType === 'income' && { backgroundColor: '#4CAF50' },
          ]}
          textStyle={[styles.chipText, filterType === 'income' && { color: 'white' }]}
          icon={() => (
            <Ionicons
              name="arrow-down"
              size={16}
              color={filterType === 'income' ? 'white' : onSurfaceColor}
            />
          )}
        >
          Receitas
        </Chip>

        <Chip
          selected={filterType === 'expense'}
          onPress={() => onFilterTypeChange('expense')}
          style={[
            styles.filterChip,
            filterType === 'expense' && { backgroundColor: '#F44336' },
          ]}
          textStyle={[styles.chipText, filterType === 'expense' && { color: 'white' }]}
          icon={() => (
            <Ionicons
              name="arrow-up"
              size={16}
              color={filterType === 'expense' ? 'white' : onSurfaceColor}
            />
          )}
        >
          Despesas
        </Chip>
      </View>

      {/* Botões de ação */}
      <View style={styles.moreFiltersRow}>
        <Button
          mode="text"
          icon="filter-variant"
          onPress={() => setAdvancedFiltersVisible(true)}
          textColor={onSurfaceColor}
        >
          Mais Filtros
        </Button>

        {hasActiveFilters && (
          <Button mode="text" icon="close" onPress={clearFilters} textColor={primaryColor}>
            Limpar
          </Button>
        )}
      </View>

      {/* Badges dos filtros ativos */}
      {hasActiveFilters && (
        <View style={styles.activeBadgesRow}>
          {activeFilters.categoryId && (
            <Chip
              style={styles.activeBadge}
              textStyle={styles.activeBadgeText}
              onClose={() => handleCategorySelect('')}
            >
              {getSelectedCategoryLabel()}
            </Chip>
          )}
          {activeFilters.methodId && (
            <Chip
              style={styles.activeBadge}
              textStyle={styles.activeBadgeText}
              onClose={() => handleMethodSelect('')}
            >
              {getSelectedMethodLabel()}
            </Chip>
          )}
          {(dateRange.startDate || dateRange.endDate) && (
            <Chip
              style={styles.activeBadge}
              textStyle={styles.activeBadgeText}
              onClose={() => {
                setDateRange({});
                onFilterChange({ ...activeFilters, startDate: undefined, endDate: undefined });
              }}
            >
              {getDateRangeLabel()}
            </Chip>
          )}
        </View>
      )}

      {/* Contador */}
      <View style={styles.resultsCounter}>
        <Text variant="bodySmall" style={{ color: onSurfaceVariantColor }}>
          {resultsCount} {resultsCount === 1 ? 'transação' : 'transações'} carregadas
        </Text>
      </View>

      {/* Modal de Filtros Avançados */}
      <Portal>
        <Modal
          visible={advancedFiltersVisible}
          onDismiss={() => setAdvancedFiltersVisible(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor }]}
        >
          <Text variant="headlineSmall" style={[styles.modalTitle, { color: onSurfaceColor }]}>
            Filtros Avançados
          </Text>

          <Divider style={styles.divider} />

          {/* Filtro de Categoria */}
          <View style={styles.filterSection}>
            <Text variant="titleSmall" style={[styles.filterLabel, { color: onSurfaceColor }]}>
              Categoria
            </Text>
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCategoryMenuVisible(true)}
                  style={styles.selectButton}
                  contentStyle={styles.selectButtonContent}
                  icon="chevron-down"
                >
                  {getSelectedCategoryLabel()}
                </Button>
              }
            >
              <Menu.Item onPress={() => handleCategorySelect('')} title="Todas as categorias" />
              {categories.map((cat) => (
                <Menu.Item
                  key={cat.value}
                  onPress={() => handleCategorySelect(cat.value)}
                  title={cat.label}
                />
              ))}
            </Menu>
          </View>

          {/* Filtro de Método */}
          <View style={styles.filterSection}>
            <Text variant="titleSmall" style={[styles.filterLabel, { color: onSurfaceColor }]}>
              Método de Pagamento
            </Text>
            <Menu
              visible={methodMenuVisible}
              onDismiss={() => setMethodMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMethodMenuVisible(true)}
                  style={styles.selectButton}
                  contentStyle={styles.selectButtonContent}
                  icon="chevron-down"
                >
                  {getSelectedMethodLabel()}
                </Button>
              }
            >
              <Menu.Item onPress={() => handleMethodSelect('')} title="Todos os métodos" />
              {methods.map((method) => (
                <Menu.Item
                  key={method.value}
                  onPress={() => handleMethodSelect(method.value)}
                  title={method.label}
                />
              ))}
            </Menu>
          </View>

          {/* Filtro de Período */}
          <View style={styles.filterSection}>
            <Text variant="titleSmall" style={[styles.filterLabel, { color: onSurfaceColor }]}>
              Período
            </Text>
            <Button
              mode="outlined"
              onPress={() => setDatePickerVisible(true)}
              style={styles.selectButton}
              contentStyle={styles.selectButtonContent}
              icon="calendar"
            >
              {getDateRangeLabel()}
            </Button>
          </View>

          <Divider style={styles.divider} />

          {/* Botões de ação */}
          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setAdvancedFiltersVisible(false)}>
              Fechar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setAdvancedFiltersVisible(false);
              }}
              buttonColor={primaryColor}
            >
              Aplicar
            </Button>
          </View>
        </Modal>

        {/* DatePicker */}
        <DatePickerModal
          locale="pt"
          mode="range"
          visible={datePickerVisible}
          onDismiss={() => setDatePickerVisible(false)}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onConfirm={handleDateRangeConfirm}
          label="Selecionar período"
          saveLabel="Confirmar"
          startLabel="Início"
          endLabel="Fim"
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
  },
  moreFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  activeBadge: {
    backgroundColor: 'rgba(0, 208, 158, 0.1)',
  },
  activeBadgeText: {
    fontSize: 12,
  },
  resultsCounter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  selectButton: {
    justifyContent: 'flex-start',
  },
  selectButtonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});