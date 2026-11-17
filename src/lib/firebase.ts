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

// ==========================================
// 4. HERO SECTION SETTINGS (Images vs Video)
// ==========================================

export interface HeroImageConfig {
  url: string;
  alt: string;
  caption: string;
}

export interface HeroConfig {
  mode: 'images' | 'video';
  videoUrl: string;
  videoPoster?: string;
  images: HeroImageConfig[];
  intervalMs?: number;
  updatedAt?: unknown;
}

export const defaultHeroConfig: HeroConfig = {
  mode: 'images',
  videoUrl: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/ila-kochi-reel.mp4',
  videoPoster: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1600&q=80',
  intervalMs: 5000,
  images: [
    {
      url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1600&q=80',
      alt: 'Sizzling Kalanji tawa fish fry marinated in ground spices and coconut oil',
      caption: 'Signature Tawa Fry',
    },
    {
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
      alt: 'Traditional Kerala seafood meal served on fresh banana leaf',
      caption: 'Banana Leaf Feast',
    },
    {
      url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=80',
      alt: 'Fresh catch from local fishing harbour prepared daily',
      caption: 'Daily Harbour Catch',
    },
    {
      url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=80',
      alt: 'Kerala spiced tiger prawns roast with curry leaves',
      caption: 'Chemmeen Ghee Roast',
    },
  ],
};

const HERO_STORAGE_KEY = 'ila_hero_config';

/**
 * Read cached hero config from localStorage
 */
export const getStoredHeroConfig = (): HeroConfig => {
  if (typeof window === 'undefined') return defaultHeroConfig;
  try {
    const raw = localStorage.getItem(HERO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.images || parsed.videoUrl)) {
        return parsed as HeroConfig;
      }
    }
  } catch {}
  return defaultHeroConfig;
};

/**
 * Save or update Hero configuration in Firestore (site_settings / hero)
 * Always persists locally even if Firestore permissions are restricted
 */
export const saveHeroConfig = async (config: Partial<HeroConfig>) => {
  // 1. Persist locally first
  try {
    const current = getStoredHeroConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  // 2. Persist to Firestore
  try {
    const docRef = doc(db, 'site_settings', 'hero');
    await setDoc(
      docRef,
      {
        ...config,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, syncedToCloud: true };
  } catch (err: any) {
    console.warn('Firebase Firestore hero sync skipped (check Firestore Security Rules):', err?.message || err);
    return { success: true, syncedToCloud: false, error: err };
  }
};

/**
 * Real-time subscription to Hero configuration
 */
export const subscribeHeroConfig = (callback: (config: HeroConfig) => void) => {
  const docRef = doc(db, 'site_settings', 'hero');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<HeroConfig>;
        const resolved: HeroConfig = {
          mode: data.mode || 'images',
          videoUrl: data.videoUrl || defaultHeroConfig.videoUrl,
          videoPoster: data.videoPoster || defaultHeroConfig.videoPoster,
          images: data.images && data.images.length > 0 ? data.images : defaultHeroConfig.images,
          intervalMs: data.intervalMs || 5000,
        };
        try {
          localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(resolved));
        } catch {}
        callback(resolved);
      } else {
        callback(getStoredHeroConfig());
      }
    },
    (err) => {
      console.warn('Firestore hero sync paused (running on local hero cache):', err?.message || err);
      callback(getStoredHeroConfig());
    }
  );
};
