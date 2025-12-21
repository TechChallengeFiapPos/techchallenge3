import { CreateTransactionData } from "@src/domain/entities/Transaction";
import { SelectOption } from "./CommonFormTypes";

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