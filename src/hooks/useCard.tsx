import * as cardAPI from '@src/api/firebase/Card';
import { CardData } from '@src/api/firebase/Card';
import { useEffect, useState } from 'react';

export const useCard = (cardId?: string) => {
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      setCard(null);
      return;
    }

    const getCard = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await cardAPI.getCardById(cardId);
        console.log(result, 'resultado do useCard');

        if (result.success) {
          setCard(result.card || null);
        } else {
          setError(result.error || 'Erro ao carregar cartão');
          setCard(null);
        }
      } catch (error: any) {
        setError(error.message || 'Erro inesperado');
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    getCard();
  }, [cardId]);

  return {
    card,
    loading,
    error,
    clearError: () => setError(null),
  };
};
