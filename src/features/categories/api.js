import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const categoriesRef = collection(db, 'categories');

export const getCategories = async () => {
  try {
    const q = query(categoriesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));


    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check your Firestore security rules.");
    }
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, categoryData);
};

export const deleteCategory = async (id) => {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
};
