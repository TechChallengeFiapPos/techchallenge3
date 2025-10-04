import * as cardAPI from '@src/api/firebase/Card';
import { CardData } from '@src/api/firebase/Card';
import { useAuth } from '@src/contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';

export const useCards = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Carregar todos os cartões do usuário
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

  // Carregar cards quando o usuário mudar
  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Buscar cartão por ID
  const getCard = useCallback(async (cardId: string) => {
    const result = await cardAPI.getCardById(cardId);
    return result;
  }, []);

  // Buscar cartões por categoria
  const getCardsByCategory = useCallback(async (category: string) => {
    const result = await cardAPI.getCardsByCategory(category);
    return result;
  }, []);

  // Buscar cartões por função
  const getCardsByFunction = useCallback(async (functionType: string) => {
    const result = await cardAPI.getCardsByFunction(functionType);
    return result;
  }, []);

  // Função para recarregar dados
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
