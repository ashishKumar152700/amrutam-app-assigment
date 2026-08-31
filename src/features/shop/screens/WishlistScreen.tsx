import React from 'react';

import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Product } from '../types/product';
import { useWishlistStore } from '../store/wishlistStore';

export default function WishlistScreen() {
  const items = useWishlistStore(
    (state) => state.items,
  );

  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist,
  );

  const renderItem = ({
    item,
  }: {
    item: Product;
  }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text
            style={styles.name}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text style={styles.category}>
            {item.category}
          </Text>

          <Text style={styles.rating}>
            ★ {item.rating} ({item.reviewCount})
          </Text>

          <Text style={styles.price}>
            ₹{item.price}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            toggleWishlist(item)
          }
        >
          <Text style={styles.heart}>
            ♥
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Wishlist
          </Text>

          <Text style={styles.subtitle}>
            {items.length}{' '}
            {items.length === 1
              ? 'product'
              : 'products'}{' '}
            saved
          </Text>
        </View>

        <Text style={styles.headerHeart}>
          ♥
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>
            ♡
          </Text>

          <Text style={styles.emptyTitle}>
            Your wishlist is empty
          </Text>

          <Text style={styles.emptyText}>
            Tap the heart on any product to
            save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.list
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#777',
  },

  headerHeart: {
    fontSize: 30,
    color: '#D32F2F',
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    elevation: 2,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
  },

  info: {
    flex: 1,
    marginLeft: 13,
    paddingRight: 5,
  },

  name: {
    fontSize: 15,
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
    marginTop: 5,
    fontSize: 12,
    color: '#B9770E',
  },

  price: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '700',
    color: '#1B5E20',
  },

  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heart: {
    fontSize: 22,
    color: '#D32F2F',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 65,
    color: '#AAA',
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 21,
    fontWeight: '700',
    color: '#333',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#777',
    lineHeight: 21,
  },
});