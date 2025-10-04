import { auth, db } from '@config/firebaseConfig.js';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type UserData = { uid: string; email: string; name?: string };

export const register = async (email: string, password: string, name: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Salva dados adicionais no Firestore
    const data: UserData = { uid: user.uid, email, name: name };
    await setDoc(doc(db, 'users', user.uid), data);

    // Retorna o objeto user do Firebase
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Busca dados adicionais do Firestore
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (!docSnap.exists()) return { success: false, error: 'Usuário não encontrado' };

    // Retorna o objeto user do Firebase
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};
