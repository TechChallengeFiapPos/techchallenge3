import * as cardAPI from '@src/api/firebase/Card';
import { CreateCardData } from '@src/api/firebase/Card';
import { useState } from 'react';

export const useCardActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCard = async (cardData: CreateCardData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.createCard(cardData);

      if (!result.success) {
        setError(result.error || 'Erro ao criar cartão');
        return result;
      }

      return result;
    } catch (error: any) {
      setError(error.message || 'Erro inesperado');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

   const updateCard = async (cardId: string, cardData: cardAPI.UpdateCardData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.updateCard(cardId, cardData);

      if (!result.success) {
        setError(result.error || 'Erro ao atualizar cartão');
        return result;
      }

      return result;
    } catch (error: any) {
      setError(error.message || 'Erro inesperado');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.deleteCard(cardId);

      if (!result.success) {
        setError(result.error || 'Erro ao deletar cartão');
        return result;
      }

      return result;
    } catch (error: any) {
      setError(error.message || 'Erro inesperado');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const checkCardExists = async (cardNumber: string, excludeCardId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.checkCardExists(cardNumber, excludeCardId);

      if (!result.success) {
        setError(result.error || 'Erro ao verificar cartão');
        return result;
      }

      return result;
    } catch (error: any) {
      setError(error.message || 'Erro inesperado');
      return { success: false, error: error.message, exists: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCard,
    deleteCard,
    updateCard,
    checkCardExists,
    loading,
    error,
    clearError: () => setError(null),
  };
};
