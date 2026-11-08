export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  category: 'seafood' | 'ambience' | 'heritage' | 'kitchen';
  image: string;
  span: 'col-span-1' | 'col-span-2' | 'row-span-2';
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Feast on the Living Leaf',
    caption: 'Traditional Kerala seafood meal served on fresh plantain leaf with steaming Matta rice and earthen fish curry.',
    category: 'heritage',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-2',
  },
  {
    id: 'gal-2',
    title: 'Live Cast Iron Tawa Sear',
    caption: 'Kalanji and Hamur fish steaks sizzled with curry leaves and pure cold-pressed coconut oil.',
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1',
  },
  {
    id: 'gal-3',
    title: 'Karimeen in Banana Leaf Wrap',
    caption: 'Backwater pearl spot wrapped in smoky charred banana leaf with caramelized shallot masala.',
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1',
  },
  {
    id: 'gal-4',
    title: 'Coastal Ambience & Warm Glow',
    caption: 'Botanical interiors inspired by the lush backwaters and tropical coast of Kochi.',
    category: 'ambience',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-2',
  },
  {
    id: 'gal-5',
    title: 'Clay Chatti Curries',
    caption: 'Slow-simmered fish curries bubbling with kudampuli and fresh coconut milk in native clay pots.',
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1',
  },
  {
    id: 'gal-6',
    title: 'Flaky Porotta Craftsmanship',
    caption: 'Layered Malabar porottas beaten fresh on marble tables, served hot with rich slow-cooked roast.',
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1',
  },
  {
    id: 'gal-7',
    title: 'Ocean Fresh Prawns',
    caption: 'Golden tiger prawns glazed in roasted Tellicherry pepper and fragrant farm ghee.',
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1',
  },
  {
    id: 'gal-8',
    title: 'The Art of Shaken Refreshment',
    caption: 'Kochi Kulukki Sarbath prepared with freshly squeezed limes, basil seeds, and crisp green chili.',
    category: 'ambience',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1',
  },
];

