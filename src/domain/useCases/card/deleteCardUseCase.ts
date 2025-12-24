import * as CardRepository from '@src/data/repositories/CardRepository';

export const DeleteCardUseCase = async (userId: string, cardId: string) => {

  if (!cardId || cardId.trim() === '') {
    return { success: false, error: 'ID do cartão é obrigatório' };
  }

  // Passa userId para o repository
  const result = await CardRepository.deleteCard(userId, cardId);

  return result;
};