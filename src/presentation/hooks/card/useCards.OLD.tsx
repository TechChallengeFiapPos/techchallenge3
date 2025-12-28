import { useAuth } from '@src/contexts/AuthContext';
import * as CardRepository from '@src/data/repositories/CardRepository';
import { Card } from '@src/domain/entities/Card';
import { useCallback, useEffect, useState } from 'react';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
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
      const result = await CardRepository.getUserCards(user.uid);

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

  const getCard = useCallback(
    async (cardId: string) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      const result = await CardRepository.getCardById(user.uid, cardId);
      return result;
    },
    [user]
  );

  const getCardsByCategory = useCallback(
    async (category: string) => {
      if (!user) return { success: false, cards: [] };

      const result = await CardRepository.getCardsByCategory(user.uid, category);
      return result;
    },
    [user]
  );

  const getCardsByFunction = useCallback(
    async (functionType: string) => {
      if (!user) return { success: false, cards: [] };

      const result = await CardRepository.getCardsByFunction(user.uid, functionType);
      return result;
    },
    [user]
  );

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