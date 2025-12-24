import * as CardRepository from '@src/data/repositories/CardRepository';
import { CreateCardData, UpdateCardData } from '@src/domain/entities/Card';
import { CreateCardUseCase, DeleteCardUseCase, UpdateCardUseCase } from '@src/domain/useCases/card';
import { useState } from 'react';

export const useCardActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCard = async (cardData: CreateCardData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await CreateCardUseCase(cardData);

      if (!result.success) {
        setError(result.error || 'Erro ao criar cartão');
      }

      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Erro inesperado';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (cardId: string, cardData: UpdateCardData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await UpdateCardUseCase(cardId, cardData);

      if (!result.success) {
        setError(result.error || 'Erro ao atualizar cartão');
      }

      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Erro inesperado';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DeleteCardUseCase(cardId);

      if (!result.success) {
        setError(result.error || 'Erro ao deletar cartão');
      }

      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Erro inesperado';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const checkCardExists = async (cardNumber: string, excludeCardId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await CardRepository.checkCardExists(cardNumber, excludeCardId);

      if (!result.success) {
        setError(result.error || 'Erro ao verificar cartão');
      }

      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Erro inesperado';
      setError(errorMsg);
      return { success: false, error: errorMsg, exists: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCard,
    updateCard,
    deleteCard,
    checkCardExists,
    loading,
    error,
    clearError: () => setError(null),
  };
};