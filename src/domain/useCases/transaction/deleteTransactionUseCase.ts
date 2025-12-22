import { StorageRepository } from '@src/data/repositories/StorageRepository';
import { TransactionRepository } from '@src/data/repositories/TransactionRepository';

export const DeleteTransactionUseCase = async (
  userId: string,
  transactionId: string,
  attachmentUrl?: string,
): Promise<{ success: boolean; error?: string }> => {
  
  // Deleta attachment (se houver)
  if (attachmentUrl) {
    await StorageRepository.deleteAttachment(attachmentUrl);
  }

  return await TransactionRepository.delete(userId, transactionId);
};