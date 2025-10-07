import * as cardAPI from '@src/api/firebase/Card';
import { CardData } from '@src/api/firebase/Card';
import { useAuth } from '@src/contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';

export const useCards = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadCards = useCallback(async () => {
    if (!user) {
      setCards([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.getUserCards();

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
    const result = await cardAPI.getCardById(cardId);
    return result;
  }, []);

  const getCardsByCategory = useCallback(async (category: string) => {
    const result = await cardAPI.getCardsByCategory(category);
    return result;
  }, []);

  const getCardsByFunction = useCallback(async (functionType: string) => {
    const result = await cardAPI.getCardsByFunction(functionType);
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
