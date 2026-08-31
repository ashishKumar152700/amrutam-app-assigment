import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Product } from '../types/product';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = '@amrutam_cart';

const saveCart = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items),
    );
  } catch (error) {
    console.error(
      'Failed to save cart:',
      error,
    );
  }
};

const loadCart = async () => {
  try {
    const storedCart =
      await AsyncStorage.getItem(
        CART_STORAGE_KEY,
      );

    if (!storedCart) {
      return [];
    }

    return JSON.parse(storedCart) as CartItem[];
  } catch (error) {
    console.error(
      'Failed to load cart:',
      error,
    );

    return [];
  }
};

export const useCartStore = create<CartState>(
  (set) => {
    // Load saved cart when store starts
    loadCart().then((items) => {
      set({ items });
    });

    return {
      items: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product.id === product.id,
          );

          let items: CartItem[];

          if (existing) {
            items = state.items.map(
              (item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity:
                        item.quantity + 1,
                    }
                  : item,
            );
          } else {
            items = [
              ...state.items,
              {
                product,
                quantity: 1,
              },
            ];
          }

          saveCart(items);

          return { items };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const items = state.items.filter(
            (item) =>
              item.product.id !== productId,
          );

          saveCart(items);

          return { items };
        });
      },

      increaseQuantity: (productId) => {
        set((state) => {
          const items = state.items.map(
            (item) =>
              item.product.id === productId
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item,
          );

          saveCart(items);

          return { items };
        });
      },

      decreaseQuantity: (productId) => {
        set((state) => {
          const items = state.items
            .map((item) =>
              item.product.id === productId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item,
            )
            .filter(
              (item) => item.quantity > 0,
            );

          saveCart(items);

          return { items };
        });
      },

      clearCart: () => {
        const items: CartItem[] = [];

        saveCart(items);

        set({ items });
      },
    };
  },
);