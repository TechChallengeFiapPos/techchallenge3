import * as AuthRepository from '@src/data/repositories/AuthRepository';

export const signUpUseCase = async (
  email: string, 
  password: string, 
  name: string
) => {

  if (!email || email.trim() === '') {
    return { success: false, error: 'Email é obrigatório' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }

  if (!name || name.trim() === '') {
    return { success: false, error: 'Nome é obrigatório' };
  }

  // (Auth + Firestore)
  return await AuthRepository.register(email, password, name);
};