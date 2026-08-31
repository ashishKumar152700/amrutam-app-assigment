import { Product } from '../types/product';

const productNames = [
  'Ashwagandha Capsules',
  'Triphala Tablets',
  'Turmeric Curcumin',
  'Brahmi Capsules',
  'Neem Capsules',
  'Giloy Tablets',
  'Amla Powder',
  'Chyawanprash',
  'Herbal Hair Oil',
  'Ayurvedic Face Wash',
  'Digestive Herbal Tea',
  'Stress Relief Tablets',
  'Immunity Booster',
  'Herbal Joint Care',
  'Aloe Vera Gel',
];

const categories = [
  'Herbal',
  'Supplements',
  'Personal Care',
  'Wellness',
  'Digestive Care',
] as const;

const generateProducts = (): Product[] => {
  return Array.from(
    { length: 20000 },
    (_, index) => {
      const basePrice =
        199 + (index % 12) * 50;

      return {
        id: `product-${index + 1}`,

        name: `${
          productNames[
            index % productNames.length
          ]
        } ${Math.floor(index / productNames.length) + 1}`,

        category:
          categories[
            index % categories.length
          ],

        price: basePrice,

        originalPrice:
          basePrice + 100,

        rating:
          Number(
            (4 + (index % 10) / 10).toFixed(1),
          ),

        reviewCount:
          20 + (index % 500),

        image:
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',

        description:
          'Ayurvedic wellness product made for everyday health and wellbeing.',

        inStock:
          index % 17 !== 0,
      };
    },
  );
};

export const products = generateProducts();