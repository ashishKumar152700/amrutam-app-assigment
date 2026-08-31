import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import DoctorCard from '../components/DoctorCard';
import { doctors } from '../../../mocks/doctors';
import { Doctor } from '../types/doctor';
import { ConsultationStackParamList } from '../../../navigation/ConsultationNavigator';

type Props = NativeStackScreenProps<
  ConsultationStackParamList,
  'DoctorList'
>;

type GenderFilter = 'all' | 'male' | 'female';
type ExperienceFilter = 'all' | '0-5' | '5-10' | '10+';

const SPECIALIZATIONS = [
  'All',
  'Ayurvedic Physician',
  'Panchakarma Specialist',
  'Skin & Hair Specialist',
  'Digestive Health Specialist',
  'Stress & Lifestyle Specialist',
];

export default function DoctorListScreen({
  navigation,
}: Props) {
  const [search, setSearch] = useState('');

  const [filterVisible, setFilterVisible] =
    useState(false);

  const [specialization, setSpecialization] =
    useState('All');

  const [gender, setGender] =
    useState<GenderFilter>('all');

  const [experience, setExperience] =
    useState<ExperienceFilter>('all');

  const [availableToday, setAvailableToday] =
    useState(false);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      // Search
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization
          .toLowerCase()
          .includes(query) ||
        doctor.location
          .toLowerCase()
          .includes(query);

      // Specialization
      const matchesSpecialization =
        specialization === 'All' ||
        doctor.specialization === specialization;

      // Gender
      const matchesGender =
        gender === 'all' ||
        doctor.gender === gender;

      // Experience
      let matchesExperience = true;

      if (experience === '0-5') {
        matchesExperience =
          doctor.experience <= 5;
      }

      if (experience === '5-10') {
        matchesExperience =
          doctor.experience > 5 &&
          doctor.experience <= 10;
      }

      if (experience === '10+') {
        matchesExperience =
          doctor.experience > 10;
      }

      // Availability
      const matchesAvailability =
        !availableToday ||
        doctor.availableToday;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesGender &&
        matchesExperience &&
        matchesAvailability
      );
    });
  }, [
    search,
    specialization,
    gender,
    experience,
    availableToday,
  ]);

  const handleDoctorPress = useCallback(
    (doctor: Doctor) => {
      navigation.navigate('DoctorDetails', {
        doctor,
      });
    },
    [navigation],
  );

  const renderDoctor = useCallback(
    ({ item }: { item: Doctor }) => (
      <DoctorCard
        doctor={item}
        onPress={handleDoctorPress}
      />
    ),
    [handleDoctorPress],
  );

  const keyExtractor = useCallback(
    (item: Doctor) => item.id,
    [],
  );

  const resetFilters = () => {
    setSpecialization('All');
    setGender('all');
    setExperience('all');
    setAvailableToday(false);
  };

  const activeFilterCount =
    (specialization !== 'All' ? 1 : 0) +
    (gender !== 'all' ? 1 : 0) +
    (experience !== 'all' ? 1 : 0) +
    (availableToday ? 1 : 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Find an Ayurvedic Doctor
        </Text>

        <Text style={styles.subtitle}>
          Choose from our experienced specialists
        </Text>

        {/* Search */}

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search doctor, speciality or city..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          returnKeyType="search"
        />

        {/* Filter Button */}

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.filterButtonText}>
            ⚙ Filters
          </Text>

          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Result count */}

      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredDoctors.length.toLocaleString()} doctors
        </Text>
      </View>

      {/* Doctor List */}

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctor}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No doctors found
            </Text>

            <Text style={styles.emptyText}>
              Try changing your search or filters.
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setFilterVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filters
              </Text>

              <Pressable
                onPress={() =>
                  setFilterVisible(false)
                }
              >
                <Text style={styles.closeText}>
                  ✕
                </Text>
              </Pressable>
            </View>

            {/* Specialization */}

            <Text style={styles.sectionTitle}>
              Specialization
            </Text>

            <View style={styles.optionsContainer}>
              {SPECIALIZATIONS.map((item) => {
                const selected =
                  specialization === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.option,
                      selected &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setSpecialization(item)
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Gender */}

            <Text style={styles.sectionTitle}>
              Gender
            </Text>

            <View style={styles.row}>
              {[
                { label: 'All', value: 'all' },
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ].map((item) => {
                const selected =
                  gender === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.smallOption,
                      selected &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setGender(
                        item.value as GenderFilter,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Experience */}

            <Text style={styles.sectionTitle}>
              Experience
            </Text>

            <View style={styles.row}>
              {[
                { label: 'All', value: 'all' },
                { label: '0–5 years', value: '0-5' },
                { label: '5–10 years', value: '5-10' },
                { label: '10+ years', value: '10+' },
              ].map((item) => {
                const selected =
                  experience === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.smallOption,
                      selected &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setExperience(
                        item.value as ExperienceFilter,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Availability */}

            <TouchableOpacity
              style={styles.availabilityRow}
              onPress={() =>
                setAvailableToday(
                  (value) => !value,
                )
              }
            >
              <View
                style={[
                  styles.checkbox,
                  availableToday &&
                    styles.checkboxSelected,
                ]}
              >
                {availableToday && (
                  <Text style={styles.checkmark}>
                    ✓
                  </Text>
                )}
              </View>

              <Text style={styles.availabilityText}>
                Available Today
              </Text>
            </TouchableOpacity>

            {/* Buttons */}

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetText}>
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() =>
                  setFilterVisible(false)
                }
              >
                <Text style={styles.applyText}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },

  searchInput: {
    height: 48,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    color: '#222',
  },

  filterButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  filterButtonText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 14,
  },

  filterBadge: {
    marginLeft: 8,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  resultText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },

  empty: {
    alignItems: 'center',
    padding: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#777',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  closeText: {
    fontSize: 20,
    color: '#555',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 12,
    marginBottom: 10,
  },

  optionsContainer: {
    gap: 8,
  },

  option: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  selectedOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },

  optionText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },

  selectedOptionText: {
    color: '#2E7D32',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  smallOption: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  availabilityText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  bottomButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
  },

  resetText: {
    color: '#2E7D32',
    fontWeight: '700',
  },

  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },

  applyText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});