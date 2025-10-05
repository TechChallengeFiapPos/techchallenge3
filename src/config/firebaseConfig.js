// src/config/firebaseConfig.js - Versão final que funciona

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ADICIONE esta linha

const firebaseConfig = {
  apiKey: 'AIzaSyAzGt2jTmXZnJ5OFx3nOFZ0gxR3F1k6nm4',
  authDomain: 'bytebank-tc3.firebaseapp.com',
  projectId: 'bytebank-tc3',
  storageBucket: 'bytebank-tc3.firebasestorage.app',
  messagingSenderId: '272268877645',
  appId: '1:272268877645:web:1463e5bf85c8843bb3a104',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;