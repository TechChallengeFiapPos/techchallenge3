import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Por 5 minutos usa cache sem refetch
      staleTime: 1000 * 60 * 5,
      
      // Dados ficam em cache (memória) por 30 minutos
      gcTime: 1000 * 60 * 30,
      
      // Tentar 1 vez se der erro
      retry: 1,
      
      // Faz refetch quando usuário volta pro app
      refetchOnWindowFocus: true,
      
      // Faz refetch quando rede volta
      refetchOnReconnect: true,
      
      // Não faz refetch automaticamente quando monta componente
      refetchOnMount: false,
    },
    mutations: {
      // Não FAZ retry automático em mutations (create/update/delete/Eetc)
      retry: 0,
    },
  },
});