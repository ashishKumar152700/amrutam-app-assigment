import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  DrawerActions,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import ShopNavigator from './ShopNavigator';
import HealthRecordsNavigator from './HealthRecordsNavigator';
import ConsultationNavigator from './ConsultationNavigator';

import { useCartStore } from '../features/shop/store/cartStore';
import { useWishlistStore } from '../features/shop/store/wishlistStore';

export type BottomTabParamList = {
  Consultation: undefined;
  Shop: undefined;
  HealthRecords: undefined;
};

const Tab =
  createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  // 🛒 Cart count
  const cartCount = useCartStore(
    (state) =>
      state.items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
  );

  // ❤️ Wishlist count
  const wishlistCount = useWishlistStore(
    (state) => state.items.length,
  );

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,

        headerTitleAlign: 'left',

        headerLeft: () => (
          <Ionicons
            name="menu-outline"
            size={30}
            color="#1B5E20"
            style={{
              marginLeft: 16,
              marginRight: 12,
            }}
            onPress={() => {
              navigation.dispatch(
                DrawerActions.openDrawer(),
              );
            }}
          />
        ),

        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#1B5E20',
        },

        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#777',

        tabBarLabelStyle: {
          fontSize: 12,
        },

        tabBarIcon: ({
          color,
          size,
        }) => {
          let iconName:
            keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Consultation':
              iconName =
                'medical-outline';
              break;

            case 'Shop':
              iconName =
                'bag-handle-outline';
              break;

            case 'HealthRecords':
              iconName =
                'document-text-outline';
              break;

            default:
              iconName =
                'ellipse-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      {/* Consultation */}

      <Tab.Screen
        name="Consultation"
        component={ConsultationNavigator}
        options={{
          title: 'Consultation',
          tabBarLabel: 'Consult',
        }}
      />

      {/* Shop */}

      <Tab.Screen
        name="Shop"
        component={ShopNavigator}
        options={{
          title: 'Shop',
          tabBarLabel: 'Shop',

          tabBarBadge:
            cartCount > 0
              ? cartCount
              : undefined,
        }}
      />

      {/* Health Records */}

      <Tab.Screen
        name="HealthRecords"
        component={
          HealthRecordsNavigator
        }
        options={{
          title: 'Records',
          tabBarLabel: 'Records',
        }}
      />
    </Tab.Navigator>
  );
}