export function getFirebaseErrorMessage(error: any): string {
  const errorCode = error.code || '';

  // Auth
  const authErrors: Record<string, string> = {
    'auth/email-already-in-use': 'Este email já está cadastrado',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'Senha muito fraca. Use no mínimo 6 caracteres',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    'auth/user-disabled': 'Esta conta foi desabilitada',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/invalid-credential': 'Credenciais inválidas',
    'auth/account-exists-with-different-credential': 'Já existe uma conta com este email',
  };

  // Firestore
  const firestoreErrors: Record<string, string> = {
    'permission-denied': 'Sem permissão para esta operação',
    'not-found': 'Dados não encontrados',
    'already-exists': 'Este registro já existe',
    'resource-exhausted': 'Limite de requisições excedido',
    'failed-precondition': 'Operação não permitida neste momento',
    'aborted': 'Operação cancelada',
    'out-of-range': 'Valor fora do intervalo permitido',
    'unimplemented': 'Funcionalidade não implementada',
    'internal': 'Erro interno do servidor',
    'unavailable': 'Serviço temporariamente indisponível',
    'data-loss': 'Perda de dados detectada',
    'unauthenticated': 'Faça login para continuar',
  };

  // Storage
  const storageErrors: Record<string, string> = {
    'storage/unauthorized': 'Sem permissão para fazer upload',
    'storage/canceled': 'Upload cancelado',
    'storage/unknown': 'Erro desconhecido no upload',
    'storage/object-not-found': 'Arquivo não encontrado',
    'storage/bucket-not-found': 'Armazenamento não configurado',
    'storage/project-not-found': 'Projeto não encontrado',
    'storage/quota-exceeded': 'Espaço de armazenamento esgotado',
    'storage/unauthenticated': 'Faça login para fazer upload',
    'storage/retry-limit-exceeded': 'Muitas tentativas. Tente novamente',
    'storage/invalid-checksum': 'Arquivo corrompido',
    'storage/invalid-event-name': 'Evento inválido',
    'storage/invalid-url': 'URL inválida',
    'storage/invalid-argument': 'Argumento inválido',
    'storage/no-default-bucket': 'Nenhum bucket padrão configurado',
    'storage/cannot-slice-blob': 'Erro ao processar arquivo',
    'storage/server-file-wrong-size': 'Tamanho do arquivo incorreto',
  };

  // Buscar mensagem pt-BR
  if (authErrors[errorCode]) return authErrors[errorCode];
  if (firestoreErrors[errorCode]) return firestoreErrors[errorCode];
  if (storageErrors[errorCode]) return storageErrors[errorCode];

  // Tornar errorCode mais amigável
  if (errorCode) {
    const cleanCode = errorCode.split('/')[1] || errorCode;
    const readable = cleanCode
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return readable;
  }

  // Erro Genérico
  return 'Ocorreu um erro. Tente novamente';
}