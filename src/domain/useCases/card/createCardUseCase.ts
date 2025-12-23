import * as CardRepository from '@src/data/repositories/CardRepository';
import { CreateCardData } from '@src/domain/entities/Card';

export const CreateCardUseCase = async (cardData: CreateCardData) => {

  const cleanNumber = cardData.number.replace(/\s/g, '');

  if (!/^\d{16}$/.test(cleanNumber)) {
    return { success: false, error: 'Número do cartão deve conter apenas dígitos' };
  }

  // Validação: deve ter pelo menos 1 função
  if (!cardData.functions || cardData.functions.length === 0) {
    return { success: false, error: 'Selecione pelo menos uma função para o cartão' };
  }

  // Validação: categoria obrigatória
  if (!cardData.category || cardData.category.trim() === '') {
    return { success: false, error: 'Categoria é obrigatória' };
  }

  // Validação: expiryDate obrigatório
  if (!cardData.expiryDate || cardData.expiryDate.trim() === '') {
    return { success: false, error: 'Data de validade é obrigatória' };
  }

  const result = await CardRepository.createCard(cardData);
  
  return result;
};