// src/api/firebase/Transactions.ts - Versão corrigida completa

import { db } from '@config/firebaseConfig';
import {
  CreateTransactionData,
  Transaction,
  TransactionFilters,
  UpdateTransactionData,
} from '@src/models/transactions';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

const getUserTransactionsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'transactions');
};

export class TransactionAPI {
  // ============ CRIAR TRANSAÇÃO ============
  static async create(
    userId: string,
    data: CreateTransactionData,
  ): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      console.log('🔄 Criando nova transação:', { userId, data });

   // Remove attachment se for undefined
    const { attachment, ...restData } = data;
    
    const transactionData = {
      ...restData,
      userId,
      date: Timestamp.fromDate(new Date(data.date)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Só adiciona attachment se existir
      ...(attachment && { attachment }),
    };

      const docRef = await addDoc(getUserTransactionsCollection(userId), transactionData);

      const transaction: Transaction = {
        id: docRef.id,
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('✅ Transação criada com sucesso:', transaction.id);
      return { success: true, data: transaction };
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      return {
        success: false,
        error:
          error.code === 'permission-denied'
            ? 'Sem permissão para criar transação'
            : 'Erro ao salvar transação',
      };
    }
  }

  // ============ BUSCAR TRANSAÇÃO POR ID ============
  static async getById(
    userId: string,
    transactionId: string,
  ): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      console.log('Buscando transação:', { userId, transactionId });

      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'Transação não encontrada' };
      }

      const data = docSnap.data();
      const transaction: Transaction = {
        id: docSnap.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Transaction;

      console.log('Transação encontrada:', transaction.id);
      return { success: true, data: transaction };
    } catch (error: any) {
      console.error('Erro ao buscar transação:', error);
      return { success: false, error: 'Erro ao buscar transação' };
    }
  }

  // ============ BUSCAR TRANSAÇÕES COM SCROLL INFINITO ============
  static async getByUser(
    userId: string,
    filters: TransactionFilters = {},
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
  ): Promise<{
    success: boolean;
    data?: Transaction[];
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    hasMore?: boolean;
    error?: string;
  }> {
    try {
      console.log('Carregando transações (scroll infinito):', {
        userId,
        filters,
        pageSize,
        hasLastDoc: !!lastDoc,
      });

      let q = query(getUserTransactionsCollection(userId), orderBy('date', 'desc'));

      // Aplicar filtros
      if (filters.type && filters.type !== 'all') {
        q = query(q, where('type', '==', filters.type));
      }

      if (filters.categoryId) {
        q = query(q, where('categoryId', '==', filters.categoryId));
      }

      if (filters.methodId) {
        q = query(q, where('methodId', '==', filters.methodId));
      }

      if (filters.cardId) {
        q = query(q, where('cardId', '==', filters.cardId));
      }

      if (filters.startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(filters.startDate)));
      }

      if (filters.endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(filters.endDate)));
      }

      q = query(q, limit(pageSize));

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      let newLastDoc: QueryDocumentSnapshot<DocumentData> | undefined;

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        transactions.push({
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Transaction);

        newLastDoc = docSnap;
      });

      const hasMore = transactions.length === pageSize;

      console.log(`✅ Carregadas ${transactions.length} transações. Há mais: ${hasMore}`);
      return {
        success: true,
        data: transactions,
        lastDoc: newLastDoc,
        hasMore,
      };
    } catch (error: any) {
      console.error('Erro ao carregar transações:', error);
      return {
        success: false,
        error:
          error.code === 'permission-denied'
            ? 'Sem permissão para acessar transações'
            : 'Erro ao carregar transações',
      };
    }
  }

  // ============ BUSCAR TODAS AS TRANSAÇÕES (PARA DASHBOARD) ============
  static async getAllByUser(
    userId: string,
    limitCount: number = 1000,
  ): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    try {
      console.log('🔄 Carregando todas as transações para dashboard:', { userId, limitCount });

      const q = query(
        getUserTransactionsCollection(userId),
        orderBy('date', 'desc'),
        limit(limitCount),
      );

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        transactions.push({
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Transaction);
      });

      console.log(`✅ Dashboard: ${transactions.length} transações carregadas`);
      return { success: true, data: transactions };
    } catch (error: any) {
      console.error('Erro ao buscar todas as transações:', error);
      return {
        success: false,
        error: 'Erro ao carregar dados do dashboard',
      };
    }
  }

  // ============ BUSCAR POR PERÍODO (PARA GRÁFICOS) ============
  static async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    type?: 'income' | 'expense',
  ): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    try {
      console.log('🔄 Buscando transações por período:', {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type,
      });

      // REMOVIDO where('userId', '==', userId)
      let q = query(
        getUserTransactionsCollection(userId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc'),
      );

      if (type) {
        q = query(q, where('type', '==', type));
      }

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        transactions.push({
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Transaction);
      });

      console.log(`✅ Encontradas ${transactions.length} transações no período`);
      return { success: true, data: transactions };
    } catch (error: any) {
      console.error('Erro ao buscar transações por período:', error);
      return {
        success: false,
        error: 'Erro ao buscar dados do período',
      };
    }
  }

  // ============ ATUALIZAR TRANSAÇÃO ============
  static async update(
    userId: string,
    transactionId: string,
    data: UpdateTransactionData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
    console.log('🔄 Atualizando transação:', { userId, transactionId, data });

    const { attachment, date, ...restData } = data;

    const updateData = {
      ...restData,
      ...(date && { date: Timestamp.fromDate(date) }),
      ...(attachment !== undefined && { attachment }), // Permite null para remover
      updatedAt: serverTimestamp(),
    };

      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      await updateDoc(docRef, updateData);

      console.log('Transação atualizada com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar transação:', error);
      return {
        success: false,
        error:
          error.code === 'permission-denied'
            ? 'Sem permissão para editar transação'
            : 'Erro ao atualizar transação',
      };
    }
  }

  // ============ DELETAR TRANSAÇÃO ============
  static async delete(
    userId: string,
    transactionId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Deletando transação:', { userId, transactionId });

      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      await deleteDoc(docRef);

      console.log('✅ Transação deletada com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error);
      return {
        success: false,
        error:
          error.code === 'permission-denied'
            ? 'Sem permissão para deletar transação'
            : 'Erro ao deletar transação',
      };
    }
  }

  // ============ BUSCAR ÚLTIMAS TRANSAÇÕES ============
  static async getRecent(
    userId: string,
    limitCount: number = 10,
  ): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    try {
      console.log('🔄 Buscando transações recentes:', { userId, limitCount });

      // REMOVIDO where('userId', '==', userId)
      const q = query(
        getUserTransactionsCollection(userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount),
      );

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        transactions.push({
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Transaction);
      });

      console.log(`Encontradas ${transactions.length} transações recentes`);
      return { success: true, data: transactions };
    } catch (error: any) {
      console.error('Erro ao buscar transações recentes:', error);
      return { success: false, error: 'Erro ao carregar transações recentes' };
    }
  }
}