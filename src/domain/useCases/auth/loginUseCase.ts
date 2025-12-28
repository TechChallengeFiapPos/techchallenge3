import * as AuthRepository from '@src/data/repositories/AuthRepository';

export const loginUseCase = async (email: string, password: string) => {
  console.log('[loginUseCase] Validando login...');
  
  if (!email || email.trim() === '') {
    return { success: false, error: 'Email é obrigatório' };
  }

  if (!password || password.trim() === '') {
    return { success: false, error: 'Senha é obrigatória' };
  }

  console.log('[loginUseCase] Validações OK, autenticando...');
  
  // login verifica também Firestore internamente
  return await AuthRepository.login(email, password);
};