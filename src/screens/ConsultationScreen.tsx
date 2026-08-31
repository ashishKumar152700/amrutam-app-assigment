import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ConsultationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Ayurvedic Consultation
        </Text>

        <Text style={styles.subtitle}>
          Find the right doctor for your health needs.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Doctor Consultation
          </Text>

          <Text style={styles.cardText}>
            Search doctors, check available slots and book
            your consultation.
          </Text>
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
    fontSize: 26,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666',
  },
});