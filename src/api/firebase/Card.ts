import { auth, db } from '@config/firebaseConfig';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

export type CardData = {
  id?: string;
  userId: string;
  number: string;
  functions: string[];
  category: string;
  expiryDate: string;
  createdAt?: any;
  updatedAt?: any;
};

export type CreateCardData = {
  number: string;
  functions: string[];
  category: string;
  expiryDate: string;
};

export type UpdateCardData = Partial<CreateCardData>;

// user está autenticado?
const getCurrentUser = () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Usuário não autenticado');
  }
  return currentUser;
};

// todos os cartoes
const getUserCardsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'cards');
};

// novo cartão
export const createCard = async (cardData: CreateCardData) => {
  try {
    const currentUser = getCurrentUser();
    const cardsCollection = getUserCardsCollection(currentUser.uid);

    // cartão já existe?
    const existsResult = await checkCardExists(cardData.number);
    if (existsResult.exists) {
      return {
        success: false,
        error: 'Este cartão já está cadastrado',
      };
    }

    const cardWithMetadata: Omit<CardData, 'id'> = {
      ...cardData,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(cardsCollection, cardWithMetadata);

    return {
      success: true,
      cardId: docRef.id,
      card: { ...cardWithMetadata, id: docRef.id },
    };
  } catch (error: any) {
    console.error('Erro ao criar cartão:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar cartão',
    };
  }
};

export const getUserCards = async () => {
  try {
    const currentUser = getCurrentUser();
    const cardsCollection = getUserCardsCollection(currentUser.uid);
    const q = query(cardsCollection, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const cards: CardData[] = [];

    querySnapshot.forEach((doc) => {
      cards.push({
        id: doc.id,
        ...doc.data(),
      } as CardData);
    });

    return {
      success: true,
      cards,
    };
  } catch (error: any) {
    console.error('Erro ao buscar cartões:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar cartões',
    };
  }
};

// Buscar cartão por ID
export const getCardById = async (cardId: string) => {
  try {
    const currentUser = getCurrentUser();
    const cardDoc = doc(db, 'users', currentUser.uid, 'cards', cardId);
    const docSnap = await getDoc(cardDoc);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: 'Cartão não encontrado',
      };
    }

    const card: CardData = {
      id: docSnap.id,
      ...docSnap.data(),
    } as CardData;


    return {
      success: true,
      card,
    };
  } catch (error: any) {
    console.error('Erro ao buscar cartão:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar cartão',
    };
  }
};

export const deleteCard = async (cardId: string) => {
  try {
    const currentUser = getCurrentUser();
    const cardDoc = doc(db, 'users', currentUser.uid, 'cards', cardId);

    const docSnap = await getDoc(cardDoc);
    if (!docSnap.exists()) {
      return {
        success: false,
        error: 'Cartão não encontrado',
      };
    }

    await deleteDoc(cardDoc);

    return {
      success: true,
      message: 'Cartão deletado com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao deletar cartão:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar cartão',
    };
  }
};

// Verificar se cartão já existe
export const checkCardExists = async (cardNumber: string, excludeCardId?: string) => {
  try {
    const currentUser = getCurrentUser();
    const cardsCollection = getUserCardsCollection(currentUser.uid);
    const cleanNumber = cardNumber.replace(/\s/g, '');

    const q = query(cardsCollection, where('number', '==', cleanNumber));
    const querySnapshot = await getDocs(q);

    if (excludeCardId && !querySnapshot.empty) {
      const existingCards = querySnapshot.docs.filter((doc) => doc.id !== excludeCardId);
      return {
        success: true,
        exists: existingCards.length > 0,
      };
    }

    return {
      success: true,
      exists: !querySnapshot.empty,
    };
  } catch (error: any) {
    console.error('Erro ao verificar cartão:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error),
      exists: false,
    };
  }
};

// Buscar cartões por categoria
export const getCardsByCategory = async (category: string) => {
  try {
    const currentUser = getCurrentUser();
    const cardsCollection = getUserCardsCollection(currentUser.uid);
    const q = query(
      cardsCollection,
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    const cards: CardData[] = [];

    querySnapshot.forEach((doc) => {
      cards.push({
        id: doc.id,
        ...doc.data(),
      } as CardData);
    });

    return {
      success: true,
      cards,
    };
  } catch (error: any) {
    console.error('Erro ao buscar cartões por categoria:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar cartões por categoria',
    };
  }
};

// Buscar cartões por função
export const getCardsByFunction = async (functionType: string) => {
  try {
    const currentUser = getCurrentUser();
    const cardsCollection = getUserCardsCollection(currentUser.uid);
    const q = query(
      cardsCollection,
      where('function', 'array-contains', functionType),
      orderBy('createdAt', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    const cards: CardData[] = [];

    querySnapshot.forEach((doc) => {
      cards.push({
        id: doc.id,
        ...doc.data(),
      } as CardData);
    });

    return {
      success: true,
      cards,
    };
  } catch (error: any) {
    console.error('Erro ao buscar cartões por função:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar cartões por função',
    };
  }
};

//editar cartao
export const updateCard = async (cardId: string, cardData: UpdateCardData) => {
  try {
    const currentUser = getCurrentUser();
    const cardDoc = doc(db, 'users', currentUser.uid, 'cards', cardId);

    const docSnap = await getDoc(cardDoc);
    if (!docSnap.exists()) {
      return {
        success: false,
        error: 'Cartão não encontrado',
      };
    }

    // Se estiver atualizando o número, verifica núemro existente SEM MASCARA
    if (cardData.number) {
      const existsResult = await checkCardExists(cardData.number, cardId);
      if (existsResult.exists) {
        return {
          success: false,
          error: 'Este número de cartão já está cadastrado',
        };
      }
    }

    const updateData = {
      ...cardData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(cardDoc, updateData);

    return {
      success: true,
      message: 'Cartão atualizado com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao atualizar cartão:', error);
    return {
      success: false,
      error: getFirebaseErrorMessage(error),
    };
  }
};
