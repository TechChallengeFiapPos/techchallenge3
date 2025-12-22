export interface TransactionAttachment {
  url: string;        // URL do arquivo no Firebase Storage
  name: string;       // Nome original do arquivo
  type: string;       // Tipo MIME (image/jpeg, application/pdf, etc)
  size: number;       // Tamanho em bytes
  uploadedAt: number; // Timestamp do upload
}

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
  tags?: string[]; // Tags para categorização adicional
  createdAt: Date;
  updatedAt: Date;
  attachment?: TransactionAttachment; // upload
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
  attachment?: TransactionAttachment; // upload
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
  attachment?: TransactionAttachment; // upload
}