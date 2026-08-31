export type ProductCategory =
  | 'Herbal'
  | 'Supplements'
  | 'Personal Care'
  | 'Wellness'
  | 'Digestive Care';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  inStock: boolean;
};