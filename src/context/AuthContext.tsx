import { auth, db } from '@config/firebaseConfig';
import { UserData } from '@src/models/user';
import { useRouter } from 'expo-router';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: FirebaseUser | null;
  profile: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 useEffect AuthProvider iniciado');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('✅ onAuthStateChanged: usuário encontrado', firebaseUser.email);
          setUser(firebaseUser);

          // Buscar usuário no Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          const userProfile = docSnap.exists() ? (docSnap.data() as UserData) : null;
          setProfile(userProfile);

          console.log('📄 Perfil Firestore:', userProfile);

          // NAVEGAÇÃO: Ir para tela principal quando logado
          console.log('🔄 Navegando para /(tabs)');
          router.replace('/(tabs)');
        } else {
          console.log('❌ onAuthStateChanged: nenhum usuário logado');
          setUser(null);
          setProfile(null);

          // NAVEGAÇÃO: Ir para login quando não logado
          console.log('🔄 Navegando para /login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('❌ Erro no onAuthStateChanged:', error);

        //  Em caso de erro, ir para login como fallback
        setUser(null);
        setProfile(null);
        router.replace('/login');
      } finally {
        // Sempre remove loading no final! atencione
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Limpando listener AuthProvider');
      unsubscribe();
    };
  }, []); // não pode ter o router como dependência, importante!

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      await signOut(auth);

      // 🧹 Limpar estados locais
      setUser(null);
      setProfile(null);

      // 🚀 Navegar para login (onAuthStateChanged também vai fazer isso, mas é bom garantir)
      router.replace('/login');

      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
};
