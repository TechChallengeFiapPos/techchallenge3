import { auth, db } from '@config/firebaseConfig.js';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type UserData = { uid: string; email: string; name?: string };

export const register = async (email: string, password: string, name: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Salva dados adicionais no Firestore (do user)
    const data: UserData = { uid: user.uid, email, name: name };
    await setDoc(doc(db, 'users', user.uid), data);

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (!docSnap.exists()) return { success: false, error: 'Usuário não encontrado' };

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};
