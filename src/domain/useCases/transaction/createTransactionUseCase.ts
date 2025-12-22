import { StorageRepository } from '@src/data/repositories/StorageRepository';
import { TransactionRepository } from '@src/data/repositories/TransactionRepository';
import { CreateTransactionData, Transaction } from '@src/domain/entities/Transaction';

export const CreateTransactionUseCase = async (
  userId: string,
  data: CreateTransactionData,
): Promise<{ success: boolean; data?: Transaction; error?: string }> => {
  
  const result = await TransactionRepository.create(userId, data);

  if (!result.success || !result.data) {
    return result;
  }

   // Se tem attachment com temp_, mover para caminho definitivo
  if (data.attachment && data.attachment.url.includes('temp_')) {
    const moveResult = await StorageRepository.moveAttachmentFromTemp(
      userId,
      result.data.id,
      data.attachment.url
    );

    if (moveResult.success && moveResult.data) {
      await TransactionRepository.update(userId, result.data.id, {
        attachment: moveResult.data,
      });
    }
  }

  return result;
};