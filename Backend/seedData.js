import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: "Midnight Rose",
    description: "A sensual blend of rose and oud",
    longDescription: "Experience the captivating fusion of fresh Bulgarian roses with deep, mysterious oud wood. Midnight Rose opens with bright bergamot and soft lavender, leading to a heart of rich rose absolute and velvety jasmine. The base reveals warm amber, creamy sandalwood, and a hint of sensual musk that lingers for hours.",
    price: 89.99,
    originalPrice: 120.00,
    category: "Women",
    size: "100ml",
    stock: 25,
    images: [
      "/images/MidnightRose.png"
    ],
    isNewArrival: true,
    isPopular: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    name: "Noir Essence",
    description: "Dark, mysterious masculine scent",
    longDescription: "A sophisticated fragrance for the modern gentleman. Noir Essence combines fresh grapefruit and cardamom top notes with a heart of rich leather and smoky birch tar. The dry-down reveals vetiver, patchouli, and tonka bean for a lasting impression of power and elegance.",
    price: 94.99,
    originalPrice: 130.00,
    category: "Men",
    size: "100ml",
    stock: 18,
    images: [
      "/images/Versace.png"
    ],
    isNewArrival: true,
    isPopular: false,
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: "Ocean Breeze",
    description: "Fresh aquatic unisex fragrance",
    longDescription: "Capture the essence of a coastal morning with Ocean Breeze. This refreshing scent opens with marine notes and sea salt, followed by a heart of white flowers and ozone. The base features driftwood, ambergris, and clean musk for a crisp, invigorating finish that works beautifully for any gender.",
    price: 74.99,
    originalPrice: 95.00,
    category: "Unisex",
    size: "100ml",
    stock: 32,
    images: [
      "/images/OceanBreeze.png"
    ],
    isNewArrival: false,
    isPopular: true,
    rating: 4.7,
    reviewCount: 156
  },
  {
    name: "Velvet Bloom",
    description: "Floral bouquet with vanilla",
    longDescription: "A romantic and luxurious floral scent featuring peony, peony, and tuberose blossoms wrapped in sweet vanilla and creamy tonka bean. Velvet Bloom is both comforting and sophisticated, with hints of caramel and white musk that create a soft, skin-like warmth.",
    price: 79.99,
    originalPrice: 110.00,
    category: "Women",
    size: "50ml",
    stock: 15,
    images: [
      "/images/Velvet.png"
    ],
    isNewArrival: true,
    isPopular: false,
    rating: 4.5,
    reviewCount: 67
  },
  {
  name: "Amber Noir",
  description: "A bold fusion of amber and spice",
  longDescription: "Amber Noir is an intense and luxurious fragrance crafted for evening elegance. It opens with spicy notes of black pepper and cardamom, transitioning into a heart of golden amber and smoky incense. The base is rich with patchouli, vanilla, and dark woods, leaving a powerful and long-lasting trail.",
  price: 94.99,
  originalPrice: 130.00,
  category: "Unisex",
  size: "100ml",
  stock: 30,
  images: [
    "/images/Chanel.png"
  ],
  isNewArrival: false,
  isPopular: true,
  rating: 4.6,
  reviewCount: 98
},

{
  name: "Ocean Whisper",
  description: "A fresh aquatic scent with a citrus touch",
  longDescription: "Ocean Whisper captures the essence of a calm seaside breeze. It begins with sparkling citrus notes of lemon and grapefruit, followed by a refreshing heart of marine accords and green tea. The base settles into soft cedarwood and white musk, making it perfect for everyday wear.",
  price: 79.99,
  originalPrice: 105.00,
  category: "Unisex",
  size: "100ml",
  stock: 40,
  images: [
    "/images/Victoria-Secret.png"
  ],
  isNewArrival: true,
  isPopular: false,
  rating: 4.4,
  reviewCount: 76
},

