import { CardData } from '@src/api/firebase/Card';
import { maskCardNumber } from '@src/utils/cards';
import React from 'react';
import { ThemedListItem } from '../ThemedListItem';

interface CardItemProps {
  card: CardData;
  onPress?: (card: CardData) => void;
  onEdit?: (card: CardData) => void;
  onDelete?: (card: CardData) => void;
}

export const CardItem = React.memo<CardItemProps>(
  ({ card, onPress, onEdit, onDelete }) => {
    const formatFunctions = (functions: string[]) => {
      return functions
        .map(f => f === 'credit' ? 'Crédito' : 'Débito')
        .join(' / ');
    };

    const getCategoryLabel = (category: string) => {
      const labels: Record<string, string> = {
        platinum: 'Platinum',
        gold: 'Gold',
        black: 'Black',
      };
      return labels[category] || category;
    };

    const getCategoryColor = (category: string): string => {
      const colors: Record<string, string> = {
        platinum: '#0EA5E9',
        gold: '#F59E0B',     
        black: '#6B7280',    
      };
      return colors[category] || '#0EA5E9'; 
    };

    const title = getCategoryLabel(card.category);
    const maskedNumber = maskCardNumber(card.number);
    const subtitle = `${maskedNumber}\n${formatFunctions(card.functions)}`;
    const centerText = card.expiryDate;
    const iconName = 'card-outline';
    const iconBackgroundColor = getCategoryColor(card.category); 

    return (
      <ThemedListItem
        title={title}
        subtitle={subtitle}
        centerText={centerText}
        rightText=""
        iconName={iconName}
        iconColor="white"
        iconBackgroundColor={iconBackgroundColor}
        onPress={onPress ? () => onPress(card) : undefined}
        onEdit={onEdit ? () => onEdit(card) : undefined}
        onDelete={onDelete ? () => onDelete(card) : undefined}
      />
    );
  },
);

CardItem.displayName = 'CardItem';