import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] =
    useState(true);

  const [reminders, setReminders] =
    useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Settings
        </Text>

        <Text style={styles.subtitle}>
          Manage your Amrutam preferences.
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Preferences
          </Text>

          {/* Notifications */}

          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.rowTitle}>
                Notifications
              </Text>

              <Text style={styles.rowDescription}>
                Receive updates about your
                consultations and orders.
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={
                setNotifications
              }
              trackColor={{
                false: '#DDD',
                true: '#A5D6A7',
              }}
              thumbColor={
                notifications
                  ? '#2E7D32'
                  : '#F4F3F4'
              }
            />
          </View>

          <View style={styles.divider} />

          {/* Reminders */}

          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.rowTitle}>
                Consultation Reminders
              </Text>

              <Text style={styles.rowDescription}>
                Get reminders before your
                scheduled consultations.
              </Text>
            </View>

            <Switch
              value={reminders}
              onValueChange={
                setReminders
              }
              trackColor={{
                false: '#DDD',
                true: '#A5D6A7',
              }}
              thumbColor={
                reminders
                  ? '#2E7D32'
                  : '#F4F3F4'
              }
            />
          </View>
        </View>

        {/* App Info */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            About
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              App
            </Text>

            <Text style={styles.value}>
              Amrutam
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Version
            </Text>

            <Text style={styles.value}>
              1.0.0
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Category
            </Text>

            <Text style={styles.value}>
              Ayurveda & Wellness
            </Text>
          </View>
        </View>
      </View>
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
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 14,
    color: '#666',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  info: {
    flex: 1,
    paddingRight: 12,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  rowDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#777',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  label: {
    fontSize: 14,
    color: '#777',
  },

  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});