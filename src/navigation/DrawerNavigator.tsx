import React from 'react';

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import UpcomingConsultationsScreen from '../features/consultation/screens/UpcomingConsultationsScreen';

import WishlistScreen from '../features/shop/screens/WishlistScreen';

import CartScreen from '../features/shop/screens/CartScreen';

import { useCartStore } from '../features/shop/store/cartStore';
import { useWishlistStore } from '../features/shop/store/wishlistStore';
import OrderHistoryScreen
  from '../features/shop/screens/OrderHistoryScreen';

  import ProfileScreen from '../screens/ProfileScreen';


const Drawer =
  createDrawerNavigator();

function CustomDrawerContent(
  props: any,
) {
  const cartCount = useCartStore(
    (state) =>
      state.items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
  );

  const wishlistCount =
    useWishlistStore(
      (state) => state.items.length,
    );

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={
        styles.drawerContainer
      }
    >
      {/* Header */}

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            A
          </Text>
        </View>

        <View>
          <Text style={styles.appName}>
            Amrutam
          </Text>

          <Text style={styles.appSubtitle}>
            Ayurveda & Wellness
          </Text>
        </View>
      </View>

      {/* Navigation */}

      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>

      {/* Counts */}

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>
            ❤️
          </Text>

          <Text style={styles.summaryText}>
            Wishlist
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {wishlistCount}
            </Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>
            🛒
          </Text>

          <Text style={styles.summaryText}>
            Cart
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {cartCount}
            </Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
        />
      )}
      screenOptions={{
        headerShown: false,

        drawerType: 'slide',

        drawerActiveTintColor:
          '#2E7D32',

        drawerInactiveTintColor:
          '#555',

        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          marginLeft: -8,
        },
      }}
    >
      {/* Home */}

      <Drawer.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{
          title: 'Amrutam',
          drawerLabel: 'Home',
        }}
      />

      {/* Upcoming Consultations */}

      <Drawer.Screen
        name="UpcomingConsultations"
        component={
          UpcomingConsultationsScreen
        }
        options={{
          title:
            'Upcoming Consultations',
          drawerLabel:
            'Upcoming Consultations',
        }}
      />

<Drawer.Screen
  name="OrderHistory"
  component={OrderHistoryScreen}
  options={{
    title: 'Order History',
    drawerLabel: 'Order History',
  }}
/>

<Drawer.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    title: 'My Profile',
    drawerLabel: 'My Profile',
  }}
/>

<Drawer.Screen
  name="Settings"
  component={SettingsScreen}
  options={{
    title: 'Settings',
    drawerLabel: 'Settings',
  }}
/>
      {/* Wishlist */}

      <Drawer.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
          drawerLabel: 'Wishlist',
        }}
      />

      {/* Cart */}

      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          drawerLabel: 'Cart',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },

  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },

  appSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#777',
  },

  menu: {
    paddingTop: 8,
  },

  summary: {
    marginTop: 'auto',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F7F9F7',
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  summaryIcon: {
    fontSize: 18,
    width: 30,
  },

  summaryText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },

  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});