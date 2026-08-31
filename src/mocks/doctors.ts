import { Doctor } from '../features/consultation/types/doctor';

const names = [
  'Dr. Aarav Sharma',
  'Dr. Ananya Patel',
  'Dr. Rohan Mehta',
  'Dr. Priya Singh',
  'Dr. Arjun Verma',
  'Dr. Kavya Nair',
];

const specializations = [
  'Ayurvedic Physician',
  'Panchakarma Specialist',
  'Skin & Hair Specialist',
  'Digestive Health Specialist',
  'Stress & Lifestyle Specialist',
];

const locations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Pune',
  'Hyderabad',
  'Chennai',
];

const languages = [
  'Hindi',
  'English',
  'Marathi',
  'Tamil',
  'Telugu',
];

export const doctors: Doctor[] = Array.from(
  { length: 5000 },
  (_, index) => {
    const name = names[index % names.length];

    return {
      id: `doctor-${index + 1}`,

      name,

      specialization:
        specializations[index % specializations.length],

      experience: 3 + (index % 18),

      rating: Number(
        (4 + ((index % 10) / 10)).toFixed(1)
      ),

      reviewCount: 50 + (index % 950),

      consultationFee: 399 + (index % 5) * 100,

      gender:
        index % 2 === 0
          ? 'male'
          : 'female',

      languages: [
        languages[index % languages.length],
        'English',
      ],

      location:
        locations[index % locations.length],

      image:
        `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,

      availableToday:
        index % 3 !== 0,

      nextAvailableSlot:
        index % 3 === 0
          ? 'Tomorrow, 10:00 AM'
          : 'Today, 4:30 PM',
    };
  }
);