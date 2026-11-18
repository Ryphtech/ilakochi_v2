import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SectionHeadingItem {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlight?: string;
}

export interface SiteSectionsHeadings {
  hero: SectionHeadingItem;
  brandIntro: SectionHeadingItem;
  signatureDishes: SectionHeadingItem;
  howItWorks: SectionHeadingItem;
  ourStory: SectionHeadingItem;
  keralaCulture: SectionHeadingItem;
  reviews: SectionHeadingItem;
  menu: SectionHeadingItem;
  diningExperience: SectionHeadingItem;
  gallery: SectionHeadingItem;
  faq: SectionHeadingItem;
  location: SectionHeadingItem;
  reservation: SectionHeadingItem;
  footer: SectionHeadingItem;
}

export type HeadingsLanguageMode = 'en' | 'ml' | 'bilingual' | 'custom';

export interface SiteHeadingsConfig {
  languageMode: HeadingsLanguageMode;
  sections: SiteSectionsHeadings;
  updatedAt?: unknown;
}

// 1. DEFAULT ENGLISH HEADINGS
export const DEFAULT_HEADINGS_EN: SiteSectionsHeadings = {
  hero: {
    eyebrow: 'AUTHENTIC KERALA SEAFOOD · ഇല കൊച്ചി',
    title: 'Fresh Catch from the Harbour.',
    subtitle: 'Served on Living Banana Leaf.',
  },
  brandIntro: {
    eyebrow: 'The Culinary Soul of Kochi',
    title: 'More than a meal.',
    highlight: 'A living taste of Kerala.',
    subtitle: 'For generations, dining in Kerala has been bound to the land and the sea.',
  },
  signatureDishes: {
    eyebrow: 'Harbour to Hearth',
    title: 'The essence of the coast.',
    subtitle: 'Six signature preparations that define what we do best.',
  },
  howItWorks: {
    eyebrow: 'The Ila Kochi Ritual',
    title: 'From Ocean Tides to Banana Leaf',
    subtitle: 'Every plate honours the timeless coastline traditions of Malabar.',
  },
  ourStory: {
    eyebrow: 'Our Heritage & Craft',
    title: 'Why We Serve on "ILA"',
    subtitle: 'The banana leaf is not a novelty plate. It is a philosophy of pure, living nourishment.',
  },
  keralaCulture: {
    eyebrow: 'Living Traditions',
    title: 'The Sacred Art of Banana Leaf Dining',
    subtitle: 'An ancient ritual that awakens all five senses.',
  },
  reviews: {
    eyebrow: 'Guest Experiences',
    title: 'Loved by Seafood Connoisseurs',
    subtitle: 'True words from travelers, local foodies, and families dining on living leaves.',
  },
  menu: {
    eyebrow: 'Coastal Culinary Repertoire',
    title: 'Explore Our Menu',
    subtitle: 'Traditional backwater delicacies, fiery tawa fries, and slow-simmered earthen curries.',
  },
  diningExperience: {
    eyebrow: 'Atmosphere & Senses',
    title: 'A Feast for All Five Senses',
    subtitle: 'From sizzling cast iron to fragrant banana leaves, experience dining the way Kerala intended.',
  },
  gallery: {
    eyebrow: 'Visual Journey',
    title: 'Glimpses of Ila Kochi',
    subtitle: 'Moments, flavors, and memories crafted daily on Pathadipalam.',
  },
  faq: {
    eyebrow: 'Helpful Information',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our dining ritual, fresh catch, and reservations.',
  },
  location: {
    eyebrow: 'Find Our Kitchen',
    title: 'Visit Us at Pathadipalam',
    subtitle: 'Easy to reach, right off the highway with dedicated parking.',
  },
  reservation: {
    eyebrow: 'Direct Table Booking',
    title: 'Reserve Your Banana Leaf Experience',
    subtitle: 'Skip the queue. Book your fresh catch meal in advance.',
  },
  footer: {
    title: 'Rooted in Nature. Inspired by the Coast.',
    subtitle: "Kochi's premier banana leaf seafood destination.",
  },
};

