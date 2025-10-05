import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import { StorageAPI } from '@src/api/firebase/Storage';
import { useAuth } from '@src/contexts/AuthContext';
import { TransactionAttachment } from '@src/models/transactions';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Linking, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Menu, ProgressBar, Text } from 'react-native-paper';

interface AttachmentPickerProps {
  attachment?: TransactionAttachment;
  onAttachmentChange: (attachment?: TransactionAttachment) => void;
  disabled?: boolean;
  transactionId?: string; 
}

export function AttachmentPicker({
  attachment,
  onAttachmentChange,
  disabled = false,
  transactionId,
}: AttachmentPickerProps) {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const errorColor = useThemeColor({}, 'error');

  const handleFileUpload = async (uri: string, fileName: string, mimeType: string) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Gerar ID temporário se não houver transactionId (novaa transacao)
      const tempId = transactionId || `temp_${Date.now()}`;

      const result = await StorageAPI.uploadWithProgress(
        user.uid,
        tempId,
        uri,
        fileName,
        mimeType,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (result.success && result.data) {
        onAttachmentChange(result.data);
        Alert.alert('Sucesso', 'Arquivo enviado com sucesso!');
      } else {
        Alert.alert('Erro', result.error || 'Falha ao enviar arquivo');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const pickFromCamera = async () => {
    setMenuVisible(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await handleFileUpload(
        asset.uri,
        `receipt_${Date.now()}.jpg`,
        'image/jpeg'
      );
    }
  };

  const pickFromGallery = async () => {
    setMenuVisible(false);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await handleFileUpload(
        asset.uri,
        asset.fileName || `receipt_${Date.now()}.jpg`,
        'image/jpeg'
      );
    }
  };

  const pickDocument = async () => {
    setMenuVisible(false);

    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await handleFileUpload(
        asset.uri,
        asset.name,
        asset.mimeType || 'application/pdf'
      );
    }
  };

  const removeAttachment = () => {
    Alert.alert(
      'Remover anexo',
      'Tem certeza que deseja remover este anexo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            // Deletar no Firebase Storage
            if (attachment?.url) {
              await StorageAPI.deleteAttachment(attachment.url);
            }
            onAttachmentChange(undefined);
          },
        },
      ]
    );
  };

  const viewAttachment = () => {
    if (attachment?.url) {
      Linking.openURL(attachment.url);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={[styles.label, { color: onSurfaceColor }]}>
        Anexar Recibo (Opcional)
      </Text>

      {!attachment ? (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              icon="paperclip"
              onPress={() => setMenuVisible(true)}
              disabled={disabled || uploading}
              style={styles.button}
            >
              Adicionar Comprovante
            </Button>
          }
        >
          <Menu.Item
            onPress={pickFromCamera}
            title="Tirar Foto"
            leadingIcon="camera"
          />
          <Menu.Item
            onPress={pickFromGallery}
            title="Escolher da Galeria"
            leadingIcon="image"
          />
          <Menu.Item
            onPress={pickDocument}
            title="Escolher Documento"
            leadingIcon="file-document"
          />
        </Menu>
      ) : (
        <Card style={[styles.attachmentCard, { backgroundColor: surfaceColor }]}>
          <Card.Content style={styles.attachmentContent}>
            {attachment.type.startsWith('image/') && (
              <Image source={{ uri: attachment.url }} style={styles.preview} />
            )}

            {attachment.type === 'application/pdf' && (
              <View style={[styles.pdfPreview, { backgroundColor: errorColor + '20' }]}>
                <Ionicons name="document-text" size={40} color={errorColor} />
              </View>
            )}

            <View style={styles.fileInfo}>
              <Text variant="bodyMedium" style={{ color: onSurfaceColor }} numberOfLines={1}>
                {attachment.name}
              </Text>
              <Text variant="bodySmall" style={{ color: onSurfaceColor, opacity: 0.7 }}>
                {formatFileSize(attachment.size)}
              </Text>
            </View>

            <View style={styles.actions}>
              <IconButton
                icon="eye"
                size={20}
                onPress={viewAttachment}
                iconColor={primaryColor}
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={removeAttachment}
                iconColor={errorColor}
                disabled={disabled}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {uploading && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={uploadProgress / 100} color={primaryColor} />
          <Text variant="bodySmall" style={{ color: onSurfaceColor, marginTop: 4 }}>
            Enviando para a nuvem... {uploadProgress.toFixed(0)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
  },
  attachmentCard: {
    borderRadius: 12,
    elevation: 1,
  },
  attachmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  pdfPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  progressContainer: {
    marginTop: 12,
  },
});