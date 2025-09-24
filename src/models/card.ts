// Tipos para os dados do cartão
export type CardData = {
  userId: string;
  number: string;
  functions: string[];
  category: string;
};

export type CardFormData = {
  number: string;
  functions: string[];
  category: string;
  expiryDate?: string;
};

// Tipos para as options dos selects
export type SelectOption = {
  label: string;
  value: string;
};

// Tipos para os campos do formulário
export type CardFormField = {
  name: keyof CardFormData;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'select' | 'multiselect';
  options?: SelectOption[];
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'number-pad';
  maxLength?: number;
  autoComplete?:
    | 'off'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-csc'
    | 'name'
    | 'email'
    | 'tel'
    | 'street-address'
    | 'postal-code';
};

// Props do componente
export interface CardFormProps {
  onSubmit: (data: CardFormData) => void;
  disabled?: boolean;
  errors?: Partial<CardFormData>;
  initialData?: Partial<CardFormData>;
}
