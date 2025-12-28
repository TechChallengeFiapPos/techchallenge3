import { db } from '@config/firebaseConfig';
import { Card, CreateCardData, UpdateCardData } from '@src/domain/entities/Card';
import { getFirebaseErrorMessage } from '@src/utils/firebaseErrors';
import { metrics } from '@src/utils/metrics';
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


const getUserCardsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'cards');
};


export const createCard = async (userId: string, cardData: CreateCardData) => {
  try {
    metrics.logRequest('CardRepository.createCard', { userId });
    // Verifica se já existe
    const existsResult = await checkCardExists(userId, cardData.number);
    if (existsResult.exists) {
      return {
        success: false,
        error: 'Este cartão já está cadastrado',
      };
    }

    const data = {
      ...cardData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(getUserCardsCollection(userId), data);

    return {
      success: true,
      cardId: docRef.id,
      card: { ...data, id: docRef.id },
    };
  } catch (error: any) {
    console.error('Erro ao criar cartão:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar cartão',
    };
  }
};

// Busca todos os cartões do usuário
export const getUserCards = async (userId: string) => {
  metrics.logRequest('CardRepository.getUserCards', { userId });
  try {
    const cardsCollection = getUserCardsCollection(userId);
    const q = query(cardsCollection, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const cards: Card[] = [];

    querySnapshot.forEach((doc) => {
      cards.push({
        id: doc.id,
        ...doc.data(),
      } as Card);
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

//Busca cartão por ID
export const getCardById = async (userId: string, cardId: string) => {
  try {
    const cardDoc = doc(db, 'users', userId, 'cards', cardId);
    const docSnap = await getDoc(cardDoc);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: 'Cartão não encontrado',
      };
    }

    const card: Card = {
      id: docSnap.id,
      ...docSnap.data(),
    } as Card;

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

//Deleta cartão
export const deleteCard = async (userId: string, cardId: string) => {
  try {
    const cardDoc = doc(db, 'users', userId, 'cards', cardId);

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


export const checkCardExists = async (
  userId: string,
  cardNumber: string,
  excludeCardId?: string
) => {
  try {
    const cardsCollection = getUserCardsCollection(userId);
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


export const getCardsByCategory = async (userId: string, category: string) => {
  try {
    const cardsCollection = getUserCardsCollection(userId);
    const q = query(
      cardsCollection,
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    const cards: Card[] = [];

    querySnapshot.forEach((doc) => {
      cards.push({
        id: doc.id,
        ...doc.data(),
      } as Card);
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

export const getCardsByFunction = async (userId: string, functionType: string) => {
  try {
    const cardsCollection = getUserCardsCollection(userId);
    const q = query(
      cardsCollection,
      where('functions', 'array-contains', functionType),
      orderBy('createdAt', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    const cards: Card[] = [];

    querySnapshot.forEach((doc) => {
      cards.push({
        id: doc.id,
        ...doc.data(),
      } as Card);
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

//Atualiza cartão
export const updateCard = async (userId: string, cardId: string, cardData: UpdateCardData) => {
  try {
    const cardDoc = doc(db, 'users', userId, 'cards', cardId);

    const docSnap = await getDoc(cardDoc);
    if (!docSnap.exists()) {
      return {
        success: false,
        error: 'Cartão não encontrado',
      };
    }

    if (cardData.number) {
      const existsResult = await checkCardExists(userId, cardData.number, cardId);
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