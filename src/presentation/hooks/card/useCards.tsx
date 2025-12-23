import * as CardRepository from '@src/data/repositories/CardRepository';
import { Card } from '@src/domain/entities/Card';
import { useCallback, useEffect, useState } from 'react';
import { useAuthActions } from '../auth/useAuthActions';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthActions();

  const loadCards = useCallback(async () => {
    if (!user) {
      setCards([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await CardRepository.getUserCards();

      if (result.success) {
        setCards(result.cards || []);
      } else {
        setError(result.error || 'Erro ao carregar cartões');
        setCards([]);
      }
    } catch (error: any) {
      setError(error.message || 'Erro inesperado');
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const getCard = useCallback(async (cardId: string) => {
    const result = await CardRepository.getCardById(cardId);
    return result;
  }, []);

  const getCardsByCategory = useCallback(async (category: string) => {
    const result = await CardRepository.getCardsByCategory(category);
    return result;
  }, []);

  const getCardsByFunction = useCallback(async (functionType: string) => {
    const result = await CardRepository.getCardsByFunction(functionType);
    return result;
  }, []);

  const refetch = useCallback(() => {
    loadCards();
  }, [loadCards]);

  return {
    cards,
    loading,
    error,
    refetch,
    getCard,
    getCardsByCategory,
    getCardsByFunction,
    clearError: () => setError(null),
  };
};