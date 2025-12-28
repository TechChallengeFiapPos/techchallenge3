import { useAuth } from '@src/contexts/AuthContext';
import * as CardRepository from '@src/data/repositories/CardRepository';
import { CreateCardData, UpdateCardData } from '@src/domain/entities/Card';
import { CreateCardUseCase, DeleteCardUseCase, UpdateCardUseCase } from '@src/domain/useCases/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * para criar cartão
 * 
 * @returns {mutate, isPending, error, isSuccess}
 * 
 * @example
 * const { mutate: createCard, isPending } = useCreateCard();
 * 
 * createCard(cardData, {
 *   onSuccess: () => console.log('Criado!'),
 *   onError: (error) => console.error(error.message)
 * });
 */
export const useCreateCard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCardData) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const result = await CreateCardUseCase(user.uid, data);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao criar cartão');
      }
      
      return result;
    },
    
    onSuccess: () => {
      // Invalida TODOS os caches de cards
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
    
    onError: (error: any) => {
      console.error('Erro ao criar card:', error.message);
    },
  });
};

/**
 * para atualizar cartão
 * 
 * @returns {mutate, isPending, error, isSuccess}
 * 
 * @example
 * const { mutate: updateCard, isPending } = useUpdateCard();
 * 
 * updateCard({ id: 'card123', data: cardData }, {
 *   onSuccess: () => console.log('Atualizado!'),
 *   onError: (error) => console.error(error.message)
 * });
 */
export const useUpdateCard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: UpdateCardData;
    }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const result = await UpdateCardUseCase(user.uid, id, data);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao atualizar cartão');
      }
      
      return result;
    },
    
    onSuccess: (_, variables) => {
      // Invalida cache geral
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      
      // Invalida cache específico do cartão!
      queryClient.invalidateQueries({ queryKey: ['card', variables.id] });
    },
    
    onError: (error: any) => {
      console.error('Erro ao atualizar card:', error.message);
    },
  });
};

/**
 * para deletar cartão
 * 
 * @returns {mutate, isPending, error, isSuccess}
 * 
 * @example
 * const { mutate: deleteCard, isPending } = useDeleteCard();
 * 
 * deleteCard('card123', {
 *   onSuccess: () => console.log('Deletado!'),
 *   onError: (error) => console.error(error.message)
 * });
 */
export const useDeleteCard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const result = await DeleteCardUseCase(user.uid, id);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao deletar cartão');
      }
      
      return result;
    },
    
    onSuccess: (_, id) => {      
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['card', id] });
    },
    
    onError: (error: any) => {
      console.error('Erro ao deletar card:', error.message);
    },
  });
};

/**
 * para verificar se cartão existe
 * Usado em validações de formulário
 * 
 * @returns {mutate, isPending, error, data}
 * 
 * @example
 * const { mutate: checkExists } = useCheckCardExists();
 * 
 * checkExists({ cardNumber: '1234...', excludeCardId: 'card123' }, {
 *   onSuccess: (result) => {
 *     if (result.exists) {
 *       console.log('Cartão já existe!');
 *     }
 *   }
 * });
 */
export const useCheckCardExists = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      cardNumber, 
      excludeCardId 
    }: { 
      cardNumber: string; 
      excludeCardId?: string;
    }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const result = await CardRepository.checkCardExists(
        user.uid, 
        cardNumber, 
        excludeCardId
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao verificar cartão');
      }
      
      return result;
    },
  });
};