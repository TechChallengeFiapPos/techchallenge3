import { storage } from '@src/config/firebaseConfig';
import { TransactionAttachment } from '@src/models/transactions';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors'; // ADICIONE
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

export class StorageAPI {
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