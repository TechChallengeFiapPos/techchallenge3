import * as CardRepository from '@src/data/repositories/CardRepository';
import { CreateCardData } from '@src/domain/entities/Card';

export const CreateCardUseCase = async (userId: string, cardData: CreateCardData) => {

  if (!cardData.number) {
    return { success: false, error: 'Número do cartão é obrigatório' };
  }

  const cleanNumber = cardData.number.replace(/\s/g, '');

  if (cleanNumber.length !== 16) {
    return { success: false, error: 'Número do cartão deve ter 16 dígitos' };
  }

  if (!/^\d{16}$/.test(cleanNumber)) {
    return { success: false, error: 'Número do cartão deve conter apenas dígitos' };
  }

  if (!cardData.functions || cardData.functions.length === 0) {
    return { success: false, error: 'Selecione pelo menos uma função para o cartão' };
  }

  if (!cardData.category || cardData.category.trim() === '') {
    return { success: false, error: 'Categoria é obrigatória' };
  }

  if (!cardData.expiryDate || cardData.expiryDate.trim() === '') {
    return { success: false, error: 'Data de validade é obrigatória' };
  }


  // Passa userId para o repository
  const result = await CardRepository.createCard(userId, cardData);

  return result;
};