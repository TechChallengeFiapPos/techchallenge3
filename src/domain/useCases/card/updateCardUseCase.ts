import * as CardRepository from '@src/data/repositories/CardRepository';
import { UpdateCardData } from '@src/domain/entities/Card';

export const UpdateCardUseCase = async (
  userId: string,
  cardId: string,
  cardData: UpdateCardData
) => {

  if (cardData.number !== undefined) {
    const cleanNumber = cardData.number.replace(/\s/g, '');

    if (cleanNumber.length !== 16) {
      return { success: false, error: 'Número do cartão deve ter 16 dígitos' };
    }

    if (!/^\d{16}$/.test(cleanNumber)) {
      return { success: false, error: 'Número do cartão deve conter apenas dígitos' };
    }
  }

  // está mudando functions(black, platinum etc)?
  if (cardData.functions !== undefined && cardData.functions.length === 0) {
    return { success: false, error: 'Selecione pelo menos uma função' };
  }

  //  está mudando categoria?
  if (cardData.category !== undefined && cardData.category.trim() === '') {
    return { success: false, error: 'Categoria não pode ser vazia' };
  }

  //  está mudando expiryDate?
  if (cardData.expiryDate !== undefined && cardData.expiryDate.trim() === '') {
    return { success: false, error: 'Data de validade não pode ser vazia' };
  }

  // Passa userId para o repository
  const result = await CardRepository.updateCard(userId, cardId, cardData);

  return result;
};