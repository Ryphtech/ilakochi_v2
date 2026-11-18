import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2Espum03ek_RdmEvFZzcqQpZ_QA7L7zc",
  authDomain: "ilakochi-809fb.firebaseapp.com",
  projectId: "ilakochi-809fb",
  storageBucket: "ilakochi-809fb.firebasestorage.app",
  messagingSenderId: "990188964506",
  appId: "1:990188964506:web:c39a45c7456c6178286d23",
  measurementId: "G-BZBM8HKH38"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const menuItems = [
  {
    id: 'karimeen-pollichathu',
    name: 'Pearl Spot Pollichathu',
    nameMl: 'കരിമീൻ പൊള്ളിച്ചത്',
    category: 'signature',
    price: 360,
    priceNote: 'as per catch size',
    description: 'Fresh backwater Pearl Spot slow-marinated in roasted shallots, ginger, garlic, and hand-pounded spices, wrapped in tender plantain leaf and seared on a cast-iron tawa.',
    dietary: 'seafood',
    spiceLevel: 3,
    isChefSpecial: true,
    isSignature: true,
    available: true,
    serves: '1-2 persons',
    preparationTime: '25 mins',
    tags: ['Best Seller', 'Signature', 'Banana Leaf Cooked', 'Tawa Fry'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Wrapped in scorched plantain leaf & slow-pan roasted on seasoned cast iron tawa',
    allergens: ['Fish'],
  },
  {
    id: 'kalanji-tawa-fry',
    name: 'Kalanji Tawa Fry',
    nameMl: 'കാളാഞ്ചി തവ ഫ്രൈ',
    category: 'signature',
    price: 380,
    priceNote: 'seasonal fresh catch',
    description: 'Thick succulent darnes of Kochi Sea Bass (Kalanji) coated with fiery crushed Kashmiri chilli, Malabar pepper, and garlic paste, pan-seared in wood-pressed coconut oil.',
    dietary: 'seafood',
    spiceLevel: 3,
    isChefSpecial: true,
    isSignature: true,
    available: true,
    serves: '1-2 persons',
    preparationTime: '20 mins',
    tags: ['Catch of the Day', 'Crisp Crust', 'Pure Coconut Oil'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Hot griddle tawa fry in shallow cold-pressed coconut oil',
    allergens: ['Fish'],
  },
  {
    id: 'chemmeen-ghee-roast',
    name: 'Chemmeen Ghee Roast',
    nameMl: 'ചെമ്മീൻ നെയ്യ് റോസ്റ്റ്',
    category: 'prawns',
    price: 340,
    description: 'Plump ocean tiger prawns tossed in rich golden spiced buffalo ghee, crushed Byadgi chillies, shallots, and fresh curry leaves. Intensely fragrant and deeply savoury.',
    dietary: 'seafood',
    spiceLevel: 2,
    isChefSpecial: true,
    isSignature: false,
    available: true,
    serves: '2 persons',
    preparationTime: '18 mins',
    tags: ['Desi Ghee', 'Prawns', 'Kochi Special'],
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Slow pan-braised in clarified spiced butter till caramelized',
    allergens: ['Shellfish', 'Dairy'],
  },
  {
    id: 'koonthal-roast',
    name: 'Koonthal Pepper Roast',
    nameMl: 'കൂന്തൽ പെപ്പർ റോസ്റ്റ്',
    category: 'squid',
    price: 290,
    description: 'Tender squid rings tossed with crushed Tellicherry black peppercorns, caramelized shallots, coconut slivers, and green chillies in a dark savory reduction.',
    dietary: 'seafood',
    spiceLevel: 3,
    isChefSpecial: false,
    isSignature: false,
    available: true,
    serves: '2 persons',
    preparationTime: '15 mins',
    tags: ['Squid', 'Tellicherry Pepper', 'Local Favourite'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Quick-tossed in heavy iron skillet to keep calamari tender',
    allergens: ['Molluscs'],
  },
  {
    id: 'ayala-curry',
    name: 'Clay Pot Ayala Curry',
    nameMl: 'അയല മീൻ ചട്ടി കറി',
    category: 'curries',
    price: 190,
    description: 'Fresh Indian mackerel simmered in an unglazed clay chatti with dried kudampuli (Malabar tamarind), crushed ginger, fenugreek, and fiery red ground chilli gravy.',
    dietary: 'seafood',
    spiceLevel: 3,
    isChefSpecial: false,
    isSignature: false,
    available: true,
    serves: '2-3 persons',
    preparationTime: '15 mins',
    tags: ['Clay Pot', 'Kudampuli', 'Tangy & Fiery'],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Slow-simmered inside unglazed earthenware chatti on low wood ember flame',
    allergens: ['Fish'],
  },
  {
    id: 'natholi-crisp-fry',
    name: 'Crispy Natholi Fry',
    nameMl: 'നത്തോലി പൊരിച്ചത്',
    category: 'starters',
    price: 180,
    description: 'Petite anchovies tossed with rice flour, roasted chili, turmeric, and lime juice, crisp-fried till crunchy and served with spicy onion-curry leaf tangle.',
    dietary: 'seafood',
    spiceLevel: 2,
    isChefSpecial: false,
    isSignature: false,
    available: true,
    serves: '2 persons',
    preparationTime: '12 mins',
    tags: ['Crunchy Starter', 'Snack', 'Anchovies'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Flash-fried in hot coconut oil',
    allergens: ['Fish'],
  },
  {
    id: 'kerala-seafood-meals',
    name: 'Special Coastal Leaf Meals',
    nameMl: 'സ്പെഷ്യൽ ഇല ഊണ്',
    category: 'meals',
    price: 160,
    description: 'Wholesome Kerala feast on fresh-cut banana leaf: steaming Matta rice, aromatic clay-pot fish gravy, moru curry, thoran, avial, meen peera, pappadam, and pickle.',
    dietary: 'seafood',
    spiceLevel: 2,
    isChefSpecial: true,
    isSignature: true,
    available: true,
    serves: '1 person (Unlimited rice & accompaniments)',
    preparationTime: 'Immediate',
    tags: ['Plantain Leaf Feast', 'Unlimited', 'Lunch Favourite'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Traditional wood-hearth cooking served on living banana leaf',
    allergens: ['Fish', 'Dairy'],
  },
  {
    id: 'appam-stew-combo',
    name: 'Kochi Lace Appam (Set of 3)',
    nameMl: 'അപ്പം സെറ്റ്',
    category: 'breads',
    price: 60,
    description: 'Fermented rice and coconut hopper with soft spongy dome and crispy golden lace edges. Ideal companion for fish curries and ghee roasts.',
    dietary: 'veg',
    spiceLevel: 0,
    isChefSpecial: false,
    isSignature: false,
    available: true,
    serves: '1 person',
    preparationTime: '8 mins',
    tags: ['Traditional Breads', 'Gluten Friendly', 'Fermented Rice'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Cooked in cast-iron appachatti with tight brass lid',
    allergens: [],
  },
  {
    id: 'neymeen-curry',
    name: 'Neymeen Manga Curry',
    nameMl: 'നെയ്മീൻ മാങ്ങാ കറി',
    category: 'curries',
    price: 390,
    description: 'Prime Seer fish (Surmai) steaks simmered in fresh raw mango slices, coconut cream, green chillies, and ginger. Perfectly balanced tang and richness.',
    dietary: 'seafood',
    spiceLevel: 2,
    isChefSpecial: true,
    isSignature: true,
    available: true,
    serves: '2 persons',
    preparationTime: '20 mins',
    tags: ['Raw Mango', 'Coconut Milk', 'Seer Fish'],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Slow simmered with raw mango cuts in fresh coconut milk',
    allergens: ['Fish'],
  },
  {
    id: 'njandu-roast',
    name: 'Kochi Backwater Crab Roast',
    nameMl: 'ഞണ്ട് റോസ്റ്റ്',
    category: 'signature',
    price: 420,
    description: 'Hard-shell coastal mud crab cracked and cooked in a thick spicy reduction of shallots, garlic, crushed black pepper, and fennel seeds.',
    dietary: 'seafood',
    spiceLevel: 3,
    isChefSpecial: true,
    isSignature: true,
    available: true,
    serves: '1-2 persons',
    preparationTime: '25 mins',
    tags: ['Mud Crab', 'Cracked Shell', 'Coastal Luxury'],
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Braised in heavy copper skillet',
    allergens: ['Crustaceans'],
  },
  {
    id: 'elaneer-pudding',
    name: 'Tender Coconut Elaneer Pudding',
    nameMl: 'ഇളനീർ പുഡ്ഡിംഗ്',
    category: 'dessert',
    price: 110,
    description: 'Cooling, velvety dessert crafted from fresh tender coconut pulp, coconut water, condensed milk, and agar-agar. Light and melt-in-mouth finish.',
    dietary: 'veg',
    spiceLevel: 0,
    isChefSpecial: false,
    isSignature: false,
    available: true,
    serves: '1 person',
    preparationTime: 'Immediate',
    tags: ['Dessert', 'Tender Coconut', 'Melt-in-mouth'],
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Chilled set pudding made with pure tender coconut meat',
    allergens: ['Dairy'],
  },
  {
    id: 'kalanji-curry',
    name: 'Barramundi Thengapaal Curry',
    nameMl: 'കാളാഞ്ചി തേങ്ങാപ്പാൽ കറി',
    category: 'curries',
    price: 360,
    description: 'Kochi estuary barramundi simmered gently in second extract coconut milk, turmeric, green chili, and finished with thick first-pressed coconut cream.',
    dietary: 'seafood',
    spiceLevel: 1,
    isChefSpecial: false,
    isSignature: false,
    available: true,
    serves: '2 persons',
    preparationTime: '18 mins',
    tags: ['Mild & Aromatic', 'Fresh Coconut Milk'],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    cookingMethod: 'Simmered on gentle heat without boiling the coconut cream',
    allergens: ['Fish'],
  },
];

const heroConfig = {
  mode: 'images',
  intervalMs: 5000,
  videoUrl: 'https://pub-a15e46301b3045309b2a4a019cb939e9.r2.dev/ila-kochi-reel.mp4',
  videoPoster: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1600&q=80',
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

const themeConfig = {
  preset: 'black',
  name: 'Obsidian Black & Gold',
  colors: {
    bg: '#050505',
    surface: '#121212',
    border: '#262626',
    textMuted: '#A3A3A3',
    textSoft: '#E5E5E5',
    accent: '#C5A46D',
  },
};

const restaurantProfile = {
  name: 'ILA KOCHI (ഇല കൊച്ചി)',
  tagline: 'AUTHENTIC KERALA SEAFOOD · BANANA LEAF DINING',
  address: 'Metro Pillar No. 350, Behind Unimoni, Pathadipalam, Edappally, Kochi 682024',
  phone: '+91 95262 67626',
  email: 'contact@ilakochi.com',
  pillar: 'Metro Pillar 350',
  googleRating: 4.0,
  reviewCount: '700+',
  timings: 'Daily 11:30 AM – 11:00 PM',
};

async function seedAll() {
  console.log('Seeding all current data to Firestore (ilakochi-809fb)...');

  // 1. Menu Items
  for (const item of menuItems) {
    const itemRef = doc(db, 'menu_items', item.id);
    await setDoc(itemRef, { ...item, updatedAt: serverTimestamp() });
    console.log(`  ✓ Synced menu item: ${item.name}`);
    await sleep(400);
  }

  // 2. Hero Background Settings
  await sleep(600);
  console.log('Writing site_settings/hero...');
  await setDoc(doc(db, 'site_settings', 'hero'), { ...heroConfig, updatedAt: serverTimestamp() });
  console.log('  ✓ Synced site_settings/hero');

  // 3. Site Theme Settings
  await sleep(600);
  console.log('Writing site_settings/theme...');
  await setDoc(doc(db, 'site_settings', 'theme'), { ...themeConfig, updatedAt: serverTimestamp() });
  console.log('  ✓ Synced site_settings/theme');

  // 4. Restaurant Profile
  await sleep(600);
  console.log('Writing site_settings/restaurant...');
  await setDoc(doc(db, 'site_settings', 'restaurant'), { ...restaurantProfile, updatedAt: serverTimestamp() });
  console.log('  ✓ Synced site_settings/restaurant');

  // 5. Site Headings & Malayalam Settings
  await sleep(600);
  console.log('Writing site_settings/headings...');
  const initialHeadings = {
    languageMode: 'en',
    sections: {
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
    },
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'site_settings', 'headings'), initialHeadings);
  console.log('  ✓ Synced site_settings/headings');

  console.log('\n===============================================');
  console.log('SUCCESS: All current data written to Firestore!');
  console.log('===============================================');
  process.exit(0);
}

seedAll().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
