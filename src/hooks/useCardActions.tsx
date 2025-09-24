import * as cardAPI from '@src/api/firebase/Card';
import { CreateCardData } from '@src/api/firebase/Card';
import { useState } from 'react';

export const useCardActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar novo cartão
  const createCard = async (cardData: CreateCardData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.createCard(cardData);
      console.log(result, 'resultado do createCard');

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

  // Deletar cartão
  const deleteCard = async (cardId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.deleteCard(cardId);
      console.log(result, 'resultado do deleteCard');

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

  // Verificar se cartão existe
  const checkCardExists = async (cardNumber: string, excludeCardId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cardAPI.checkCardExists(cardNumber, excludeCardId);
      console.log(result, 'resultado do checkCardExists');

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
    checkCardExists,
    loading,
    error,
    clearError: () => setError(null),
  };
};
