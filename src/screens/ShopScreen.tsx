import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import ProductCard from '../features/shop/components/ProductCard';
import { products } from '../features/shop/mocks/products';
import { Product } from '../features/shop/types/product';
import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  ShopStackParamList,
} from '../navigation/ShopNavigator';

const PAGE_SIZE = 20;

type SortOption =
  | 'default'
  | 'priceLow'
  | 'priceHigh'
  | 'rating';

type PriceFilter =
  | 'all'
  | 'under500'
  | '500to1000'
  | 'above1000';

export default function ShopScreen() {
    const navigation =
  useNavigation<
    NativeStackNavigationProp<ShopStackParamList>
  >();
  const [search, setSearch] = useState('');

  const [visibleCount, setVisibleCount] =
    useState(PAGE_SIZE);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [filterVisible, setFilterVisible] =
    useState(false);

  const [sortVisible, setSortVisible] =
    useState(false);

  const [category, setCategory] =
    useState('All');

  const [priceFilter, setPriceFilter] =
    useState<PriceFilter>('all');

  const [minimumRating, setMinimumRating] =
    useState(0);

  const [sort, setSort] =
    useState<SortOption>('default');

    
  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    let result = products.filter(
      (product) => {
        // Search
        const matchesSearch =
          !query ||
          product.name
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query);

        // Category
        const matchesCategory =
          category === 'All' ||
          product.category === category;

        // Price
        let matchesPrice = true;

        if (priceFilter === 'under500') {
          matchesPrice = product.price < 500;
        }

        if (priceFilter === '500to1000') {
          matchesPrice =
            product.price >= 500 &&
            product.price <= 1000;
        }

        if (priceFilter === 'above1000') {
          matchesPrice = product.price > 1000;
        }

        // Rating
        const matchesRating =
          product.rating >= minimumRating;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesPrice &&
          matchesRating
        );
      },
    );

    // Sorting
    if (sort === 'priceLow') {
      result.sort(
        (a, b) => a.price - b.price,
      );
    }

    if (sort === 'priceHigh') {
      result.sort(
        (a, b) => b.price - a.price,
      );
    }

    if (sort === 'rating') {
      result.sort(
        (a, b) => b.rating - a.rating,
      );
    }

    return result;
  }, [
    search,
    category,
    priceFilter,
    minimumRating,
    sort,
  ]);

  const visibleProducts =
    filteredProducts.slice(
      0,
      visibleCount,
    );

  const loadMore = useCallback(() => {
    if (
      loadingMore ||
      visibleCount >=
        filteredProducts.length
    ) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((count) =>
        Math.min(
          count + PAGE_SIZE,
          filteredProducts.length,
        ),
      );

      setLoadingMore(false);
    }, 300);
  }, [
    loadingMore,
    visibleCount,
    filteredProducts.length,
  ]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setVisibleCount(PAGE_SIZE);
    },
    [],
  );

  const resetFilters = () => {
    setCategory('All');
    setPriceFilter('all');
    setMinimumRating(0);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSort = (
    option: SortOption,
  ) => {
    setSort(option);
    setVisibleCount(PAGE_SIZE);
    setSortVisible(false);
  };

const handleProductPress =
  useCallback(
    (product: Product) => {
      navigation.navigate(
        'ProductDetails',
        {
          product,
        },
      );
    },
    [navigation],
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={handleProductPress}
      />
    ),
    [handleProductPress],
  );

  const keyExtractor = useCallback(
    (item: Product) => item.id,
    [],
  );

  const activeFilterCount =
    (category !== 'All' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (minimumRating > 0 ? 1 : 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Ayurvedic Shop
        </Text>

        <Text style={styles.subtitle}>
          Natural products for your wellbeing
        </Text>

        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search products..."
          placeholderTextColor="#999"
          style={styles.search}
        />

        {/* Filter + Sort */}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setFilterVisible(true)
            }
          >
            <Text style={styles.actionText}>
              ⚙ Filters
            </Text>

            {activeFilterCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setSortVisible(true)
            }
          >
            <Text style={styles.actionText}>
              ↕ Sort
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Result */}

      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredProducts.length.toLocaleString()}{' '}
          products
        </Text>

        <Text style={styles.loadedText}>
          Showing {visibleProducts.length}
        </Text>
      </View>

      {/* Product List */}

      <FlatList
        data={visibleProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator
                size="small"
                color="#2E7D32"
              />

              <Text style={styles.loadingText}>
                Loading more products...
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No products found
            </Text>

            <Text style={styles.emptyText}>
              Try changing your search or filters.
            </Text>
          </View>
        }
      />

      {/* FILTER MODAL */}

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setFilterVisible(false)
        }
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filters
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setFilterVisible(false)
                }
              >
                <Text style={styles.close}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category */}

            <Text style={styles.sectionTitle}>
              Category
            </Text>

            <View style={styles.optionRow}>
              {[
                'All',
                'Herbal',
                'Supplements',
                'Personal Care',
                'Wellness',
                'Digestive Care',
              ].map((item) => {
                const selected =
                  category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.option,
                      selected &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setCategory(item)
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Price */}

            <Text style={styles.sectionTitle}>
              Price
            </Text>

            <View style={styles.optionRow}>
              {[
                {
                  label: 'All',
                  value: 'all',
                },
                {
                  label: 'Under ₹500',
                  value: 'under500',
                },
                {
                  label: '₹500–₹1000',
                  value: '500to1000',
                },
                {
                  label: 'Above ₹1000',
                  value: 'above1000',
                },
              ].map((item) => {
                const selected =
                  priceFilter === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.option,
                      selected &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setPriceFilter(
                        item.value as PriceFilter,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Rating */}

            <Text style={styles.sectionTitle}>
              Minimum Rating
            </Text>

            <View style={styles.optionRow}>
              {[0, 3, 4, 4.5].map(
                (rating) => {
                  const selected =
                    minimumRating === rating;

                  return (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.option,
                        selected &&
                          styles.selectedOption,
                      ]}
                      onPress={() =>
                        setMinimumRating(rating)
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {rating === 0
                          ? 'All'
                          : `★ ${rating}+`}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>

            {/* Buttons */}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetText}>
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() =>
                  setFilterVisible(false)
                }
              >
                <Text style={styles.applyText}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SORT MODAL */}

      <Modal
        visible={sortVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSortVisible(false)
        }
      >
        <View style={styles.overlay}>
          <View style={styles.sortModal}>
            <Text style={styles.modalTitle}>
              Sort Products
            </Text>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() =>
                handleSort('default')
              }
            >
              <Text style={styles.sortText}>
                Recommended
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() =>
                handleSort('priceLow')
              }
            >
              <Text style={styles.sortText}>
                Price: Low → High
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() =>
                handleSort('priceHigh')
              }
            >
              <Text style={styles.sortText}>
                Price: High → Low
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() =>
                handleSort('rating')
              }
            >
              <Text style={styles.sortText}>
                Rating: High → Low
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeSort}
              onPress={() =>
                setSortVisible(false)
              }
            >
              <Text style={styles.closeSortText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 12,
    paddingBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },

  search: {
    height: 48,
    marginTop: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    color: '#222',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  actionText: {
    color: '#2E7D32',
    fontWeight: '700',
  },

  badge: {
    marginLeft: 7,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  resultText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
  },

  loadedText: {
    fontSize: 12,
    color: '#888',
  },

  loader: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  loadingText: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },

  empty: {
    alignItems: 'center',
    padding: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  emptyText: {
    marginTop: 6,
    color: '#777',
    textAlign: 'center',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  close: {
    fontSize: 20,
    color: '#555',
  },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  selectedOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },

  optionText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  selectedOptionText: {
    color: '#2E7D32',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
  },

  resetText: {
    color: '#2E7D32',
    fontWeight: '700',
  },

  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },

  applyText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  sortModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  sortOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  sortText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  closeSort: {
    marginTop: 15,
    paddingVertical: 14,
    alignItems: 'center',
  },

  closeSortText: {
    color: '#D32F2F',
    fontWeight: '700',
  },
});