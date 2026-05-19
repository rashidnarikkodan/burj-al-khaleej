import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const productsRef = collection(db, 'products');

export const getProducts = async (categoryId = null) => {
  try {
    let q = query(productsRef, orderBy('createdAt', 'desc'));
    
    if (categoryId) {
      q = query(productsRef, where('categoryId', '==', categoryId), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));


    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check your Firestore security rules.");
    }
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, productData);
};

export const deleteProduct = async (id) => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

export const toggleAvailability = async (id, currentStatus) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, { isAvailable: !currentStatus });
};
