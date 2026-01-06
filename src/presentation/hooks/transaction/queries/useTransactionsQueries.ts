import { useAuth } from '@src/contexts/AuthContext';
import { TransactionRepository } from '@src/data/repositories/TransactionRepository';
import { TransactionFilters } from '@src/domain/entities/Transaction';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Hook para buscar transações COM SCROLL INFINITO
 * MOBILE-OPTIMIZATION: Carrega 20 por vez para economizar memória
 * 
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteTransactions(filters);
 * const transactions = data?.pages.flatMap(page => page.transactions) || [];
 */
export const useInfiniteTransactions = (filters?: TransactionFilters) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ['transactions', 'infinite', user?.uid, filters],

    queryFn: async ({ pageParam }: {
      pageParam: QueryDocumentSnapshot<DocumentData> | undefined
    }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Busca 20 transações por vez, passando o cursor (lastDoc)
      const result = await TransactionRepository.getByUser(
        user.uid,
        filters || {},
        20,       // ← Limit: 20 por página
        pageParam // ← Cursor para paginação
      );

      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar transações');
      }

      return {
        transactions: result.data || [],
        nextCursor: result.lastDoc,      // Cursor para próxima página
        hasMore: result.hasMore || false, // Tem mais dados?
      };
    },

    // Primeira página não tem cursor
    initialPageParam: undefined,

    // Como pegar a próxima página
    getNextPageParam: (lastPage) => {
      // Se tem mais dados, retorna o cursor
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },

    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos

    // Limita páginas em cache para economizar memória
    // Mantém apenas as últimas 3 páginas (45 transações) em cache
    maxPages: 3,
  });
};

// para buscar transações com filtros (SEM paginação)
export const useTransactions = (filters?: TransactionFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.uid, filters],

    queryFn: async () => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const result = await TransactionRepository.getByUser(user.uid, filters);

      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar transações');
      }

      return result.data || [];
    },

    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

// para buscar TODAS as transações (sem filtros)
export const useAllTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['allTransactions', user?.uid],

    queryFn: async () => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const result = await TransactionRepository.getAllByUser(user.uid);

      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar transações');
      }

      return result.data || [];
    },

    enabled: !!user,
    staleTime: 1000 * 60 * 5,

    // Dashboard não precisa refetch ao navegar
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// para buscar 1 transação específica pra editar
export const useTransaction = (id: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transaction', id],

    queryFn: async () => {
      if (!user || !id) {
        throw new Error('Dados inválidos');
      }

      // Busca da lista allTransactions primeiro (pode estar em cache!)
      const allResult = await TransactionRepository.getAllByUser(user.uid);

      if (allResult.success && allResult.data) {
        const found = allResult.data.find((t) => t.id === id);
        if (found) return found;
      }

      throw new Error('Transação não encontrada');
    },

    enabled: !!user && !!id,
    staleTime: 1000 * 60 * 5,
  });
};