import { useAuth } from '@src/contexts/AuthContext';
import * as CardRepository from '@src/data/repositories/CardRepository';
import { CreateCardData, UpdateCardData } from '@src/domain/entities/Card';
import { CreateCardUseCase, DeleteCardUseCase, UpdateCardUseCase } from '@src/domain/useCases/card';
import { useState } from 'react';

export const useCardActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createCard = async (cardData: CreateCardData) => {
    if (!user) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await CreateCardUseCase(user.uid, cardData);

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
    if (!user) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await UpdateCardUseCase(user.uid, cardId, cardData);

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
    if (!user) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await DeleteCardUseCase(user.uid, cardId);

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
    if (!user) {
      return { success: false, error: 'Usuário não autenticado', exists: false };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await CardRepository.checkCardExists(user.uid, cardNumber, excludeCardId);

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
