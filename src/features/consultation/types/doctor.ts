export type DoctorGender = 'male' | 'female';

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  gender: DoctorGender;
  languages: string[];
  location: string;
  image: string;
  availableToday: boolean;
  nextAvailableSlot: string;
};