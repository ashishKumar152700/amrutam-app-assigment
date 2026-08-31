import { create } from 'zustand';

import { Product } from '../types/product';

type WishlistState = {
  items: Product[];

  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore =
  create<WishlistState>((set, get) => ({
    items: [],

    toggleWishlist: (product) => {
      const exists = get().items.some(
        (item) => item.id === product.id,
      );

      if (exists) {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== product.id,
          ),
        }));

        return;
      }

      set((state) => ({
        items: [...state.items, product],
      }));
    },

    isWishlisted: (productId) => {
      return get().items.some(
        (item) => item.id === productId,
      );
    },

    clearWishlist: () => {
      set({
        items: [],
      });
    },
  }));