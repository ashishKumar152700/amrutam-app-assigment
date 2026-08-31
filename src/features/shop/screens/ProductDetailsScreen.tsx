import React from 'react';

import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';

export type ShopStackParamList = {
  Shop: undefined;

  ProductDetails: {
    product: Product;
  };

  Cart: undefined;
};

type Props = NativeStackScreenProps<
  ShopStackParamList,
  'ProductDetails'
>;

export default function ProductDetailsScreen({
  route,
  navigation,
}: Props) {
  const { product } = route.params;

  const addToCart = useCartStore(
    (state) => state.addToCart,
  );

  const handleAddToCart = () => {
    if (!product.inStock) {
      Alert.alert(
        'Out of Stock',
        'This product is currently unavailable.',
      );

      return;
    }

    addToCart(product);

    Alert.alert(
      'Added to Cart 🛒',
      `${product.name} has been added to your cart.`,
      [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'View Cart',
          onPress: () => {
            navigation.navigate('Cart');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Back */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Product Image */}

        <Image
          source={{
            uri: product.image,
          }}
          style={styles.image}
        />

        {/* Product Information */}

        <View style={styles.card}>
          <Text style={styles.category}>
            {product.category}
          </Text>

          <Text style={styles.name}>
            {product.name}
          </Text>

          <Text style={styles.rating}>
            ★ {product.rating} (
            {product.reviewCount} reviews)
          </Text>

          {/* Price */}

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{product.price}
            </Text>

            <Text style={styles.originalPrice}>
              ₹{product.originalPrice}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Description */}

          <Text style={styles.heading}>
            Product Description
          </Text>

          <Text style={styles.description}>
            {product.description}
          </Text>

          {/* Stock */}

          <Text
            style={[
              styles.stock,
              !product.inStock &&
                styles.outOfStock,
            ]}
          >
            {product.inStock
              ? '✓ In Stock'
              : '✕ Out of Stock'}
          </Text>

          {/* Add To Cart */}

          <TouchableOpacity
            style={[
              styles.cartButton,
              !product.inStock &&
                styles.disabledButton,
            ]}
            disabled={!product.inStock}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.cartButtonText}>
              {product.inStock
                ? 'Add to Cart'
                : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  backButton: {
    marginBottom: 15,
  },

  backText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },

  image: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
  },

  card: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  category: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '700',
  },

  name: {
    marginTop: 7,
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  rating: {
    marginTop: 8,
    color: '#B9770E',
    fontWeight: '600',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  price: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1B5E20',
  },

  originalPrice: {
    marginLeft: 10,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },

  stock: {
    marginTop: 16,
    color: '#2E7D32',
    fontWeight: '700',
  },

  outOfStock: {
    color: '#D32F2F',
  },

  cartButton: {
    marginTop: 20,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#AAAAAA',
  },

  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});