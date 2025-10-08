// src/contexts/TransactionsContext.tsx - CÓDIGO COMPLETO

import { StorageAPI } from '@src/api/firebase/Storage';
import { TransactionAPI } from '@src/api/firebase/Transactions';
import { useAuth } from '@src/contexts/AuthContext';
import {
  CreateTransactionData,
  Transaction,
  TransactionFilters,
  UpdateTransactionData,
} from '@src/models/transactions';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import { calculateBalance, calculateExpenses, calculateIncome } from '@src/utils/transactions';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type TransactionContextType = {
  transactions: Transaction[];
  allTransactions: Transaction[]; 
  loading: boolean;
  error: string | null;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  hasMore: boolean;
  createTransaction: (data: CreateTransactionData) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (
    id: string,
    data: UpdateTransactionData,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;
  loadTransactions: (filters?: TransactionFilters) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  clearError: () => void;
};

const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // Lista paginada/filtrada 
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // TODAS as transações 
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

  const loadAllTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const result = await TransactionAPI.getAllByUser(user.uid);

      if (result.success && result.data) {
        const all = result.data;

        setAllTransactions(all);

        const income = calculateIncome(all);
        const expenses = calculateExpenses(all);
        const bal = calculateBalance(all);

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setBalance(bal);
      }
    } catch (err: any) {
      // Não loga erro se for permission denied (esperado no logout)
      if (err.code !== 'permission-denied') {
        console.error('Erro ao carregar todas transações:', err);
      }
    }
  }, [user]);

  const loadTransactions = useCallback(
    async (filters?: TransactionFilters) => {
      if (!user) return;

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
          // Não seta erro se for permission denied
          if (result.error !== 'Sem permissão para acessar transações') {
            setError(result.error || 'Erro ao carregar transações');
          }
        }
      } catch (err: any) {
        // Não seta erro se for permission denied
        if (err.code !== 'permission-denied') {
          setError('Erro inesperado ao carregar transações');
        }
      } finally {
        setLoading(false);
      }
    },
    [user],
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
        if (result.error !== 'Sem permissão para acessar transações') {
          setError(result.error || 'Erro ao carregar mais transações');
        }
      }
    } catch (err: any) {
      if (err.code !== 'permission-denied') {
        setError('Erro ao carregar mais transações');
      }
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
      loadAllTransactions()
    ]);
  }, [loadTransactions, loadAllTransactions, activeFilters]);

  // Criar
  const createTransaction = useCallback(
    async (data: CreateTransactionData) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        // 1. Criar transação primeiro
        const result = await TransactionAPI.create(user.uid, data);

        if (!result.success || !result.data) {
          setError(result.error || 'Erro ao criar transação');
          return { success: false, error: result.error };
        }

        // 2. Se tem attachment com temp_, mover para caminho definitivo
        if (data.attachment && data.attachment.url.includes('temp_')) {
          const moveResult = await StorageAPI.moveAttachmentFromTemp(
            user.uid,
            result.data.id,
            data.attachment.url
          );

          if (moveResult.success && moveResult.data) {
            // 3. Atualizar transação com novo URL
            await TransactionAPI.update(user.uid, result.data.id, {
              attachment: moveResult.data
            });
          } else {
            console.warn('Não foi possível mover arquivo temporário:', moveResult.error);
          }
        }

        // 4. Recarregar transações
        await Promise.all([refreshTransactions(), loadAllTransactions()]);
        return { success: true };
        
      } catch (err: any) {
        const friendlyError = getFirebaseErrorMessage(err);
        return { success: false, error: friendlyError };
      } finally {
        setLoading(false);
      }
    },
    [user, loadAllTransactions],
  );

  // Atualizar
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
    [user, loadAllTransactions],
  );

  // Deletar
  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      setLoading(true);
      setError(null);

      try {
        const transaction = allTransactions.find(t => t.id === id);
        if (transaction?.attachment?.url) {
          await StorageAPI.deleteAttachment(transaction.attachment.url);
        }

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
    [user, allTransactions, loadAllTransactions],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value: TransactionContextType = {
    transactions,
    allTransactions, 
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