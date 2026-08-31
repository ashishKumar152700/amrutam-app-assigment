import React from 'react';

import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useOrderStore,
} from '../store/orderStore';

import { Order } from '../store/orderStore';

export default function OrderHistoryScreen() {
  const orders = useOrderStore(
    (state) => state.orders,
  );

  const cancelOrder = useOrderStore(
    (state) => state.cancelOrder,
  );

  const handleCancel = (order: Order) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelOrder(order.id);
          },
        },
      ],
    );
  };

  const renderOrder = ({
    item,
  }: {
    item: Order;
  }) => {
    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.orderId}>
              {item.id}
            </Text>

            <Text style={styles.date}>
              {new Date(
                item.createdAt,
              ).toLocaleDateString(
                'en-IN',
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.status ===
                'cancelled' &&
                styles.cancelledBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status ===
                  'cancelled' &&
                  styles.cancelledText,
              ]}
            >
              {item.status
                .charAt(0)
                .toUpperCase() +
                item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.itemCount}>
          {item.items.length}{' '}
          {item.items.length === 1
            ? 'Product'
            : 'Products'}
        </Text>

        {item.items.map((cartItem) => (
          <View
            key={cartItem.product.id}
            style={styles.productRow}
          >
            <Text
              style={styles.productName}
              numberOfLines={1}
            >
              {cartItem.product.name}
            </Text>

            <Text style={styles.quantity}>
              × {cartItem.quantity}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.total}>
            ₹
            {item.total.toLocaleString(
              'en-IN',
            )}
          </Text>
        </View>

        {item.status !==
          'cancelled' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              handleCancel(item)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.cancelText}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Order History
        </Text>

        <Text style={styles.subtitle}>
          View your Amrutam orders
        </Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          styles.list
        }
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              📦
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No Orders Yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Your placed orders will
              appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  header: {
    padding: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 5,
    color: '#777',
    fontSize: 14,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-start',
  },

  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  date: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  cancelledBadge: {
    backgroundColor: '#FFEBEE',
  },

  statusText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },

  cancelledText: {
    color: '#D32F2F',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 14,
  },

  itemCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  productName: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },

  quantity: {
    marginLeft: 10,
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  total: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1B5E20',
  },

  cancelButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },

  cancelText: {
    color: '#D32F2F',
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    padding: 45,
  },

  emptyIcon: {
    fontSize: 48,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
  },

  emptyText: {
    marginTop: 8,
    color: '#777',
    textAlign: 'center',
  },
});