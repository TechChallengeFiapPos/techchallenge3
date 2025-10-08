import { Transaction } from '@src/models/transactions';
import { getCategoryLabel } from '@src/utils/transactions';
import { useMemo } from 'react';

export interface CategorySummary {
  categoryId: string;
  categoryLabel: string;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthSummary {
  month: string;
  year: number;
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

export const groupByCategory = (transactions: Transaction[]): CategorySummary[] => {
  const groups: { [key: string]: { total: number; count: number } } = {};
  const totalAmount = transactions.reduce((sum, t) => sum + t.value, 0);

  transactions.forEach((transaction) => {
    const categoryId = transaction.categoryId;
    if (!groups[categoryId]) {
      groups[categoryId] = { total: 0, count: 0 };
    }
    groups[categoryId].total += transaction.value;
    groups[categoryId].count += 1;
  });

  return Object.entries(groups)
    .map(([categoryId, data]) => ({
      categoryId,
      categoryLabel: getCategoryLabel(categoryId),
      total: data.total,
      count: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const groupByMonth = (transactions: Transaction[]): MonthSummary[] => {
  const groups: { [key: string]: MonthSummary } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    if (!groups[monthKey]) {
      groups[monthKey] = {
        month: monthName,
        year: date.getFullYear(),
        income: 0,
        expenses: 0,
        balance: 0,
        count: 0,
      };
    }

    if (transaction.type === 'income') {
      groups[monthKey].income += transaction.value;
    } else {
      groups[monthKey].expenses += transaction.value;
    }

    groups[monthKey].count += 1;
    groups[monthKey].balance = groups[monthKey].income - groups[monthKey].expenses;
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.year, 0, 1).getTime() - new Date(a.year, 0, 1).getTime(),
  );
};

export const useTransactionAnalytics = (transactions: Transaction[]) => {
  const categoryAnalysis = useMemo(() => groupByCategory(transactions), [transactions]);
  const monthlyAnalysis = useMemo(() => groupByMonth(transactions), [transactions]);

  return {
    categoryAnalysis,
    monthlyAnalysis,
  };
};
