import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Booking } from '../types/booking';
import { Doctor } from '../types/doctor';

type BookingState = {
  bookings: Booking[];

  bookConsultation: (
    doctor: Doctor,
    date: string,
    slot: string,
  ) => {
    success: boolean;
    message: string;
  };

  cancelBooking: (
    bookingId: string,
  ) => void;

  getUpcomingBookings: () => Booking[];
};

const BOOKING_STORAGE_KEY =
  '@amrutam_bookings';

const saveBookings = async (
  bookings: Booking[],
) => {
  try {
    await AsyncStorage.setItem(
      BOOKING_STORAGE_KEY,
      JSON.stringify(bookings),
    );
  } catch (error) {
    console.error(
      'Failed to save bookings:',
      error,
    );
  }
};

const loadBookings = async () => {
  try {
    const storedBookings =
      await AsyncStorage.getItem(
        BOOKING_STORAGE_KEY,
      );

    if (!storedBookings) {
      return [];
    }

    return JSON.parse(
      storedBookings,
    ) as Booking[];
  } catch (error) {
    console.error(
      'Failed to load bookings:',
      error,
    );

    return [];
  }
};

export const useBookingStore =
  create<BookingState>((set, get) => {
    // Load saved bookings
    loadBookings().then((bookings) => {
      set({ bookings });
    });

    return {
      bookings: [],

      bookConsultation: (
        doctor,
        date,
        slot,
      ) => {
        const existingBookings =
          get().bookings;

        // Prevent double booking
        const alreadyBooked =
          existingBookings.some(
            (booking) =>
              booking.doctor.id ===
                doctor.id &&
              booking.date === date &&
              booking.slot === slot &&
              booking.status ===
                'confirmed',
          );

        if (alreadyBooked) {
          return {
            success: false,
            message:
              'This slot is already booked. Please choose another slot.',
          };
        }

        const booking: Booking = {
          id: `booking-${Date.now()}`,
          doctor,
          date,
          slot,
          status: 'confirmed',
          createdAt:
            new Date().toISOString(),
        };

        const bookings = [
          ...existingBookings,
          booking,
        ];

        set({ bookings });

        saveBookings(bookings);

        return {
          success: true,
          message:
            'Consultation booked successfully.',
        };
      },

      cancelBooking: (bookingId) => {
        set((state) => {
          const bookings =
            state.bookings.map(
              (booking) =>
                booking.id === bookingId
                  ? {
                      ...booking,
                      status:
                        'cancelled' as const,
                    }
                  : booking,
            );

          saveBookings(bookings);

          return { bookings };
        });
      },

      getUpcomingBookings: () => {
        return get().bookings.filter(
          (booking) =>
            booking.status ===
            'confirmed',
        );
      },
    };
  });