// 2. DEFAULT AUTHENTIC MALAYALAM HEADINGS
export const DEFAULT_HEADINGS_ML: SiteSectionsHeadings = {
  hero: {
    eyebrow: 'തനത് കേരള സീഫുഡ് · ഇല കൊച്ചി',
    title: 'തീരത്തുനിന്ന് നേരിട്ടെത്തുന്ന പുത്തൻ മീൻവിഭവങ്ങൾ.',
    subtitle: 'പച്ച വാഴയിലയിൽ വിളമ്പുന്ന നാടൻ സ്വാദ്.',
  },
  brandIntro: {
    eyebrow: 'കൊച്ചിയുടെ തനത് രുചിക്കൂട്ട്',
    title: 'വെറുമൊരു ഭക്ഷണമല്ല ഇത്.',
    highlight: 'കേരളത്തിന്റെ ജീവസ്സുറ്റ രുചിപ്പെരുമ.',
    subtitle: 'തലമുറകളായി കൈമാറിവന്ന തീരദേശ പാചക പാരമ്പര്യം.',
  },
  signatureDishes: {
    eyebrow: 'തുറമുഖത്തുനിന്ന് അടുക്കളയിലേക്ക്',
    title: 'തീരദേശത്തിന്റെ മാന്ത്രിക രുചികൾ',
    subtitle: 'ഞങ്ങളുടെ ആറ് വിഖ്യാത നാടൻ സീഫുഡ് വിഭവങ്ങൾ.',
  },
  howItWorks: {
    eyebrow: 'ഇല കൊച്ചി പാരമ്പര്യം',
    title: 'കടൽത്തിരകളിൽ നിന്ന് വാഴയിലയിലേക്ക്',
    subtitle: 'മലബാർ തീരത്തിന്റെ കാലാതീതമായ തനത് പാചക സംസ്കാരം.',
  },
  ourStory: {
    eyebrow: 'ഞങ്ങളുടെ പാരമ്പര്യവും സംസ്കാരവും',
    title: 'എന്തുകൊണ്ട് ഞങ്ങൾ ഇലയിൽ വിളമ്പുന്നു?',
    subtitle: 'വാഴയില കേവലം ഒരു തട്ടമല്ല, പ്രകൃതിദത്തമായ പോഷണത്തിന്റെ ജീവസ്സുറ്റ ദർശനമാണ്.',
  },
  keralaCulture: {
    eyebrow: 'ജീവസ്സുറ്റ പാരമ്പര്യം',
    title: 'വാഴയിലയിലെ ഊണ് ഒരു പുണ്യാനുഭവം',
    subtitle: 'പഞ്ചേന്ദ്രിയങ്ങളെ ഉണർത്തുന്ന പവിത്രമായ പാരമ്പര്യം.',
  },
  reviews: {
    eyebrow: 'അതിഥികളുടെ അനുഭവങ്ങൾ',
    title: 'സീഫുഡ് പ്രേമികളുടെ പ്രിയപ്പെട്ട ഇടം',
    subtitle: 'യാത്രക്കാരും നാടൻ ഭക്ഷണപ്രേമികളും പങ്കുവെച്ച ഹൃദ്യമായ വാക്കുകൾ.',
  },
  menu: {
    eyebrow: 'തീരദേശ രുചി വൈവിധ്യം',
    title: 'ഞങ്ങളുടെ വിഭവങ്ങൾ',
    subtitle: 'നാടൻ കായൽ വിഭവങ്ങൾ, തീപ്പൊരി തവ ഫ്രൈകൾ, മൺചട്ടി കറികൾ.',
  },
  diningExperience: {
    eyebrow: 'അന്തരീക്ഷവും പഞ്ചേന്ദ്രിയങ്ങളും',
    title: 'പഞ്ചേന്ദ്രിയങ്ങളെ ഉണർത്തുന്ന രുചിയനുഭവം',
    subtitle: 'ചൂടുള്ള ഇരുമ്പ് ചട്ടിയും സുഗന്ധമുള്ള വാഴയിലയും ചേരുന്ന അപൂർവ്വ അനുഭവം.',
  },
  gallery: {
    eyebrow: 'ചിത്രജാലകം',
    title: 'ഇല കൊച്ചിയുടെ സുന്ദരക്കാഴ്ചകൾ',
    subtitle: 'പാതാടിപ്പാലത്ത് ഒരുങ്ങുന്ന നിമിഷങ്ങളും രുചി ഓർമ്മകളും.',
  },
  faq: {
    eyebrow: 'സഹായകരമായ വിവരങ്ങൾ',
    title: 'സാധാരണയായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ',
    subtitle: 'ഞങ്ങളുടെ വിഭവങ്ങളെയും ബുക്കിംഗിനെയും കുറിച്ച് അറിയേണ്ടതെല്ലാം.',
  },
  location: {
    eyebrow: 'ഞങ്ങളുടെ വിലാസം',
    title: 'പാതാടിപ്പാലത്ത് ഞങ്ങളെ സന്ദർശിക്കൂ',
    subtitle: 'ഹൈവേയോട് ചേർന്ന്, വിശാലമായ പാർക്കിംഗ് സൗകര്യത്തോടെ.',
  },
  reservation: {
    eyebrow: 'മേശ മുൻകൂട്ടി ബുക്ക് ചെയ്യാം',
    title: 'വാഴയില സദ്യ മുൻകൂട്ടി ബുക്ക് ചെയ്യൂ',
    subtitle: 'തിരക്കില്ലാതെ സ്വാദൂറും വിഭവങ്ങൾ ആസ്വദിക്കാൻ ഇപ്പോൾ തന്നെ ബുക്ക് ചെയ്യാം.',
  },
  footer: {
    title: 'പ്രകൃതിയിൽ വേരൂന്നി, തീരദേശത്താൽ പ്രചോദിതമായി.',
    subtitle: 'കൊച്ചിയുടെ പ്രഥമ വാഴയില സീഫുഡ് സങ്കേതം.',
  },
};

