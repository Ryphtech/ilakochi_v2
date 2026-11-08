export interface RestaurantInfo {
  name: string;
  nameMalayalam: string;
  wordmark: string;
  subTitle: string;
  tagline: string;
  heroPitch: string;
  philosophy: string;
  leafSymbolism: string;
  address: {
    line1: string;
    line2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    full: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    whatsappUrl: string;
    email: string;
  };
  timings: {
    days: string;
    allDay: string;
    lunchWindow: string;
    dinnerWindow: string;
  };
  stats: {
    rating: string;
    reviewsCount: string;
    priceRange: string;
    cuisineType: string;
  };
  social: {
    instagram: string;
    facebook: string;
    googleMaps: string;
  };
}

export const restaurantData: RestaurantInfo = {
  name: "ILA KOCHI",
  nameMalayalam: "ഇല കൊച്ചി",
  wordmark: "ILA KOCHI KITCHEN",
  tagline: "ROOTED IN NATURE. INSPIRED BY THE COAST.",
  subTitle: "Traditional Kerala Seafood & Banana Leaf Dining",
  heroPitch: "Experience the authentic flavours of Kerala's coastline, where fresh seafood meets timeless culinary traditions.",
  philosophy: "In Malayalam, 'Ila' (ഇല) translates directly to 'Leaf' — the quintessential symbol of life, freshness, and the revered southern tradition of serving wholesome feasts upon living plantain leaves.",
  leafSymbolism: "For centuries across Kerala, the banana leaf has been more than dinnerware — it is an aromatic conduit connecting earth, sea, and soul. At Ila Kochi, this timeless green canvas inspires our culinary ethos: wild-caught ocean delicacies prepared with freshly grated coconut, Malabar spices, and unhurried coastal passion.",
  address: {
    line1: "Metro Pillar No. 350, Behind Unimoni",
    line2: "Pathadipalam, Edappally / Kalamassery",
    landmark: "Near Kerala History Museum & Pathadipalam Metro Station",
    city: "Kochi",
    state: "Kerala",
    pincode: "682024",
    full: "Metro Pillar No. 350, Behind Unimoni, Pathadipalam, Edappally, Kochi, Ernakulam, Kerala 682024",
  },
  contact: {
    phone: "+91 95262 67626",
    phoneRaw: "+919526267626",
    whatsapp: "+919526267626",
    whatsappUrl: "https://wa.me/919526267626?text=Hello%20ILA%20KOCHI%20Restaurant,%20I%20would%20like%20to%20inquire%20about%20a%20table%20reservation.",
    email: "contact@ilakochi.com",
  },
  timings: {
    days: "Monday through Sunday (Open Daily)",
    allDay: "11:30 AM – 11:00 PM",
    lunchWindow: "12:00 PM – 4:00 PM (Authentic Banana Leaf Meals)",
    dinnerWindow: "6:30 PM – 11:00 PM (Live Catch Tawa Fries & Coastal Roasts)",
  },
  stats: {
    rating: "4.0",
    reviewsCount: "700+",
    priceRange: "₹200 – ₹400 per person",
    cuisineType: "Authentic Kerala Coastal Seafood & Banana Leaf Meals",
  },
  social: {
    instagram: "https://www.instagram.com/explore/tags/ilakochi/",
    facebook: "https://www.facebook.com/search/top?q=ila%20kochi",
    googleMaps: "https://www.google.com/maps/dir//Ila+kochi+restaurant,+Metro+piller+350,+behind+unimoni,+Pathadipalam,+Edappally,+Kochi,+Ernakulam,+Keralam+682024/@8.8901341,76.6066105,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b080d90ecea7d77:0x792586086d39bcff!2m2!1d76.3142699!2d10.0375751",
  },
};

