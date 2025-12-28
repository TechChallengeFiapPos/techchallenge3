import { useAuth } from '@src/contexts/AuthContext';
import { TransactionRepository } from '@src/data/repositories/TransactionRepository';
import { TransactionFilters } from '@src/domain/entities/Transaction';
import { useQuery } from '@tanstack/react-query';

// buscar transações com filtros para tela de listagem
export const useTransactions = (filters?: TransactionFilters) => {
  const { user } = useAuth();

  return useQuery({
    // QueryKey: identificador único do cache
    // Muda quando userId ou filtros mudam = nova query
    queryKey: ['transactions', user?.uid, filters],
    
    //busca os dados
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
    
    // Só executa se tiver usuário!!!
    enabled: !!user,
    
    // Cache válido por 5 minutos :)
    staleTime: 1000 * 60 * 5,
  });
};

//buscar TODAS as transações (sem filtros)
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
  });
};

//buscar 1 transação específica para editar
export const useTransaction = (id: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transaction', id],
    
    queryFn: async () => {
      if (!user || !id) {
        throw new Error('Dados inválidos');
      }
      
      // Busca da lista allTransactions primeiro (aqui pode estar no cache!)
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