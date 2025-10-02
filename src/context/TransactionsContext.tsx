// src/contexts/TransactionContext.tsx
import { TransactionAPI } from '@src/api/firebase/Transactions';
import { useAuth } from '@src/context/AuthContext';
import {
  CreateTransactionData,
  Transaction,
  TransactionFilters,
  UpdateTransactionData,
} from '@src/models/transactions';
import { calculateBalance, calculateExpenses, calculateIncome } from '@src/utils/transactions';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type TransactionContextType = {
  // Estados principais
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Estatísticas essenciais (baseadas em TODAS as transações)
  totalIncome: number;
  totalExpenses: number;
  balance: number;

  // Scroll infinito
  hasMore: boolean;

  // Ações essenciais
  createTransaction: (data: CreateTransactionData) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (
    id: string,
    data: UpdateTransactionData,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Carregamento
  loadTransactions: (filters?: TransactionFilters) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;

  // Utilitários
  clearError: () => void;
};

const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // Estados principais - Lista paginada
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll infinito
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  
  // Armazenar os filtros ativos
  const [activeFilters, setActiveFilters] = useState<TransactionFilters>({});

  // Totais separados (independentes da paginação)
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  // Utilitários
  const clearError = useCallback(() => setError(null), []);

  // Carregar TOTAIS (todas as transações, separado da lista paginada)
  const loadTotals = useCallback(async () => {
    if (!user) return;

    try {
      console.log('📊 Carregando totais...');
      const result = await TransactionAPI.getAllByUser(user.uid);

      if (result.success && result.data) {
        const allTransactions = result.data;
        
        const income = calculateIncome(allTransactions);
        const expenses = calculateExpenses(allTransactions);
        const bal = calculateBalance(allTransactions);

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setBalance(bal);

        console.log('✅ Totais carregados:', {
          income: income / 100,
          expenses: expenses / 100,
          balance: bal / 100,
          total: allTransactions.length,
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar totais:', err);
    }
  }, [user]);

  // Carregar transações (lista paginada)
  const loadTransactions = useCallback(
    async (filters?: TransactionFilters) => {
      if (!user || loading) return;

      setLoading(true);
      setError(null);
      setActiveFilters(filters || {}); // Salvar os filtros ativos

      try {
        const result = await TransactionAPI.getByUser(user.uid, filters || {}, 12);

        if (result.success && result.data) {
          setTransactions(result.data);
          setLastDoc(result.lastDoc);
          setHasMore(result.hasMore || false);
        } else {
          setError(result.error || 'Erro ao carregar transações');
        }
      } catch (err: any) {
        setError('Erro inesperado ao carregar transações');
      } finally {
        setLoading(false);
      }
    },
    [user, loading],
  );

  // Carregar mais (scroll infinito) - COM FILTROS ATIVOS
  const loadMoreTransactions = useCallback(async () => {
    if (!user || !hasMore || loading) return;

    setLoading(true);

    try {
      // Usa os filtros ativos
      const result = await TransactionAPI.getByUser(user.uid, activeFilters, 12, lastDoc);

      if (result.success && result.data) {
        // Filtra duplicatas antes de adicionar
        setTransactions((prev) => {
          const existingIds = new Set(prev.map(t => t.id));
          const newTransactions = result.data!.filter(t => !existingIds.has(t.id));
          return [...prev, ...newTransactions];
        });
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore || false);
      } else {
        setError(result.error || 'Erro ao carregar mais transações');
      }
    } catch (err: any) {
      setError('Erro ao carregar mais transações');
    } finally {
      setLoading(false);
    }
  }, [user, hasMore, loading, lastDoc, activeFilters]);

  // Refresh (recarrega lista E totais)
  const refreshTransactions = useCallback(async () => {
    setLastDoc(undefined);
    setHasMore(true);
    await Promise.all([loadTransactions(activeFilters), loadTotals()]);
  }, [loadTransactions, loadTotals, activeFilters]);

  // Criar transação
  const createTransaction = useCallback(
    async (data: CreateTransactionData) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.create(user.uid, data);

        if (result.success && result.data) {
          // Recarrega lista E totais
          await Promise.all([refreshTransactions(), loadTotals()]);
          return { success: true };
        } else {
          setError(result.error || 'Erro ao criar transação');
          return { success: false, error: result.error };
        }
      } catch (err: any) {
        setError('Erro inesperado ao criar transação');
        return { success: false, error: 'Erro inesperado' };
      } finally {
        setLoading(false);
      }
    },
    [user, refreshTransactions, loadTotals],
  );

  // Atualizar transação
  const updateTransaction = useCallback(
    async (id: string, data: UpdateTransactionData) => {
      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.update(id, data);

        if (result.success) {
          // Recarrega lista E totais
          await Promise.all([refreshTransactions(), loadTotals()]);
          return { success: true };
        } else {
          setError(result.error || 'Erro ao atualizar transação');
          return { success: false, error: result.error };
        }
      } catch (err: any) {
        setError('Erro inesperado ao atualizar transação');
        return { success: false, error: 'Erro inesperado' };
      } finally {
        setLoading(false);
      }
    },
    [refreshTransactions, loadTotals],
  );

  // Deletar transação
  const deleteTransaction = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.delete(id);

        if (result.success) {
          // Recarrega lista E totais
          await Promise.all([refreshTransactions(), loadTotals()]);
          return { success: true };
        } else {
          setError(result.error || 'Erro ao deletar transação');
          return { success: false, error: result.error };
        }
      } catch (err: any) {
        setError('Erro inesperado ao deletar transação');
        return { success: false, error: 'Erro inesperado' };
      } finally {
        setLoading(false);
      }
    },
    [refreshTransactions, loadTotals],
  );

  // Carregar transações E totais quando usuário muda
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadTotals();
    } else {
      setTransactions([]);
      setError(null);
      setLastDoc(undefined);
      setHasMore(true);
      setActiveFilters({});
      setTotalIncome(0);
      setTotalExpenses(0);
      setBalance(0);
    }
  }, [user]);

  const value: TransactionContextType = {
    // Estados principais
    transactions,
    loading,
    error,

    // Estatísticas essenciais (agora fixas!)
    totalIncome,
    totalExpenses,
    balance,

    // Scroll infinito
    hasMore,

    // Ações essenciais
    createTransaction,
    updateTransaction,
    deleteTransaction,

    // Carregamento
    loadTransactions,
    loadMoreTransactions,
    refreshTransactions,

    // Utilitários
    clearError,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions deve ser usado dentro do TransactionProvider');
  }
  return context;
};