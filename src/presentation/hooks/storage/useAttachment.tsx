import { useAuth } from '@src/contexts/AuthContext';
import { StorageRepository } from '@src/data/repositories/StorageRepository';
import { TransactionAttachment } from '@src/domain/entities/Transaction';
import { useCallback, useState } from 'react';

export const useAttachment = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadAttachment = useCallback(
    async (
      transactionId: string,
      uri: string,
      fileName: string,
      mimeType: string
    ): Promise<{ success: boolean; data?: TransactionAttachment; error?: string }> => {
      if (!user) {
        return { success: false, error: 'Erro ao enviar comprovante: Usuário não autenticado' };
      }

      setUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const result = await StorageRepository.uploadWithProgress(
          user.uid,
          transactionId,
          uri,
          fileName,
          mimeType,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        if (!result.success) {
          setError(result.error || 'Erro ao enviar comprovante: Erro ao enviar arquivo');
        }

        return result;
      } catch (err: any) {
        const errorMsg = err.message || 'Erro ao enviar comprovante: Erro ao enviar arquivo';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [user]
  );

  const deleteAttachment = useCallback(
    async (url: string): Promise<{ success: boolean; error?: string }> => {
      if (!user) {
        return { success: false, error: 'Erro ao deletar comprovante: Usuário não autenticado' };
      }

      setError(null);

      try {
        const result = await StorageRepository.deleteAttachment(url);
        
        if (!result.success) {
          setError(result.error || 'Erro ao deletar arquivo');
        }

        return result;
      } catch (err: any) {
        const errorMsg = err.message || 'Erro ao deletar arquivo';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [user]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    uploadAttachment,
    deleteAttachment,
    uploading,
    uploadProgress,
    error,
    clearError,
  };
};