{
  name: "Velvet Oud",
  description: "A luxurious oud wrapped in warm sweetness",
  longDescription: "Velvet Oud is a sophisticated fragrance that blends deep oud wood with sweet and creamy accords. The opening features saffron and rose, creating a rich introduction. As it develops, notes of oud, caramel, and vanilla emerge, finishing with a smooth base of amber and soft leather.",
  price: 109.99,
  originalPrice: 150.00,
  category: "Men",
  size: "100ml",
  stock: 18,
  images: [
    "/images/Dior-Sauvage.png"
  ],
  isNewArrival: false,
  isPopular: true,
  rating: 4.7,
  reviewCount: 142
},

{
  name: "Blossom Aura",
  description: "A soft floral fragrance with a modern twist",
  longDescription: "Blossom Aura is a delicate yet radiant perfume designed for effortless elegance. It opens with pear and mandarin, followed by a floral heart of peony, orange blossom, and lily of the valley. The base of white musk and light woods creates a clean, graceful finish suitable for all occasions.",
  price: 84.99,
  originalPrice: 115.00,
  category: "Women",
  size: "100ml",
  stock: 35,
  images: [
    "/images/Coco-chanel.png"
  ],
  isNewArrival: true,
  isPopular: false,
  rating: 4.5,
  reviewCount: 63
},

{
  name: "Iron Pulse",
  description: "A powerful woody fragrance with smoky depth",
  longDescription: "Iron Pulse is a bold and confident fragrance crafted for the modern man. It opens with spicy black pepper and bergamot, leading into a heart of cedarwood and patchouli. The base reveals smoky vetiver, leather, and warm amber, creating a long-lasting and masculine trail.",
  price: 99.99,
  originalPrice: 135.00,
  category: "Men",
  size: "100ml",
  stock: 28,
  images: [
    "/images/IronPulse.png"
  ],
  isNewArrival: true,
  isPopular: true,
  rating: 4.7,
  reviewCount: 112
},
{
  name: "Night Ember",
  description: "A deep spicy scent with warm intensity",
  longDescription: "Night Ember is designed for evenings and special occasions. It opens with cardamom and cinnamon, blending into a heart of incense and dark woods. The fragrance settles into a sensual base of vanilla, tobacco, and amber, leaving a rich and memorable impression.",
  price: 92.99,
  originalPrice: 125.00,
  category: "Men",
  size: "100ml",
  stock: 22,
  images: [
    "/images/Night-Ember.png"
  ],
  isNewArrival: false,
  isPopular: true,
  rating: 4.6,
  reviewCount: 89
},
{
  name: "Rose Lumière",
  description: "A luminous rose fragrance with elegant warmth",
  longDescription: "Rose Lumière is a graceful floral perfume that celebrates timeless femininity. It opens with sparkling lychee and pink pepper, unfolding into a heart of Damask rose and peony. The base features soft vanilla and white musk, creating a radiant and long-lasting finish.",
  price: 87.99,
  originalPrice: 120.00,
  category: "Women",
  size: "100ml",
  stock: 30,
  images: [
    "/images/Rose.png"
  ],
  isNewArrival: true,
  isPopular: false,
  rating: 4.5,
  reviewCount: 74
},
{
  name: "Citrus Veil",
  description: "A refreshing citrus fragrance with woody undertones",
  longDescription: "Citrus Veil is a versatile unisex fragrance that blends bright freshness with subtle warmth. It opens with notes of lemon zest and neroli, transitioning into a heart of green tea and ginger. The base of light woods and white musk creates a clean, uplifting scent perfect for everyday wear.",
  price: 79.99,
  originalPrice: 110.00,
  category: "Unisex",
  size: "100ml",
  stock: 40,
  images: [
    "/images/CitrusVeil.png"
  ],
  isNewArrival: false,
  isPopular: false,
  rating: 4.4,
  reviewCount: 58
}


];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(products);
    console.log('Added sample products');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();