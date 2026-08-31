import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Doctor } from '../types/doctor';

type Props = {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
};

function DoctorCard({ doctor, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(doctor)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: doctor.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>
          {doctor.name}
        </Text>

        <Text style={styles.specialization}>
          {doctor.specialization}
        </Text>

        <Text style={styles.experience}>
          {doctor.experience} years experience
        </Text>

        <View style={styles.row}>
          <Text style={styles.rating}>
            ★ {doctor.rating}
          </Text>

          <Text style={styles.reviews}>
            ({doctor.reviewCount} reviews)
          </Text>
        </View>

        <Text style={styles.fee}>
          ₹{doctor.consultationFee} consultation
        </Text>

        <Text
          style={[
            styles.availability,
            !doctor.availableToday &&
              styles.tomorrow,
          ]}
        >
          {doctor.nextAvailableSlot}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(DoctorCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 7,
    padding: 14,
    borderRadius: 16,
    elevation: 2,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  specialization: {
    marginTop: 3,
    fontSize: 14,
    color: '#2E7D32',
  },

  experience: {
    marginTop: 4,
    fontSize: 12,
    color: '#777',
  },

  row: {
    flexDirection: 'row',
    marginTop: 5,
  },

  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D68910',
  },

  reviews: {
    marginLeft: 5,
    fontSize: 12,
    color: '#888',
  },

  fee: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '600',
  },

  availability: {
    marginTop: 4,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  tomorrow: {
    color: '#E67E22',
  },
});