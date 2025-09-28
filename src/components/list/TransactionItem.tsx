// src/components/transactions/TransactionItem.tsx - Usando tema personalizado
import { useThemeColor } from '@hooks/useThemeColor';
import { ThemedList } from '@src/components/list/ThemedList';
import { Transaction } from '@src/models/transactions';
import { formatCurrency, getCategoryIcon, getCategoryLabel } from '@src/utils/transactions';
import React from 'react';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export const TransactionItem = React.memo<TransactionItemProps>(({ transaction, onPress }) => {
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');

  const formatDateTime = (date: Date): string => {
    const day = new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
    }).format(date);

    return `${day}`;
  };

  const getTransactionColors = () => {
    if (transaction.type === 'income') {
      return {
        rightTextColor: primaryColor, // Verde do tema para receitas
        iconBackgroundColor: primaryColor,
      };
    } else {
      return {
        rightTextColor: errorColor, // Cor de erro do tema para despesas
        iconBackgroundColor: errorColor,
      };
    }
  };

  // dados para o BaseListItem
  const title = getCategoryLabel(transaction.categoryId) || 'Transação';
  const subtitle = formatDateTime(transaction.date);
  const rightText = `${transaction.type === 'expense' ? '-' : ''}${formatCurrency(transaction.value)}`;
  const iconName = getCategoryIcon(transaction.categoryId);
  const colors = getTransactionColors();

  const handlePress = () => {
    onPress?.(transaction);
  };

  return (
    <ThemedList
      title={title}
      subtitle={subtitle}
      rightText={rightText}
      iconName={iconName}
      iconColor="white"
      iconBackgroundColor={colors.iconBackgroundColor}
      rightTextColor={colors.rightTextColor}
      onPress={onPress ? handlePress : undefined}
    />
  );
});

TransactionItem.displayName = 'TransactionItem';
