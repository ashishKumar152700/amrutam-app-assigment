import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CartItem } from './cartStore';

export type Order = {
  id: string;
  items: CartItem[];

  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };

  subtotal: number;
  delivery: number;
  total: number;

  status:
    | 'placed'
    | 'confirmed'
    | 'delivered'
    | 'cancelled';

  createdAt: string;
};

type OrderState = {
  orders: Order[];

  placeOrder: (
    order: Omit<
      Order,
      'id' | 'createdAt' | 'status'
    >,
  ) => void;

  cancelOrder: (
    orderId: string,
  ) => void;

  clearOrders: () => void;
};

const ORDER_STORAGE_KEY =
  '@amrutam_orders';

const saveOrders = async (
  orders: Order[],
) => {
  try {
    await AsyncStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(orders),
    );
  } catch (error) {
    console.error(
      'Failed to save orders:',
      error,
    );
  }
};

const loadOrders = async () => {
  try {
    const storedOrders =
      await AsyncStorage.getItem(
        ORDER_STORAGE_KEY,
      );

    if (!storedOrders) {
      return [];
    }

    return JSON.parse(
      storedOrders,
    ) as Order[];
  } catch (error) {
    console.error(
      'Failed to load orders:',
      error,
    );

    return [];
  }
};

export const useOrderStore =
  create<OrderState>((set) => {
    // Load previously saved orders
    loadOrders().then((orders) => {
      set({ orders });
    });

    return {
      orders: [],

      placeOrder: (order) => {
        const newOrder: Order = {
          ...order,

          id: `ORD-${Date.now()}`,

          createdAt:
            new Date().toISOString(),

          status: 'placed',
        };

        set((state) => {
          const orders = [
            newOrder,
            ...state.orders,
          ];

          saveOrders(orders);

          return { orders };
        });
      },

      cancelOrder: (orderId) => {
        set((state) => {
          const orders =
            state.orders.map(
              (order) =>
                order.id === orderId
                  ? {
                      ...order,
                      status:
                        'cancelled' as const,
                    }
                  : order,
            );

          saveOrders(orders);

          return { orders };
        });
      },

      clearOrders: () => {
        const orders: Order[] = [];

        saveOrders(orders);

        set({ orders });
      },
    };
  });