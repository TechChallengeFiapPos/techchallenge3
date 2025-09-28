// src/components/cards/CardItem.tsx - Usando tema personalizado
import { useThemeColor } from '@hooks/useThemeColor';
import { CardData } from '@src/models/card';
import React from 'react';
import { ThemedFlatList } from './ThemedList';

interface CardItemProps {
  card: CardData;
  onPress?: (card: CardData) => void;
}

export const CardItem = React.memo<CardItemProps>(({ card, onPress }) => {
  // Cores do tema
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const errorColor = useThemeColor({}, 'error');

  // Formatação de moeda para limite e usado
  const formatCurrency = (centavos: number): string => {
    const reais = centavos / 100;
    return reais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Formatação da data de vencimento
  const formatDueDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  // Calcular percentual usado
  const getUsagePercentage = (): number => {
    if (card.limit === 0) return 0;
    return Math.round((card.used / card.limit) * 100);
  };

  // Ícone baseado na bandeira do cartão
  const getCardIcon = (brand: string): string => {
    const iconMap: Record<string, string> = {
      visa: 'card',
      mastercard: 'card',
      elo: 'card',
      amex: 'card',
    };
    return iconMap[brand] || 'card';
  };

  // Cores baseadas no percentual de uso usando o tema
  const getUsageColors = () => {
    const percentage = getUsagePercentage();

    if (percentage >= 90) {
      return {
        centerTextColor: errorColor, // Vermelho do tema - perigo
        iconBackgroundColor: errorColor,
      };
    } else if (percentage >= 70) {
      return {
        centerTextColor: secondaryColor, // Azul do tema - atenção
        iconBackgroundColor: secondaryColor,
      };
    } else {
      return {
        centerTextColor: primaryColor, // Verde do tema - ok
        iconBackgroundColor: primaryColor,
      };
    }
  };

  // Preparar dados para o BaseListItem
  const title = `${card.category} - **** ${card.number.slice(-4)}`;
  const subtitle = `Vence: ${formatDueDate(card.dueDate)}`;
  const centerText = `${getUsagePercentage()}% usado`;
  const rightText = `${formatCurrency(card.limit - card.used)} disponível`;
  const iconName = getCardIcon(card.brand);
  const colors = getUsageColors();

  const handlePress = () => {
    onPress?.(card);
  };

  return (
    <ThemedFlatList
      title={title}
      subtitle={subtitle}
      centerText={centerText}
      rightText={rightText}
      iconName={iconName}
      iconColor="white"
      iconBackgroundColor={colors.iconBackgroundColor}
      centerTextColor={colors.centerTextColor}
      onPress={onPress ? handlePress : undefined}
    />
  );
});

CardItem.displayName = 'CardItem';
