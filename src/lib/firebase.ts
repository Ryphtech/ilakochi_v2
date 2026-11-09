import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { MenuItem, menuItems as defaultMenuItems } from '../data/menuData';

// Firebase configuration from environment or fallback to user credentials
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC2Espum03ek_RdmEvFZzcqQpZ_QA7L7zc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ilakochi-809fb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ilakochi-809fb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ilakochi-809fb.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "990188964506",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:990188964506:web:c39a45c7456c6178286d23",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BZBM8HKH38"
};

// Initialize or reuse existing Firebase app singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db: Firestore = getFirestore(app);

// Safe Analytics initialization
let analyticsInstance: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported error in non-browser/restricted contexts
  });
}

/**
 * Log analytics event safely
 */
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, params);
    } catch {
      // Graceful fallback
    }
  }
};

export interface ReservationData {
  id?: string;
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  notes?: string;
  source?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: unknown;
}

export interface MediaUploadItem {
  id?: string;
  name: string;
  key: string;
  url: string;
  size: number;
  type: string;
  uploadedAt?: unknown;
}

// ==========================================
// 1. RESERVATIONS BACKEND
// ==========================================

export const saveReservationToFirestore = async (data: ReservationData) => {
  try {
    const reservationsCol = collection(db, 'reservations');
    const docRef = await addDoc(reservationsCol, {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      restaurantId: 'ila-kochi-pathadipalam',
      restaurantPillar: 'Metro Pillar 350',
    });

    trackEvent('table_reservation_inquiry', {
      guests: data.guests,
      time: data.time,
      date: data.date,
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn('Firebase Firestore reservation save error (falling back to direct WhatsApp):', err);
    return { success: false, error: err };
  }
};

export const subscribeReservations = (callback: (reservations: ReservationData[]) => void) => {
  const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ReservationData[];
    callback(items);
  }, (err) => {
    console.error('Error listening to reservations:', err);
  });
};

export const updateReservationStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
) => {
  const docRef = doc(db, 'reservations', id);
  await updateDoc(docRef, { status });
};

export const deleteReservation = async (id: string) => {
  const docRef = doc(db, 'reservations', id);
  await deleteDoc(docRef);
};

// ==========================================
// 2. FOOD ITEMS (MENU) BACKEND
// ==========================================

export const subscribeMenuItems = (callback: (items: MenuItem[]) => void) => {
  const colRef = collection(db, 'menu_items');
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      // If Firestore collection is empty, yield default menu
      callback(defaultMenuItems);
      return;
    }
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as MenuItem[];
    callback(items);
  }, (err) => {
    console.warn('Error listening to menu_items from Firestore, using defaults:', err);
    callback(defaultMenuItems);
  });
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'> & { id?: string }) => {
  const customId = item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const docRef = doc(db, 'menu_items', customId);
  await setDoc(docRef, {
    ...item,
    id: customId,
    updatedAt: serverTimestamp(),
  });
  return customId;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  const docRef = doc(db, 'menu_items', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteMenuItem = async (id: string) => {
  const docRef = doc(db, 'menu_items', id);
  await deleteDoc(docRef);
};

/**
 * Seed or reset Firestore with default curated Ila Kochi dishes
 */
export const seedDefaultMenu = async () => {
  for (const item of defaultMenuItems) {
    const docRef = doc(db, 'menu_items', item.id);
    await setDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
    });
  }
};

// ==========================================
// 3. MEDIA UPLOADS META (R2 SYNC)
// ==========================================

export const saveMediaUploadMeta = async (item: MediaUploadItem) => {
  const colRef = collection(db, 'media_uploads');
  await addDoc(colRef, {
    ...item,
    uploadedAt: serverTimestamp(),
  });
};

export const subscribeMediaUploads = (callback: (items: MediaUploadItem[]) => void) => {
  const q = query(collection(db, 'media_uploads'), orderBy('uploadedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as MediaUploadItem[];
    callback(items);
  }, (err) => {
    console.warn('Error subscribing to media_uploads:', err);
  });
};

export const deleteMediaUploadMeta = async (id: string) => {
  const docRef = doc(db, 'media_uploads', id);
  await deleteDoc(docRef);
};
