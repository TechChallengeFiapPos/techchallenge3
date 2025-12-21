import { storage } from '@src/config/firebaseConfig';
import { TransactionAttachment } from '@src/domain/entities/Transaction';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import {
    deleteObject,
    getDownloadURL,
    getMetadata,
    ref,
    uploadBytes,
    uploadBytesResumable,
} from 'firebase/storage';

export class StorageRepository {
  static async uploadAttachment(
    userId: string,
    transactionId: string,
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<{ success: boolean; data?: TransactionAttachment; error?: string }> {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const fileExtension = fileName.split('.').pop();
      const storagePath = `receipts/${userId}/${transactionId}/${Date.now()}.${fileExtension}`;

      const storageRef = ref(storage, storagePath);

      const metadata = {
        contentType: mimeType,
        customMetadata: {
          userId,
          transactionId,
          originalName: fileName,
        },
      };

      await uploadBytes(storageRef, blob, metadata);
      const downloadURL = await getDownloadURL(storageRef);

      const attachment: TransactionAttachment = {
        url: downloadURL,
        name: fileName,
        type: mimeType,
        size: blob.size,
        uploadedAt: Date.now(),
      };

      return { success: true, data: attachment };
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }

  static uploadWithProgress(
    userId: string,
    transactionId: string,
    fileUri: string,
    fileName: string,
    mimeType: string,
    onProgress: (progress: number) => void
  ): Promise<{ success: boolean; data?: TransactionAttachment; error?: string }> {
    return new Promise(async (resolve) => {
      try {
        const response = await fetch(fileUri);
        const blob = await response.blob();

        const fileExtension = fileName.split('.').pop();
        const storagePath = `receipts/${userId}/${transactionId}/${Date.now()}.${fileExtension}`;

        const storageRef = ref(storage, storagePath);

        const metadata = {
          contentType: mimeType,
          customMetadata: {
            userId,
            transactionId,
            originalName: fileName,
          },
        };

        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Erro no upload:', error);
            resolve({ success: false, error: getFirebaseErrorMessage(error) });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const attachment: TransactionAttachment = {
              url: downloadURL,
              name: fileName,
              type: mimeType,
              size: blob.size,
              uploadedAt: Date.now(),
            };

            resolve({ success: true, data: attachment });
          }
        );
      } catch (error: any) {
        console.error('Erro ao iniciar upload:', error);
        resolve({ success: false, error: getFirebaseErrorMessage(error) });
      }
    });
  }
  
  static async moveAttachmentFromTemp(
    userId: string,
    transactionId: string,
    tempUrl: string
  ): Promise<{ success: boolean; data?: TransactionAttachment; error?: string }> {
    try {
      // Referência ao arquivo temporário
      const tempRef = ref(storage, tempUrl);

      // Baixar arquivo temporário
      const downloadUrl = await getDownloadURL(tempRef);
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // Obter metadata do arquivo
      const metadata = await getMetadata(tempRef);
      const fileName = metadata.customMetadata?.originalName || 'file';
      const mimeType = metadata.contentType || 'application/octet-stream';

      // Upload para caminho definitivo
      const fileExtension = fileName.split('.').pop();
      const finalPath = `receipts/${userId}/${transactionId}/${Date.now()}.${fileExtension}`;
      const finalRef = ref(storage, finalPath);

      await uploadBytes(finalRef, blob, {
        contentType: mimeType,
        customMetadata: {
          userId,
          transactionId,
          originalName: fileName,
        },
      });

      const finalUrl = await getDownloadURL(finalRef);

      // Deletar arquivo temporário
      try {
        await deleteObject(tempRef);
      } catch (deleteError: any) {
        if (deleteError.code !== 'storage/object-not-found') {
          console.warn('Erro ao deletar temp:', deleteError);
        }
      }

      //Retornar attachment com novo URL
      return {
        success: true,
        data: {
          url: finalUrl,
          name: fileName,
          type: mimeType,
          size: blob.size,
          uploadedAt: Date.now(),
        },
      };
    } catch (error: any) {
      console.error('Erro ao mover arquivo:', error);
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }


  static async deleteAttachment(
    attachmentUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const storageRef = ref(storage, attachmentUrl);
      await deleteObject(storageRef);

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar arquivo:', error);

      if (error.code === 'storage/object-not-found') {
        return { success: true };
      }

      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }
}