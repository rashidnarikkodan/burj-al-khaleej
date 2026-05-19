import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const getLocations = async (region = null) => {
  try {
    const locationsRef = collection(db, 'locations');
    let q = locationsRef;
    
    if (region) {
      q = query(locationsRef, where('region', '==', region));
    }
    
    const querySnapshot = await getDocs(q);
    const locations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const addLocation = async (locationData) => {
  try {
    const locationsRef = collection(db, 'locations');
    return await addDoc(locationsRef, locationData);
  } catch (error) {
    console.error("Error adding location:", error);
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check your Firestore security rules.");
    }
    throw error;
  }
};

export const updateLocation = async (id, locationData) => {
  const locationDoc = doc(db, 'locations', id);
  return await updateDoc(locationDoc, locationData);
};

export const deleteLocation = async (id) => {
  const locationDoc = doc(db, 'locations', id);
  return await deleteDoc(locationDoc);
};
