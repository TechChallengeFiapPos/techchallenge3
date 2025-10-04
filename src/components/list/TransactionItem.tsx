// src/components/list/TransactionItem.tsx - Com data no centro

import { useThemeColor } from '@hooks/useThemeColor';
import { ThemedList } from '@src/components/list/ThemedList';
import { Transaction } from '@src/models/transactions';
import { formatCurrency, getCategoryIcon, getCategoryLabel } from '@src/utils/transactions';
import React from 'react';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export const TransactionItem = React.memo<TransactionItemProps>(
  ({ transaction, onPress, onEdit, onDelete }) => {
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = useThemeColor({}, 'error');

    const formatDateTime = (date: Date): string => {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).format(date);
    };

    const getTransactionColors = () => {
      if (transaction.type === 'income') {
        return {
          valueColor: primaryColor,
          iconBackgroundColor: primaryColor,
        };
      } else {
        return {
          valueColor: errorColor,
          iconBackgroundColor: errorColor,
        };
      }
    };

    const title = getCategoryLabel(transaction.categoryId) || 'Transação';
    const subtitle = `${transaction.type === 'expense' ? '-' : '+'}${formatCurrency(transaction.value)}`;
    const centerText = formatDateTime(transaction.date); // DATA
    const rightText = '';
    const iconName = getCategoryIcon(transaction.categoryId);
    const colors = getTransactionColors();

    return (
      <ThemedList
        title={title}
        subtitle={subtitle}
        centerText={centerText}
        rightText={rightText}
        iconName={iconName}
        iconColor="white"
        iconBackgroundColor={colors.iconBackgroundColor}
        subtitleColor={colors.valueColor}
        onPress={onPress ? () => onPress(transaction) : undefined}
        onEdit={onEdit ? () => onEdit(transaction) : undefined}
        onDelete={onDelete ? () => onDelete(transaction) : undefined}
      />
    );
  },
);

TransactionItem.displayName = 'TransactionItem';