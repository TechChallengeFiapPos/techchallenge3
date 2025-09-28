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

  // Estatísticas essenciais
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

  // Estados principais
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll infinito
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();

  // Estatísticas calculadas automaticamente
  const totalIncome = calculateIncome(transactions);
  const totalExpenses = calculateExpenses(transactions);
  const balance = calculateBalance(transactions);

  // Utilitários
  const clearError = useCallback(() => setError(null), []);

  // Carregar transações
  const loadTransactions = useCallback(
    async (filters?: TransactionFilters) => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.getByUser(user.uid, filters || {}, 20);

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
    [user],
  );

  // Carregar mais (scroll infinito)
  const loadMoreTransactions = useCallback(async () => {
    if (!user || !hasMore || loading) return;

    setLoading(true);

    try {
      const result = await TransactionAPI.getByUser(user.uid, {}, 20, lastDoc);

      if (result.success && result.data) {
        setTransactions((prev) => [...prev, ...result.data!]);
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
  }, [user, hasMore, loading, lastDoc]);

  // Refresh
  const refreshTransactions = useCallback(async () => {
    setLastDoc(undefined);
    setHasMore(true);
    await loadTransactions();
  }, [loadTransactions]);

  // Criar transação
  const createTransaction = useCallback(
    async (data: CreateTransactionData) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.create(user.uid, data);

        if (result.success && result.data) {
          setTransactions((prev) => [result.data!, ...prev]);
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
    [user],
  );

  // Atualizar transação
  const updateTransaction = useCallback(async (id: string, data: UpdateTransactionData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await TransactionAPI.update(id, data);

      if (result.success) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date() } : t)),
        );
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
  }, []);

  // Deletar transação
  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await TransactionAPI.delete(id);

      if (result.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
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
  }, []);

  // Carregar transações quando usuário muda
  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
      setError(null);
      setLastDoc(undefined);
      setHasMore(true);
    }
  }, [user, loadTransactions]);

  const value: TransactionContextType = {
    // Estados principais
    transactions,
    loading,
    error,

    // Estatísticas essenciais
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
