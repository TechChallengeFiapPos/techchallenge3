import { db } from '@config/firebaseConfig';
import {
  CreateTransactionData,
  Transaction,
  UpdateTransactionData,
} from '@src/domain/entities/Transaction';
import { TransactionFilters } from '@src/presentation/types/TransactionFormTypes';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import { metrics } from '@src/utils/metrics';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  deleteField,
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

export class TransactionRepository {
  
  static async create(
    userId: string,
    data: CreateTransactionData,
  ): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    metrics.logRequest('TransactionRepository.create', { userId });
    try {
      const { attachment, ...restData } = data;
    
      const transactionData = {
        ...restData,
        userId,
        date: Timestamp.fromDate(new Date(data.date)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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

      return { success: true, data: transaction };
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      
      if (error.code === 'permission-denied') {
        return { success: false, error: 'Sem permissão para criar transação' };
      }
      
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static async getById(
    userId: string,
    transactionId: string,
  ): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
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

      return { success: true, data: transaction };
    } catch (error: any) {
      console.error('Erro ao buscar transação:', error);
      console.log('Erro ao buscar transação:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

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
    metrics.logRequest('TransactionRepository.getByUser', { userId, filters });
    try {
      let q = query(getUserTransactionsCollection(userId), orderBy('date', 'desc'));

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

      return {
        success: true,
        data: transactions,
        lastDoc: newLastDoc,
        hasMore,
      };
    } catch (error: any) {
      console.error('Erro ao carregar transações:', error);
      
      if (error.code === 'permission-denied') {
        return { success: false, error: 'Sem permissão para acessar transações' };
      }
      
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static async getAllByUser(
    userId: string,
    limitCount: number = 1000,
  ): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    metrics.logRequest('TransactionRepository.getAllByUser', { userId });
    try {
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

      return { success: true, data: transactions };
    } catch (error: any) {
      console.error('Erro ao buscar todas as transações:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    type?: 'income' | 'expense',
  ): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    try {
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

      return { success: true, data: transactions };
    } catch (error: any) {
      console.error('Erro ao buscar transações por período:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static async update(
    userId: string,
    transactionId: string,
    data: UpdateTransactionData,
  ): Promise<{ success: boolean; error?: string }> {
    metrics.logRequest('TransactionRepository.update', { userId, transactionId });
    try {
      const { attachment, date, ...restData } = data;

      let updateData: Record<string, any> = {
        ...restData,
        updatedAt: serverTimestamp(),
      };

      if (date) {
        updateData.date = Timestamp.fromDate(date);
      }

      // Tratar attachment corretamente
      if (attachment === undefined) {
        updateData.attachment = deleteField(); // Remove do Firestore
      } else if (attachment !== null) {
        updateData.attachment = attachment; // Atualiza
      }

      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      await updateDoc(docRef, updateData);

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar transação:', error);
      
      if (error.code === 'permission-denied') {
        return { success: false, error: 'Sem permissão para editar transação' };
      }
      
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static async delete(
    userId: string,
    transactionId: string
  ): Promise<{ success: boolean; error?: string }> {
    metrics.logRequest('TransactionRepository.update', { userId, transactionId });
    try {
      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      await deleteDoc(docRef);

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error);
      
      if (error.code === 'permission-denied') {
        return { success: false, error: 'Sem permissão para deletar transação' };
      }
      
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static async getRecent(
    userId: string,
    limitCount: number = 10,
  ): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    try {
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

      return { success: true, data: transactions };
    } catch (error: any) {
      console.error('Erro ao buscar transações recentes:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }
}