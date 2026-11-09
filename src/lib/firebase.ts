import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

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

// Safe Analytics initialization (only in browser environments where supported)
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
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  notes?: string;
  source?: string;
}

/**
 * Save table reservation inquiry directly to Firestore 'reservations' collection
 */
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
