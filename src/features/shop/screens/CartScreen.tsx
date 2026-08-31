import React, { useMemo } from 'react';

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

import { useCartStore } from '../store/cartStore';
import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  ShopStackParamList,
} from '../../../navigation/ShopNavigator';


type Props = NativeStackScreenProps<
  ShopStackParamList,
  'Cart'
>;
export default function CartScreen({
  navigation,
}: Props) {
  const items = useCartStore(
    (state) => state.items,
  );

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart,
  );

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.product.price * item.quantity,
      0,
    );
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [items]);

  const handleRemove = (
    productId: string,
    productName: string,
  ) => {
    Alert.alert(
      'Remove Item',
      `Remove ${productName} from cart?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            removeFromCart(productId),
        },
      ],
    );
  };

const handleCheckout = () => {
  console.log('CHECKOUT CLICKED');

  if (items.length === 0) {
    Alert.alert(
      'Empty Cart',
      'Your cart is empty.',
    );
    return;
  }

  navigation.navigate('Checkout');
};

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>
            🛒
          </Text>

          <Text style={styles.emptyTitle}>
            Your cart is empty
          </Text>

          <Text style={styles.emptyText}>
            Add some Ayurvedic products to
            your cart and they will appear here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>
            My Cart
          </Text>

          <Text style={styles.itemCount}>
            {itemCount}{' '}
            {itemCount === 1
              ? 'item'
              : 'items'}
          </Text>
        </View>

        {/* Cart Items */}

        {items.map((item) => {
          const product = item.product;

          const itemTotal =
            product.price *
            item.quantity;

          return (
            <View
              key={product.id}
              style={styles.cartItem}
            >
              <Image
                source={{
                  uri: product.image,
                }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text
                  style={styles.productName}
                  numberOfLines={2}
                >
                  {product.name}
                </Text>

                <Text style={styles.category}>
                  {product.category}
                </Text>

                <Text style={styles.price}>
                  ₹
                  {product.price.toLocaleString(
                    'en-IN',
                  )}
                </Text>

                {/* Quantity */}

                <View style={styles.bottomRow}>
                  <View
                    style={styles.quantityBox}
                  >
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        decreaseQuantity(
                          product.id,
                        )
                      }
                    >
                      <Text
                        style={
                          styles.quantityText
                        }
                      >
                        −
                      </Text>
                    </TouchableOpacity>

                    <Text
                      style={
                        styles.quantityValue
                      }
                    >
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        increaseQuantity(
                          product.id,
                        )
                      }
                    >
                      <Text
                        style={
                          styles.quantityText
                        }
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={styles.itemTotal}
                  >
                    ₹
                    {itemTotal.toLocaleString(
                      'en-IN',
                    )}
                  </Text>
                </View>

                {/* Remove */}

                <TouchableOpacity
                  onPress={() =>
                    handleRemove(
                      product.id,
                      product.name,
                    )
                  }
                  style={styles.removeButton}
                >
                  <Text
                    style={styles.removeText}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Summary */}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items
            </Text>

            <Text style={styles.summaryValue}>
              {itemCount}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              ₹
              {subtotal.toLocaleString(
                'en-IN',
              )}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Delivery
            </Text>

            <Text style={styles.free}>
              FREE
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              ₹
              {subtotal.toLocaleString(
                'en-IN',
              )}
            </Text>
          </View>
        </View>

        {/* Checkout */}

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text
            style={styles.checkoutText}
          >
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B5E20',
  },

  itemCount: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  productImage: {
    width: 95,
    height: 95,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
  },

  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  category: {
    marginTop: 4,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  bottomRow: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE5DD',
    borderRadius: 9,
    overflow: 'hidden',
  },

  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F7F1',
  },

  quantityText: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: '600',
  },

  quantityValue: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
  },

  removeButton: {
    alignSelf: 'flex-start',
    marginTop: 7,
  },

  removeText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },

  summary: {
    marginTop: 10,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },

  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },

  free: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },

  checkoutButton: {
    marginTop: 18,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#777',
    lineHeight: 21,
  },
});