import * as authAPI from '@src/api/firebase/Auth';
import { createUserProfile } from '@src/api/firebase/User';
import { useAuth } from '@src/contexts/AuthContext';

export const useAuthActions = () => {
  // Não temos mais setUser/setProfile
  const { user, profile } = useAuth();

  const loginUser = async (email: string, password: string) => {
    const result = await authAPI.login(email, password);
    // aqui não chamamos setUser/setProfile
    // o AuthContext será atualizado automaticamente via onAuthStateChanged
    return result;
  };

  const registerUser = async (email: string, password: string, name: string) => {
    const result = await authAPI.register(email, password, name);

    if (result.success && result.user) {
      await createUserProfile(result.user, { name });
    }
    // novamente, AuthContext será atualizado via onAuthStateChanged
    return result;
  };

  return { loginUser, registerUser, user, profile };
};
