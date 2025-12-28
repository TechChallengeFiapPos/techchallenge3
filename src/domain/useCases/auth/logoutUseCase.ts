import * as AuthRepository from '@src/data/repositories/AuthRepository';

export const logoutUseCase = async () => {

  const result = await AuthRepository.logout();

  if (result.success) {
    console.info('Logout completo!');
  } else {
    console.error('Erro no logout:', result.error);
  }

  return result;
};