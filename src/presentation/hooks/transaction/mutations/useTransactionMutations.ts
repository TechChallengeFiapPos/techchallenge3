import { useAuth } from '@src/contexts/AuthContext';
import {
    CreateTransactionData,
    UpdateTransactionData
} from '@src/domain/entities/Transaction';
import { CreateTransactionUseCase, DeleteTransactionUseCase, UpdateTransactionUseCase } from '@src/domain/useCases/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTransaction = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateTransactionData) => {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const result = await CreateTransactionUseCase(user.uid, data);

            if (!result.success) {
                throw new Error(result.error || 'Erro ao criar transação');
            }

            return result;
        },

        // criação tem sucesso
        onSuccess: () => {
            // Invalida cache de transações
            // Todas as queries com essas keys vão dar refetch automaticamente!
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
        },

        // erro
        onError: (error: any) => {
            console.error('Erro ao criar transaction:', error.message);
        },
    });
};


export const useUpdateTransaction = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data
        }: {
            id: string;
            data: UpdateTransactionData;
        }) => {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const result = await UpdateTransactionUseCase(user.uid, id, data);

            if (!result.success) {
                throw new Error(result.error || 'Erro ao atualizar transação');
            }

            return result;
        },

        onSuccess: (_, variables) => {

            // Invalida cache geral após atualizar transação
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['allTransactions'] });

            // Invalida cache específico da transação editada
            queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
        },

        onError: (error: any) => {
            console.error('Erro ao atualizar transaction:', error.message);
        },
    });
};


export const useDeleteTransaction = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const result = await DeleteTransactionUseCase(user.uid, id);

            if (!result.success) {
                throw new Error(result.error || 'Erro ao deletar transação');
            }

            return result;
        },

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
            queryClient.invalidateQueries({ queryKey: ['transaction', id] });
        },

        onError: (error: any) => {
            console.error('Erro ao deletar transaction:', error.message);
        },
    });
};