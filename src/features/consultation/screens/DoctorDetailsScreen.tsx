import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Doctor } from '../types/doctor';
import { useBookingStore } from '../store/bookingStore';

export type ConsultationStackParamList = {
  DoctorList: undefined;

  DoctorDetails: {
    doctor: Doctor;
  };
};

type Props = NativeStackScreenProps<
  ConsultationStackParamList,
  'DoctorDetails'
>;

const dates = [
  'Today',
  'Tomorrow',
  'Wed',
];

const generateSlots = () => [
  '09:00 AM',
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export default function DoctorDetailsScreen({
  route,
  navigation,
}: Props) {
  const { doctor } = route.params;

  const [selectedDate, setSelectedDate] =
    useState('Today');

  const [selectedSlot, setSelectedSlot] =
    useState<string | null>(null);

  const bookConsultation =
    useBookingStore(
      (state) => state.bookConsultation,
    );

  const slots = useMemo(() => {
    return generateSlots();
  }, [selectedDate]);

  // Check whether today's slot has already passed
  const isSlotExpired = (slot: string) => {
    // Tomorrow/Wed ke slots kabhi expired nahi honge
    if (selectedDate !== 'Today') {
      return false;
    }

    const now = new Date();

    const [time, period] = slot.split(' ');
    const [hoursString, minutesString] =
      time.split(':');

    let hours = Number(hoursString);
    const minutes = Number(minutesString);

    // Convert 12-hour time to 24-hour time
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const slotTime = new Date();

    slotTime.setHours(hours);
    slotTime.setMinutes(minutes);
    slotTime.setSeconds(0);
    slotTime.setMilliseconds(0);

    return slotTime <= now;
  };

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert(
        'Select a slot',
        'Please select a consultation slot first.',
      );

      return;
    }

    // Extra safety check
    if (isSlotExpired(selectedSlot)) {
      Alert.alert(
        'Slot Expired',
        'This consultation slot has already passed. Please select another slot.',
      );

      setSelectedSlot(null);

      return;
    }

    Alert.alert(
      'Confirm Consultation',
      `${doctor.name}\n${selectedDate} at ${selectedSlot}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Confirm',
          onPress: () => {
            const result =
              bookConsultation(
                doctor,
                selectedDate,
                selectedSlot,
              );

            if (!result.success) {
              Alert.alert(
                'Booking Failed',
                result.message,
              );

              return;
            }

            Alert.alert(
              'Booking Confirmed 🎉',
              `Your consultation with ${doctor.name} is booked.`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Back Button */}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Doctor Profile */}

        <View style={styles.profileCard}>
          <Image
            source={{
              uri: doctor.image,
            }}
            style={styles.image}
          />

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {doctor.name}
            </Text>

            <Text style={styles.specialization}>
              {doctor.specialization}
            </Text>

            <Text style={styles.experience}>
              {doctor.experience} years experience
            </Text>

            <Text style={styles.rating}>
              ★ {doctor.rating} (
              {doctor.reviewCount} reviews)
            </Text>
          </View>
        </View>

        {/* Doctor Information */}

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            About Doctor
          </Text>

          <Text style={styles.description}>
            Experienced Ayurvedic practitioner
            specializing in personalized wellness
            and holistic treatment.
          </Text>

          <Text style={styles.detail}>
            📍 {doctor.location}
          </Text>

          <Text style={styles.detail}>
            🗣 {doctor.languages.join(', ')}
          </Text>

          <Text style={styles.fee}>
            Consultation Fee: ₹
            {doctor.consultationFee}
          </Text>
        </View>

        {/* Date */}

        <Text style={styles.heading}>
          Select Date
        </Text>

        <View style={styles.dateRow}>
          {dates.map((date) => {
            const selected =
              selectedDate === date;

            return (
              <TouchableOpacity
                key={date}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                style={[
                  styles.dateButton,
                  selected &&
                    styles.selectedDate,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    selected &&
                      styles.selectedDateText,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Slots */}

        <Text style={styles.heading}>
          Available Slots
        </Text>

        <View style={styles.slotGrid}>
          {slots.map((slot) => {
            const selected =
              selectedSlot === slot;

            const expired =
              isSlotExpired(slot);

            return (
              <TouchableOpacity
                key={slot}
                disabled={expired}
                onPress={() => {
                  if (!expired) {
                    setSelectedSlot(slot);
                  }
                }}
                style={[
                  styles.slot,
                  selected &&
                    styles.selectedSlot,
                  expired &&
                    styles.expiredSlot,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    selected &&
                      styles.selectedSlotText,
                    expired &&
                      styles.expiredSlotText,
                  ]}
                >
                  {slot}
                </Text>

                {expired && (
                  <Text style={styles.expiredText}>
                    Expired
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Booking Button */}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>
            Book Consultation
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
    paddingBottom: 30,
  },

  backButton: {
    marginBottom: 15,
  },

  backText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    elevation: 2,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  specialization: {
    marginTop: 5,
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },

  experience: {
    marginTop: 5,
    color: '#777',
    fontSize: 13,
  },

  rating: {
    marginTop: 7,
    color: '#B9770E',
    fontSize: 13,
    fontWeight: '600',
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  description: {
    marginTop: 10,
    color: '#666',
    lineHeight: 21,
    fontSize: 14,
  },

  detail: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },

  fee: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 22,
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },

  dateButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  selectedDate: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  dateText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },

  selectedDateText: {
    color: '#FFFFFF',
  },

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  slot: {
    width: '31%',
    minHeight: 58,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedSlot: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  slotText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  selectedSlotText: {
    color: '#FFFFFF',
  },

  expiredSlot: {
    backgroundColor: '#EEEEEE',
    borderColor: '#DDDDDD',
    opacity: 0.6,
  },

  expiredSlotText: {
    color: '#999',
  },

  expiredText: {
    marginTop: 3,
    fontSize: 9,
    color: '#999',
    fontWeight: '600',
  },

  bookButton: {
    marginTop: 28,
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});