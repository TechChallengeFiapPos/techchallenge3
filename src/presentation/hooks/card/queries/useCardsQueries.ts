import { useAuth } from '@src/contexts/AuthContext';
import * as CardRepository from '@src/data/repositories/CardRepository';
import { useQuery } from '@tanstack/react-query';

// buscar todos os cartões do usuário
export const useCards = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cards', user?.uid],
    
    queryFn: async () => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const result = await CardRepository.getUserCards(user.uid);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar cartões');
      }
      
      return result.cards || [];
    },
    
    enabled: !!user,
    
    // OTIMIZAÇÕES DE CACHE pois ainda estava com refetch
    // Cache válido por 10 minutos (cards mudam menos que transações)
    staleTime: 1000 * 60 * 10,
    
    // Dados ficam em memória por 30 minutos mesmo sem uso
    gcTime: 1000 * 60 * 30,
    
    // NÃO refetch quando componente monta (usa cache!)
    refetchOnMount: false,
    
    // NÃO refetch quando volta pro app
    refetchOnWindowFocus: false,
    
    // SIM refetch quando rede volta
    refetchOnReconnect: true,
  });
};

// Hook para buscar 1 cartão específico
export const useCard = (cardId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['card', cardId],
    
    queryFn: async () => {
      if (!user || !cardId) {
        throw new Error('Dados inválidos');
      }
      
      const result = await CardRepository.getCardById(user.uid, cardId);
      
      if (!result.success) {
        throw new Error(result.error || 'Cartão não encontrado');
      }
      
      return result.card;
    },
    
    enabled: !!user && !!cardId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// para buscar cartões por categoria
export const useCardsByCategory = (category: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cards', user?.uid, 'category', category],
    
    queryFn: async () => {
      if (!user || !category) {
        throw new Error('Dados inválidos');
      }
      
      const result = await CardRepository.getCardsByCategory(user.uid, category);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar cartões');
      }
      
      return result.cards || [];
    },
    
    enabled: !!user && !!category,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

//para buscar cartões por função
export const useCardsByFunction = (functionType: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cards', user?.uid, 'function', functionType],
    
    queryFn: async () => {
      if (!user || !functionType) {
        throw new Error('Dados inválidos');
      }
      
      const result = await CardRepository.getCardsByFunction(user.uid, functionType);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar cartões');
      }
      
      return result.cards || [];
    },
    
    enabled: !!user && !!functionType,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};