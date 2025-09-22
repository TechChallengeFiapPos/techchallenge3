import { db } from '@src/config/firebaseConfig';
import { UserData } from '@src/models/user';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const createUserProfile = async (user: User, extra: { name: string }) => {
  const userRef = doc(db, 'users', user.uid);

  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    name: extra.name,
    createdAt: new Date(),
  };

  await setDoc(userRef, userData, { merge: true });

  return userData;
};

export const getUserProfile = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserData) : null;
};
