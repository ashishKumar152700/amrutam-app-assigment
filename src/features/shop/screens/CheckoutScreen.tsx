import React, { useMemo, useState } from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useCartStore,
} from '../store/cartStore';

import {
  useOrderStore,
} from '../store/orderStore';

export default function CheckoutScreen() {
  const items = useCartStore(
    (state) => state.items,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const placeOrder =
    useOrderStore(
      (state) => state.placeOrder,
    );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0,
    );
  }, [items]);

  const delivery = 0;

  const total =
    subtotal + delivery;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Your cart is empty.',
      );

      return;
    }

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please complete your delivery details.',
      );

      return;
    }

    if (phone.length < 10) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid phone number.',
      );

      return;
    }

    if (pincode.length !== 6) {
      Alert.alert(
        'Invalid Pincode',
        'Please enter a valid 6-digit pincode.',
      );

      return;
    }

    const orderItems = [...items];

    placeOrder({
      items: orderItems,

      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      },

      subtotal,
      delivery,
      total,
    });

    Alert.alert(
      'Order Confirmed 🎉',
      `Thank you ${name}!\n\nYour order worth ₹${total.toLocaleString(
        'en-IN',
      )} has been placed.`,
      [
        {
          text: 'Done',
          onPress: () => {
            clearCart();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <Text style={styles.title}>
          Checkout
        </Text>

        <Text style={styles.subtitle}>
          Complete your order
        </Text>

        {/* Delivery Address */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            Delivery Address
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.input}
          />

          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="House / Street / Area"
            placeholderTextColor="#999"
            multiline
            style={[
              styles.input,
              styles.addressInput,
            ]}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TextInput
            value={pincode}
            onChangeText={setPincode}
            placeholder="Pincode"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
          />
        </View>

        {/* Items */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            Order Items
          </Text>

          {items.map((item) => (
            <View
              key={item.product.id}
              style={styles.itemRow}
            >
              <View
                style={styles.itemInfo}
              >
                <Text
                  style={styles.itemName}
                  numberOfLines={2}
                >
                  {item.product.name}
                </Text>

                <Text
                  style={styles.quantity}
                >
                  Quantity:{' '}
                  {item.quantity}
                </Text>
              </View>

              <Text
                style={styles.itemPrice}
              >
                ₹
                {(
                  item.product.price *
                  item.quantity
                ).toLocaleString(
                  'en-IN',
                )}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            Price Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Subtotal
            </Text>

            <Text style={styles.value}>
              ₹
              {subtotal.toLocaleString(
                'en-IN',
              )}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Delivery
            </Text>

            <Text style={styles.free}>
              FREE
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text
              style={styles.totalLabel}
            >
              Total
            </Text>

            <Text style={styles.total}>
              ₹
              {total.toLocaleString(
                'en-IN',
              )}
            </Text>
          </View>
        </View>

        {/* Place Order */}

        <TouchableOpacity
          style={styles.orderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.orderText}>
            Place Order • ₹
            {total.toLocaleString(
              'en-IN',
            )}
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

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 4,
    color: '#777',
    fontSize: 14,
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 11,
    paddingHorizontal: 14,
    marginTop: 10,
    color: '#222',
    backgroundColor: '#FAFAFA',
  },

  addressInput: {
    height: 80,
    paddingTop: 13,
    textAlignVertical: 'top',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  quantity: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: '#666',
  },

  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },

  free: {
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

  total: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },

  orderButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
  },

  orderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});