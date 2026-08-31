import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Product } from '../types/product';
import { useWishlistStore } from '../store/wishlistStore';

type Props = {
  product: Product;
  onPress?: (product: Product) => void;
};

function ProductCard({
  product,
  onPress,
}: Props) {
  const isWishlisted = useWishlistStore(
    (state) =>
      state.items.some(
        (item) => item.id === product.id,
      ),
  );

  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist,
  );

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      {/* Product Image */}

      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.image,
          }}
          style={styles.image}
        />

        {/* Wishlist Button */}

        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlist}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.heart,
              isWishlisted &&
                styles.heartActive,
            ]}
          >
            {isWishlisted ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Info */}

      <View style={styles.info}>
        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <Text style={styles.category}>
          {product.category}
        </Text>

        <Text style={styles.rating}>
          ★ {product.rating} (
          {product.reviewCount})
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{product.price}
          </Text>

          <Text style={styles.originalPrice}>
            ₹{product.originalPrice}
          </Text>
        </View>

        <Text
          style={[
            styles.stock,
            !product.inStock &&
              styles.outOfStock,
          ]}
        >
          {product.inStock
            ? 'In Stock'
            : 'Out of Stock'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    elevation: 2,
  },

  imageContainer: {
    position: 'relative',
    width: 105,
    height: 105,
  },

  image: {
    width: 105,
    height: 105,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
  },

  wishlistButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  heart: {
    fontSize: 23,
    color: '#555',
    lineHeight: 25,
  },

  heartActive: {
    color: '#D32F2F',
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  category: {
    marginTop: 5,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  rating: {
    marginTop: 6,
    fontSize: 12,
    color: '#B9770E',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B5E20',
  },

  originalPrice: {
    marginLeft: 8,
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  stock: {
    marginTop: 6,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  outOfStock: {
    color: '#D32F2F',
  },
});