// 3. DEFAULT BILINGUAL HEADINGS
export const DEFAULT_HEADINGS_BILINGUAL: SiteSectionsHeadings = {
  hero: {
    eyebrow: 'AUTHENTIC KERALA SEAFOOD · തനത് രുചി · ഇല കൊച്ചി',
    title: 'Fresh Catch from the Harbour · പുത്തൻ മീൻവിഭവങ്ങൾ',
    subtitle: 'Served on Living Banana Leaf · പച്ച വാഴയിലയിൽ',
  },
  brandIntro: {
    eyebrow: 'The Culinary Soul of Kochi · കൊച്ചിയുടെ തനത് രുചി',
    title: 'More than a meal · വെറുമൊരു ഭക്ഷണമല്ല',
    highlight: 'A living taste of Kerala · ജീവസ്സുറ്റ രുചിപ്പെരുമ',
    subtitle: 'Bound to the land & the sea · തീരദേശ പാരമ്പര്യം',
  },
  signatureDishes: {
    eyebrow: 'Harbour to Hearth · തുറമുഖത്തുനിന്ന് അടുക്കളയിലേക്ക്',
    title: 'The Essence of the Coast · തീരദേശ രുചികൾ',
    subtitle: 'Six signature preparations · ഞങ്ങളുടെ വിഖ്യാത വിഭവങ്ങൾ',
  },
  howItWorks: {
    eyebrow: 'The Ila Kochi Ritual · ഇല കൊച്ചി പാരമ്പര്യം',
    title: 'From Ocean Tides to Banana Leaf · വാഴയിലയിലേക്ക്',
    subtitle: 'Timeless coastline traditions · നാടൻ പാചക സംസ്കാരം',
  },
  ourStory: {
    eyebrow: 'Our Heritage & Craft · പാരമ്പര്യവും സംസ്കാരവും',
    title: 'Why We Serve on "ILA" · എന്തുകൊണ്ട് ഇലയിൽ?',
    subtitle: 'A philosophy of pure living nourishment · പ്രകൃതിദത്ത പോഷണം',
  },
  keralaCulture: {
    eyebrow: 'Living Traditions · ജീവസ്സുറ്റ പാരമ്പര്യം',
    title: 'The Sacred Art of Banana Leaf Dining · വാഴയിലയിലെ ഊണ്',
    subtitle: 'Awakening all five senses · പഞ്ചേന്ദ്രിയ ഉണർവ്വ്',
  },
  reviews: {
    eyebrow: 'Guest Experiences · അതിഥികളുടെ അനുഭവങ്ങൾ',
    title: 'Loved by Seafood Connoisseurs · പ്രിയപ്പെട്ട ഇടം',
    subtitle: 'True words from seafood lovers · സന്ദർശകരുടെ വാക്കുകൾ',
  },
  menu: {
    eyebrow: 'Coastal Culinary Repertoire · തീരദേശ രുചി വൈവിധ്യം',
    title: 'Explore Our Menu · ഞങ്ങളുടെ വിഭവങ്ങൾ',
    subtitle: 'Backwater delicacies, tawa fries & clay pot curries · തനത് വിഭവങ്ങൾ',
  },
  diningExperience: {
    eyebrow: 'Atmosphere & Senses · അന്തരീക്ഷവും പഞ്ചേന്ദ്രിയങ്ങളും',
    title: 'A Feast for All Five Senses · പഞ്ചേന്ദ്രിയ രുചിയനുഭവം',
    subtitle: 'From sizzling iron to fragrant banana leaves · സമ്പൂർണ്ണ അനുഭവം',
  },
  gallery: {
    eyebrow: 'Visual Journey · ചിത്രജാലകം',
    title: 'Glimpses of Ila Kochi · ഇല കൊച്ചിയുടെ കാഴ്ചകൾ',
    subtitle: 'Moments crafted daily on Pathadipalam · മനോഹര നിമിഷങ്ങൾ',
  },
  faq: {
    eyebrow: 'Helpful Information · സഹായകരമായ വിവരങ്ങൾ',
    title: 'Frequently Asked Questions · പതിവ് ചോദ്യങ്ങൾ',
    subtitle: 'Everything about our dining ritual · അറിയേണ്ടതെല്ലാം',
  },
  location: {
    eyebrow: 'Find Our Kitchen · ഞങ്ങളുടെ വിലാസം',
    title: 'Visit Us at Pathadipalam · പാതാടിപ്പാലത്ത്',
    subtitle: 'Highway access with dedicated parking · സൗകര്യപ്രദമായ പാർക്കിംഗ്',
  },
  reservation: {
    eyebrow: 'Direct Table Booking · മേശ ബുക്ക് ചെയ്യാം',
    title: 'Reserve Your Banana Leaf Experience · സീറ്റ് ഉറപ്പാക്കൂ',
    subtitle: 'Skip the queue, reserve your fresh catch meal · മുൻകൂട്ടി ബുക്ക് ചെയ്യൂ',
  },
  footer: {
    title: 'Rooted in Nature. Inspired by the Coast · പ്രകൃതിയിൽ വേരൂന്നി',
    subtitle: "Kochi's premier banana leaf seafood destination · വാഴയില സീഫുഡ് സങ്കേതം",
  },
};

