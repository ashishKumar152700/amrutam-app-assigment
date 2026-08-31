import React, { useState } from 'react';

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

import { useUserStore } from '../store/userStore';

export default function ProfileScreen({
  navigation,
}: any) {
  const profile = useUserStore(
    (state) => state.profile,
  );

  const updateProfile = useUserStore(
    (state) => state.updateProfile,
  );

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState(profile.name);

  const [phone, setPhone] =
    useState(profile.phone);

  const [email, setEmail] =
    useState(profile.email);

  const [address, setAddress] =
    useState(profile.address);

  const [city, setCity] =
    useState(profile.city);

  const [pincode, setPincode] =
    useState(profile.pincode);

  const handleEdit = () => {
    setName(profile.name);
    setPhone(profile.phone);
    setEmail(profile.email);
    setAddress(profile.address);
    setCity(profile.city);
    setPincode(profile.pincode);

    setEditing(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(
        'Missing Name',
        'Please enter your name.',
      );

      return;
    }

    if (
      phone.trim() &&
      phone.trim().length !== 10
    ) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number.',
      );

      return;
    }

    if (
      pincode.trim() &&
      pincode.trim().length !== 6
    ) {
      Alert.alert(
        'Invalid Pincode',
        'Please enter a valid 6-digit pincode.',
      );

      return;
    }

    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    });

    setEditing(false);

    Alert.alert(
      'Profile Updated 🎉',
      'Your profile has been updated successfully.',
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Profile Header */}

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : 'U'}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {profile.name ||
                'Your Name'}
            </Text>

            <Text style={styles.memberText}>
              Amrutam Member
            </Text>
          </View>
        </View>

        {/* Personal Information */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Personal Information
            </Text>

            {!editing && (
              <TouchableOpacity
                onPress={handleEdit}
              >
                <Text
                  style={styles.editText}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>
            Full Name
          </Text>

          {editing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor="#999"
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>
              {profile.name ||
                'Not added'}
            </Text>
          )}

          <Text style={styles.label}>
            Phone Number
          </Text>

          {editing ? (
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>
              {profile.phone ||
                'Not added'}
            </Text>
          )}

          <Text style={styles.label}>
            Email
          </Text>

          {editing ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>
              {profile.email ||
                'Not added'}
            </Text>
          )}
        </View>

        {/* Address */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Delivery Address
          </Text>

          <Text style={styles.label}>
            Address
          </Text>

          {editing ? (
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
          ) : (
            <Text style={styles.value}>
              {profile.address ||
                'Not added'}
            </Text>
          )}

          <Text style={styles.label}>
            City
          </Text>

          {editing ? (
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#999"
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>
              {profile.city ||
                'Not added'}
            </Text>
          )}

          <Text style={styles.label}>
            Pincode
          </Text>

          {editing ? (
            <TextInput
              value={pincode}
              onChangeText={setPincode}
              placeholder="Pincode"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>
              {profile.pincode ||
                'Not added'}
            </Text>
          )}
        </View>

        {/* Save / Cancel */}

        {editing && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setEditing(false)
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text
                style={styles.saveText}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account */}

        {!editing && (
          <View style={styles.accountCard}>
            <Text style={styles.cardTitle}>
              Account
            </Text>

            <TouchableOpacity
            style={styles.accountRow}
            onPress={() =>
                navigation.navigate('Settings')
            }
            >
              <Text style={styles.accountIcon}>
                ⚙️
              </Text>

              <Text
                style={styles.accountText}
              >
                Settings
              </Text>

              <Text
                style={styles.arrow}
              >
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={styles.accountDivider}
            />

            <TouchableOpacity
              style={styles.accountRow}
              onPress={() =>
                Alert.alert(
                  'Logout',
                  'Logout functionality will be connected here.',
                )
              }
            >
              <Text style={styles.accountIcon}>
                🚪
              </Text>

              <Text
                style={styles.logoutText}
              >
                Logout
              </Text>

              <Text
                style={styles.arrow}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    padding: 20,
    paddingBottom: 40,
  },

  profileHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 16,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
  },

  headerInfo: {
    marginLeft: 15,
  },

  name: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
  },

  memberText: {
    marginTop: 4,
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  editText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '700',
  },

  label: {
    marginTop: 14,
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },

  value: {
    marginTop: 5,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 11,
    paddingHorizontal: 13,
    marginTop: 7,
    color: '#222',
    backgroundColor: '#FAFAFA',
  },

  addressInput: {
    height: 80,
    paddingTop: 13,
    textAlignVertical: 'top',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
  },

  cancelText: {
    color: '#D32F2F',
    fontWeight: '700',
  },

  saveButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
  },

  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  accountIcon: {
    fontSize: 20,
    width: 35,
  },

  accountText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  logoutText: {
    flex: 1,
    fontSize: 15,
    color: '#D32F2F',
    fontWeight: '600',
  },

  arrow: {
    fontSize: 24,
    color: '#999',
  },

  accountDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
});