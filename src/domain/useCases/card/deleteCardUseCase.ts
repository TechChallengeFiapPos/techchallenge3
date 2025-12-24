import * as CardRepository from '@src/data/repositories/CardRepository';

export const DeleteCardUseCase = async (cardId: string) => {
  return await CardRepository.deleteCard(cardId);
};