const STORAGE_KEY = 'ila_site_headings';

export const defaultHeadingsConfig: SiteHeadingsConfig = {
  languageMode: 'en',
  sections: DEFAULT_HEADINGS_EN,
};

/**
 * Read cached site headings from localStorage
 */
export const getCachedHeadings = (): SiteHeadingsConfig => {
  if (typeof window === 'undefined') return defaultHeadingsConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.sections) {
        return parsed as SiteHeadingsConfig;
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached headings:', err);
  }
  return defaultHeadingsConfig;
};

/**
 * Cache headings in localStorage
 */
export const setCachedHeadings = (config: SiteHeadingsConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to cache headings:', err);
  }
};

/**
 * Save headings configuration to Firestore and local cache
 */
export const saveHeadingsConfig = async (config: SiteHeadingsConfig): Promise<void> => {
  // 1. Immediately update localStorage
  setCachedHeadings(config);

  // 2. Broadcast storage event so other tabs sync immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('ila_headings_updated'));
  }

  // 3. Sync to Firestore site_settings/headings
  try {
    const headingsDocRef = doc(db, 'site_settings', 'headings');
    await setDoc(headingsDocRef, {
      languageMode: config.languageMode,
      sections: config.sections,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to sync headings to Firestore:', err);
    throw err;
  }
};

/**
 * Subscribe to real-time changes to site headings from Firestore
 */
export const subscribeHeadingsConfig = (
  callback: (config: SiteHeadingsConfig) => void
): (() => void) => {
  // Fire immediately with cached or default
  callback(getCachedHeadings());

  try {
    const docRef = doc(db, 'site_settings', 'headings');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.sections) {
            const liveConfig: SiteHeadingsConfig = {
              languageMode: data.languageMode || 'en',
              sections: {
                ...DEFAULT_HEADINGS_EN,
                ...data.sections,
              },
              updatedAt: data.updatedAt,
            };
            setCachedHeadings(liveConfig);
            callback(liveConfig);
          }
        }
      },
      (err) => {
        console.warn('Error subscribing to site headings from Firestore, using cached/default:', err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore subscription unavailable for headings:', err);
    return () => {};
  }
};

/**
 * React hook for consuming site headings in any component.
 * Automatically stays in sync with Firestore and Admin portal changes.
 */
export const useHeadings = () => {
  const [headingsConfig, setHeadingsConfig] = useState<SiteHeadingsConfig>(() => getCachedHeadings());

  useEffect(() => {
    // 1. Subscribe to Firestore live sync
    const unsubscribe = subscribeHeadingsConfig((live) => {
      setHeadingsConfig(live);
    });

    // 2. Listen for local storage/broadcast updates
    const handleLocalUpdate = () => {
      setHeadingsConfig(getCachedHeadings());
    };
    window.addEventListener('ila_headings_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('ila_headings_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, []);

  return {
    config: headingsConfig,
    headings: headingsConfig.sections,
    languageMode: headingsConfig.languageMode,
  };
};
