
import { storage } from '@src/config/firebaseConfig';
import { TransactionAttachment } from '@src/models/transactions';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

export class StorageAPI {
  // Upload de arquivo simples
  static async uploadAttachment(
    userId: string,
    transactionId: string,
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<{ success: boolean; data?: TransactionAttachment; error?: string }> {
    try {
      console.log('📤 Iniciando upload simples...');
      console.log('  userId:', userId);
      console.log('  transactionId:', transactionId);
      console.log('  fileUri:', fileUri);
      console.log('  fileName:', fileName);
      console.log('  mimeType:', mimeType);

      // Buscar o arquivo como blob
      console.log('  Convertendo arquivo para blob...');
      const response = await fetch(fileUri);
      const blob = await response.blob();

      console.log('  Blob criado:');
      console.log('    - Tamanho:', blob.size, 'bytes');
      console.log('    - Tipo:', blob.type);

      // Criar referência no Storage
      const fileExtension = fileName.split('.').pop();
      const storagePath = `receipts/${userId}/${transactionId}/${Date.now()}.${fileExtension}`;
      console.log('  Caminho no Storage:', storagePath);

      const storageRef = ref(storage, storagePath);
      console.log('  Referência criada');

      // Metadados
      const metadata = {
        contentType: mimeType,
        customMetadata: {
          userId,
          transactionId,
          originalName: fileName,
        },
      };
      console.log('  Metadata:', metadata);

      // Upload
      console.log('  Iniciando upload...');
      await uploadBytes(storageRef, blob, metadata);
      console.log('  Upload concluído!');

      // Obter URL de download
      console.log('  Obtendo URL de download...');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('  URL obtida:', downloadURL);

      const attachment: TransactionAttachment = {
        url: downloadURL,
        name: fileName,
        type: mimeType,
        size: blob.size,
        uploadedAt: Date.now(),
      };

      console.log('✅ Upload completo!');
      return { success: true, data: attachment };
    } catch (error: any) {
      console.error('❌ Erro ao fazer upload:', error);
      console.error('  Código:', error.code);
      console.error('  Mensagem:', error.message);
      console.error('  Stack:', error.stack);
      return { success: false, error: error.message };
    }
  }

  // Upload com progresso
  static uploadWithProgress(
    userId: string,
    transactionId: string,
    fileUri: string,
    fileName: string,
    mimeType: string,
    onProgress: (progress: number) => void
  ): Promise<{ success: boolean; data?: TransactionAttachment; error?: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('📤 Iniciando upload com progresso...');
        console.log('  userId:', userId);
        console.log('  transactionId:', transactionId);
        console.log('  fileUri:', fileUri);
        console.log('  fileName:', fileName);
        console.log('  mimeType:', mimeType);

        console.log('  Convertendo arquivo para blob...');
        const response = await fetch(fileUri);
        const blob = await response.blob();

        console.log('  Blob criado:');
        console.log('    - Tamanho:', blob.size, 'bytes');
        console.log('    - Tipo:', blob.type);

        const fileExtension = fileName.split('.').pop();
        const storagePath = `receipts/${userId}/${transactionId}/${Date.now()}.${fileExtension}`;
        console.log('  Caminho no Storage:', storagePath);

        const storageRef = ref(storage, storagePath);
        console.log('  Referência criada');

        const metadata = {
          contentType: mimeType,
          customMetadata: {
            userId,
            transactionId,
            originalName: fileName,
          },
        };
        console.log('  Metadata:', metadata);

        console.log('  Criando uploadTask...');
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`  Progresso: ${progress.toFixed(1)}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes)`);
            console.log(`  Estado: ${snapshot.state}`);
            onProgress(progress);
          },
          (error) => {
            console.error('❌ Erro no upload:', error);
            console.error('  Código:', error.code);
            console.error('  Mensagem:', error.message);
            console.error('  Server Response:', error.serverResponse);
            resolve({ success: false, error: error.message });
          },
          async () => {
            console.log('  Upload completo! Obtendo URL...');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('  URL obtida:', downloadURL);

            const attachment: TransactionAttachment = {
              url: downloadURL,
              name: fileName,
              type: mimeType,
              size: blob.size,
              uploadedAt: Date.now(),
            };

            console.log('✅ Upload com progresso completo!');
            resolve({ success: true, data: attachment });
          }
        );
      } catch (error: any) {
        console.error('❌ Erro ao iniciar upload:', error);
        console.error('  Código:', error.code);
        console.error('  Mensagem:', error.message);
        console.error('  Stack:', error.stack);
        resolve({ success: false, error: error.message });
      }
    });
  }

  // Deletar arquivo
  static async deleteAttachment(
    attachmentUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deletando arquivo:', attachmentUrl);
      const storageRef = ref(storage, attachmentUrl);
      await deleteObject(storageRef);
      console.log('✅ Arquivo deletado com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro ao deletar arquivo:', error);
      console.error('  Código:', error.code);
      console.error('  Mensagem:', error.message);
      return { success: false, error: error.message };
    }
  }
}