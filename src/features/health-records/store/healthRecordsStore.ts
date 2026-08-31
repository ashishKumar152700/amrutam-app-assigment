import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HealthRecordType =
  | 'lab'
  | 'prescription'
  | 'consultation'
  | 'vaccination'
  | 'allergy';

export type HealthRecord = {
  id: string;
  type: HealthRecordType;
  title: string;
  description: string;
  date: string;
  tags: string[];
  attachment?: string;
};

type HealthRecordsState = {
  records: HealthRecord[];

  addRecord: (
    record: Omit<HealthRecord, 'id'>,
  ) => void;

  removeRecord: (
    recordId: string,
  ) => void;

  clearRecords: () => void;
};

const STORAGE_KEY =
  '@amrutam_health_records';

const saveRecords = async (
  records: HealthRecord[],
) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records),
    );
  } catch (error) {
    console.error(
      'Failed to save health records:',
      error,
    );
  }
};

const loadRecords = async () => {
  try {
    const stored =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    return JSON.parse(
      stored,
    ) as HealthRecord[];
  } catch (error) {
    console.error(
      'Failed to load health records:',
      error,
    );

    return [];
  }
};

const initialRecords: HealthRecord[] = [
  {
    id: 'record-1',
    type: 'lab',
    title: 'Blood Test Report',
    description:
      'Routine blood test report.',
    date: '2026-08-20',
    tags: ['Blood Test', 'Lab'],
  },

  {
    id: 'record-2',
    type: 'prescription',
    title: 'Ayurvedic Prescription',
    description:
      'Prescription provided during consultation.',
    date: '2026-08-18',
    tags: ['Medicine', 'Ayurveda'],
  },

  {
    id: 'record-3',
    type: 'vaccination',
    title: 'Vaccination Record',
    description:
      'Vaccination record added to patient history.',
    date: '2026-07-10',
    tags: ['Vaccination'],
  },

  {
    id: 'record-4',
    type: 'allergy',
    title: 'Allergy Information',
    description:
      'Patient allergy information.',
    date: '2026-06-05',
    tags: ['Allergy'],
  },
];

export const useHealthRecordsStore =
  create<HealthRecordsState>((set) => {
    loadRecords().then((records) => {
      set({
        records:
          records.length > 0
            ? records
            : initialRecords,
      });
    });

    return {
      records: initialRecords,

      addRecord: (record) => {
        set((state) => {
          const newRecord: HealthRecord = {
            ...record,
            id: `record-${Date.now()}`,
          };

          const records = [
            newRecord,
            ...state.records,
          ];

          saveRecords(records);

          return { records };
        });
      },

      removeRecord: (recordId) => {
        set((state) => {
          const records =
            state.records.filter(
              (record) =>
                record.id !== recordId,
            );

          saveRecords(records);

          return { records };
        });
      },

      clearRecords: () => {
        saveRecords([]);

        set({
          records: [],
        });
      },
    };
  });