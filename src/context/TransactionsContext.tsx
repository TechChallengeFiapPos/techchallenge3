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
  transactions: Transaction[]; // Lista paginada/filtrada
  allTransactions: Transaction[]; // TODAS as transações (para gráficos)
  loading: boolean;
  error: string | null;

  // Estatísticas
  totalIncome: number;
  totalExpenses: number;
  balance: number;

  // Scroll infinito
  hasMore: boolean;

  // Ações
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

  // Lista paginada/filtrada (para a tela de transações)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // TODAS as transações (para gráficos - NUNCA FILTRADO)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll infinito
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [activeFilters, setActiveFilters] = useState<TransactionFilters>({});

  // Totais
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  const clearError = useCallback(() => setError(null), []);

  // Carregar TODAS as transações (para gráficos e totais)
  const loadAllTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const result = await TransactionAPI.getAllByUser(user.uid);

      if (result.success && result.data) {
        const all = result.data;
        
        // Atualiza TODAS as transações (para gráficos)
        setAllTransactions(all);
        
        // Calcula totais
        const income = calculateIncome(all);
        const expenses = calculateExpenses(all);
        const bal = calculateBalance(all);

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setBalance(bal);
      }
    } catch (err: any) {
      console.error('Erro ao carregar todas transações:', err);
    }
  }, [user]);

  // Carregar transações paginadas/filtradas (para listagem)
  const loadTransactions = useCallback(
    async (filters?: TransactionFilters) => {
      if (!user || loading) return;

      setLoading(true);
      setError(null);
      setActiveFilters(filters || {});

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

  // Scroll infinito
  const loadMoreTransactions = useCallback(async () => {
    if (!user || !hasMore || loading) return;

    setLoading(true);

    try {
      const result = await TransactionAPI.getByUser(user.uid, activeFilters, 12, lastDoc);

      if (result.success && result.data) {
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

  // Refresh
  const refreshTransactions = useCallback(async () => {
    setLastDoc(undefined);
    setHasMore(true);
    await Promise.all([
      loadTransactions(activeFilters),
      loadAllTransactions() // Atualiza gráficos também
    ]);
  }, [loadTransactions, loadAllTransactions, activeFilters]);

  // Criar
  const createTransaction = useCallback(
    async (data: CreateTransactionData) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.create(user.uid, data);

        if (result.success) {
          await Promise.all([refreshTransactions(), loadAllTransactions()]);
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
    [user, refreshTransactions, loadAllTransactions],
  );

  // Atualizar (precisa do userId agora)
  const updateTransaction = useCallback(
    async (id: string, data: UpdateTransactionData) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.update(user.uid, id, data);

        if (result.success) {
          await Promise.all([refreshTransactions(), loadAllTransactions()]);
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
    [user, refreshTransactions, loadAllTransactions],
  );

  // Deletar (precisa do userId agora)
  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        const result = await TransactionAPI.delete(user.uid, id);

        if (result.success) {
          await Promise.all([refreshTransactions(), loadAllTransactions()]);
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
    [user, refreshTransactions, loadAllTransactions],
  );

  // Carregar ao montar
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadAllTransactions();
    } else {
      setTransactions([]);
      setAllTransactions([]);
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
    transactions, // Lista filtrada
    allTransactions, // TODAS (para gráficos)
    loading,
    error,
    totalIncome,
    totalExpenses,
    balance,
    hasMore,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    loadMoreTransactions,
    refreshTransactions,
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