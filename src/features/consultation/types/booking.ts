import { Doctor } from './doctor';

export type BookingStatus = 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  doctor: Doctor;
  date: string;
  slot: string;
  status: BookingStatus;
  createdAt: string;
};