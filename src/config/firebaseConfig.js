import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1 Initializa Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAzGt2jTmXZnJ5OFx3nOFZ0gxR3F1k6nm4',
  authDomain: 'bytebank-tc3.firebaseapp.com',
  projectId: 'bytebank-tc3',
  storageBucket: 'bytebank-tc3.firebasestorage.app',
  messagingSenderId: '272268877645',
  appId: '1:272268877645:web:1463e5bf85c8843bb3a104',
};

// 2 Inicializa o app
const app = initializeApp(firebaseConfig);

// 3 Inicializa o Auth com persistência no React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 4 Inicializa o Firestore p salvar meus dados do login também
export const db = getFirestore(app);
