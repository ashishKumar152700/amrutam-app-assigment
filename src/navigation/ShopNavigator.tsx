import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import ShopScreen from '../screens/ShopScreen';
import ProductDetailsScreen from '../features/shop/screens/ProductDetailsScreen';
import CartScreen from '../features/shop/screens/CartScreen';
import CheckoutScreen from '../features/shop/screens/CheckoutScreen';
import WishlistScreen from '../features/shop/screens/WishlistScreen';
import OrderHistoryScreen from '../features/shop/screens/OrderHistoryScreen';

import type { Product } from '../features/shop/types/product';

export type ShopStackParamList = {
  Shop: undefined;

  ProductDetails: {
    product: Product;
  };

  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
  OrderHistory: undefined;
};

const Stack =
  createNativeStackNavigator<ShopStackParamList>();

export default function ShopNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Shop"
    >
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}