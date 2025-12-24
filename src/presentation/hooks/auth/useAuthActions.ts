import * as authAPI from '@src/api/firebase/Auth';
import { createUserProfile } from '@src/api/firebase/User';
import { useAuth } from '@src/contexts/AuthContext';

export const useAuthActions = () => {
  // Não tem mais setUser/setProfile
  const { user, profile } = useAuth();

  const loginUser = async (email: string, password: string) => {
    const result = await authAPI.login(email, password);
    return result;
  };

  const registerUser = async (email: string, password: string, name: string) => {
    const result = await authAPI.register(email, password, name);

    if (result.success && result.user) {
      await createUserProfile(result.user, { name });
    }
    return result;
  };

  return { loginUser, registerUser, user, profile };
};
