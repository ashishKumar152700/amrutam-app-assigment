import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Product } from '../types/product';

type Props = {
  product: Product;
  onPress?: (product: Product) => void;
};

function ProductCard({
  product,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: product.image,
        }}
        style={styles.image}
      />

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
          ★ {product.rating} ({product.reviewCount})
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

  image: {
    width: 105,
    height: 105,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
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