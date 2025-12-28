import { useAuth } from '@src/contexts/AuthContext';
import { loginUseCase, signUpUseCase } from '@src/domain/useCases/auth';

export const useAuthActions = () => {
  const { user, profile } = useAuth();

  const loginUser = async (email: string, password: string) => {
    return await loginUseCase(email, password);
  };

  const registerUser = async (email: string, password: string, name: string) => {
    return await signUpUseCase(email, password, name);
  };

  return { loginUser, registerUser, user, profile };
};