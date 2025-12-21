import { Transaction } from '@src/domain/entities/Transaction';
import { SelectOption } from '@src/presentation/types/CommonFormTypes';

// Tipos de transação
export const transactionTypeOptions: SelectOption[] = [
  { label: 'Receita', value: 'income' },
  { label: 'Despesa', value: 'expense' },
];

// Categorias de transação
export const transactionCategories: SelectOption[] = [
  // RECEITAS
  { label: 'Salário', value: 'salary' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Investimentos', value: 'investments' },
  { label: 'Vendas', value: 'sales' },
  { label: 'Bonificações', value: 'bonus' },
  { label: 'Aluguel Recebido', value: 'rental_income' },
  { label: 'Outros Ganhos', value: 'other_income' },

  // DESPESAS
  { label: 'Alimentação', value: 'food' },
  { label: 'Transporte', value: 'transport' },
  { label: 'Saúde', value: 'health' },
  { label: 'Educação', value: 'education' },
  { label: 'Lazer', value: 'entertainment' },
  { label: 'Moradia', value: 'home' },
  { label: 'Roupas', value: 'clothing' },
  { label: 'Tecnologia', value: 'technology' },
  { label: 'Contas', value: 'utilities' },
  { label: 'Combustível', value: 'fuel' },
  { label: 'Viagens', value: 'travel' },
  { label: 'Presentes', value: 'gifts' },
  { label: 'Farmácia', value: 'pharmacy' },
  { label: 'Cuidados Pessoais', value: 'personal_care' },
  { label: 'Pets', value: 'pets' },
  { label: 'Assinaturas', value: 'subscriptions' },
  { label: 'Seguros', value: 'insurance' },
  { label: 'Outros Gastos', value: 'other_expense' },
];

// Métodos de pagamento
export const paymentMethods: SelectOption[] = [
  { label: 'PIX', value: 'pix' },
  { label: 'Dinheiro', value: 'cash' },
  { label: 'Cartão de Crédito', value: 'credit_card' },
  { label: 'Cartão de Débito', value: 'debit_card' },
  { label: 'Transferência Bancária', value: 'bank_transfer' },
  { label: 'Boleto', value: 'boleto' },
  { label: 'Vale Refeição/Alimentação', value: 'meal_voucher' },
  { label: 'Vale Transporte', value: 'transport_voucher' },
];

// Opções para filtros (incluindo "Todos")
export const filterTypeOptions: SelectOption[] = [
  { label: 'Todos os tipos', value: 'all' },
  ...transactionTypeOptions,
];

export const filterCategoryOptions: SelectOption[] = [
  { label: 'Todas as categorias', value: '' },
  ...transactionCategories,
];

export const filterMethodOptions: SelectOption[] = [
  { label: 'Todos os métodos', value: '' },
  ...paymentMethods,
];

// ============ UTILITÁRIOS BÁSICOS ============

// Helper para buscar label por valor
export const getCategoryLabel = (categoryId: string): string => {
  return transactionCategories.find((c) => c.value === categoryId)?.label || categoryId;
};

export const getMethodLabel = (methodId: string): string => {
  return paymentMethods.find((m) => m.value === methodId)?.label || methodId;
};

export const getTypeLabel = (type: 'income' | 'expense'): string => {
  return transactionTypeOptions.find((t) => t.value === type)?.label || type;
};

// Helper para verificar se método requer cartão
export const methodRequiresCard = (methodId: string): boolean => {
  return ['credit_card', 'debit_card'].includes(methodId);
};

// Helper para filtrar categorias por tipo (se quiser separar receitas/despesas)
export const getCategoriesByType = (type: 'income' | 'expense' | 'all'): SelectOption[] => {
  if (type === 'all') return transactionCategories;

  const incomeCategories = [
    'salary',
    'freelance',
    'investments',
    'sales',
    'bonus',
    'rental_income',
    'other_income',
  ];

  return transactionCategories.filter((category) => {
    if (type === 'income') {
      return incomeCategories.includes(category.value);
    } else {
      return !incomeCategories.includes(category.value);
    }
  });
};

// Calcular receitas totais
export const calculateIncome = (transactions: Transaction[]): number => {
  return transactions.filter((t) => t.type === 'income').reduce((total, t) => total + t.value, 0);
};

// Calcular despesas totais
export const calculateExpenses = (transactions: Transaction[]): number => {
  return transactions.filter((t) => t.type === 'expense').reduce((total, t) => total + t.value, 0);
};

// Calcular saldo (receitas - despesas)
export const calculateBalance = (transactions: Transaction[]): number => {
  const income = calculateIncome(transactions);
  const expenses = calculateExpenses(transactions);
  return income - expenses;
};

// Validar se valor está dentro de um range válido
export const isValidAmount = (centavos: number): boolean => {
  return centavos > 0 && centavos <= 999999999; // Máximo: R$ 9.999.999,99
};

// mapeamento para os ícones da listagem
export const getCategoryIcon = (categoryId: string): string => {
  const iconMap: Record<string, string> = {
    // Receitas
    salary: 'card',
    freelance: 'laptop',
    investments: 'trending-up',
    sales: 'storefront',
    bonus: 'gift',
    rental_income: 'home',
    other_income: 'add-circle',

    // Despesas
    food: 'restaurant',
    transport: 'bus',
    health: 'medical',
    education: 'school',
    entertainment: 'game-controller',
    home: 'home',
    clothing: 'shirt',
    technology: 'laptop',
    utilities: 'flash',
    fuel: 'car',
    travel: 'airplane',
    gifts: 'gift',
    pharmacy: 'medical',
    personal_care: 'person',
    pets: 'paw',
    subscriptions: 'refresh',
    insurance: 'shield',
    other_expense: 'remove-circle',
  };
  return iconMap[categoryId] || 'ellipse';
};

// formata valor vindo do banco em reais
export const formatCurrency = (centavos: number): string => {
  const reais = Math.abs(centavos) / 100;
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
