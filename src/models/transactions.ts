// src/models/transaction.ts
export interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  value: number; // Valor em centavos (para evitar problemas de ponto flutuante)
  userId: string;
  categoryId: string;
  methodId: string;
  cardId?: string;
  description?: string;
  receiptUrl?: string;
  tags?: string[]; // Tags para categorização adicional
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionData {
  date: Date;
  type: 'income' | 'expense';
  value: number; // Valor em centavos
  categoryId: string;
  methodId: string;
  cardId?: string;
  description?: string;
  tags?: string[];
}

export interface UpdateTransactionData {
  date?: Date;
  type?: 'income' | 'expense';
  value?: number; // Valor em centavos
  categoryId?: string;
  methodId?: string;
  cardId?: string;
  description?: string;
  tags?: string[];
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense' | 'all';
  categoryId?: string;
  methodId?: string;
  cardId?: string;
  minValue?: number; // Valor mínimo em centavos
  maxValue?: number; // Valor máximo em centavos
  tags?: string[]; // Filtrar por tags
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface TransactionFormField {
  name: keyof CreateTransactionData;
  label: string;
  placeholder?: string;
  required?: boolean;
  type: 'text' | 'select' | 'date' | 'currency' | 'textarea' | 'number';
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  maxLength?: number;
  options?: SelectOption[];
  conditional?: (formData: any) => boolean;
}

export interface TransactionFormData extends CreateTransactionData {}

export interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
  initialData?: Partial<TransactionFormData>;
  mode?: 'create' | 'edit';
}
