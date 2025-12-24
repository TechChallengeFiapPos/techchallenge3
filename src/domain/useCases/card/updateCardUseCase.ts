import * as CardRepository from '@src/data/repositories/CardRepository';
import { UpdateCardData } from '@src/domain/entities/Card';

export const UpdateCardUseCase = async (cardId: string, cardData: UpdateCardData) => {
  
  if (cardData.number !== undefined) {
    const cleanNumber = cardData.number.replace(/\s/g, '');

    if (!/^\d{16}$/.test(cleanNumber)) {
      return { success: false, error: 'Número do cartão deve conter apenas dígitos' };
    }
  }

  // Validação: se está mudando functions(black, platinum etc)
  if (cardData.functions !== undefined && cardData.functions.length === 0) {
    return { success: false, error: 'Selecione pelo menos uma função' };
  }

  // Validação: se está mudando categoria
  if (cardData.category !== undefined && cardData.category.trim() === '') {
    return { success: false, error: 'Categoria não pode ser vazia' };
  }

  // Validação: se está mudando expiryDate
  if (cardData.expiryDate !== undefined && cardData.expiryDate.trim() === '') {
    return { success: false, error: 'Data de validade não pode ser vazia' };
  }

  const result = await CardRepository.updateCard(cardId, cardData);
  
  return result;
};