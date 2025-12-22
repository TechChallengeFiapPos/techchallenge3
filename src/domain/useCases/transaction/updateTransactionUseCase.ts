import { TransactionRepository } from '@src/data/repositories/TransactionRepository';
import { UpdateTransactionData } from '@src/domain/entities/Transaction';

export const UpdateTransactionUseCase = async (
  userId: string,
  id: string,
  data: UpdateTransactionData,
): Promise<{ success: boolean; error?: string }> => {
  
  return await TransactionRepository.update(userId, id, data);
};