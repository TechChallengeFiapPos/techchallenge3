// Tipos para os dados do cartão
export type CardData = {
  userId: string;
  number: string;
  functions: string[];
  category: string;
};

export type Card = {
  id?: string;
  userId: string;
  number: string;
  functions: string[];
  category: string;
  expiryDate: string;
  createdAt?: any;
  updatedAt?: any;
};

export type CreateCardData = {
  number: string;
  functions: string[];
  category: string;
  expiryDate: string;
};

export type UpdateCardData = Partial<CreateCardData>;