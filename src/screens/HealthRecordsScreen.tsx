
import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useBookingStore } from '../features/consultation/store/bookingStore';

import {
  HealthRecord,
  HealthRecordType,
  useHealthRecordsStore,
} from '../features/health-records/store/healthRecordsStore';

const filters: {
  label: string;
  value: 'all' | HealthRecordType;
}[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Lab',
    value: 'lab',
  },
  {
    label: 'Prescription',
    value: 'prescription',
  },
  {
    label: 'Consultation',
    value: 'consultation',
  },
  {
    label: 'Vaccination',
    value: 'vaccination',
  },
  {
    label: 'Allergy',
    value: 'allergy',
  },
];

const getRecordIcon = (
  type: HealthRecordType,
) => {
  switch (type) {
    case 'lab':
      return '🧪';

    case 'prescription':
      return '💊';

    case 'consultation':
      return '👨‍⚕️';

    case 'vaccination':
      return '💉';

    case 'allergy':
      return '⚠️';

    default:
      return '📄';
  }
};

const getRecordLabel = (
  type: HealthRecordType,
) => {
  switch (type) {
    case 'lab':
      return 'Lab Report';

    case 'prescription':
      return 'Prescription';

    case 'consultation':
      return 'Consultation';

    case 'vaccination':
      return 'Vaccination';

    case 'allergy':
      return 'Allergy';

    default:
      return 'Health Record';
  }
};

const formatDate = (date: string) => {
  return new Date(
    `${date}T00:00:00`,
  ).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getMonthYear = (date: string) => {
  return new Date(
    `${date}T00:00:00`,
  ).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
};

export default function HealthRecordsScreen({
  navigation,
}: any) {

    
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState<'all' | HealthRecordType>('all');

  const [generating, setGenerating] =
    useState(false);

  const records = useHealthRecordsStore(
    (state) => state.records,
  );

  const bookings = useBookingStore(
    (state) => state.bookings,
  );

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status === 'confirmed',
    );

  /*
   * Add consultation bookings to timeline.
   */
  const consultationRecords =
    useMemo<HealthRecord[]>(() => {
      return confirmedBookings.map(
        (booking) => ({
          id: `consultation-${booking.id}`,
          type: 'consultation',
          title: `Consultation with ${booking.doctor.name}`,
          description:
            `${booking.doctor.specialization} consultation at ${booking.doctor.location}.`,
          date:
            booking.createdAt.slice(0, 10),
          tags: [
            'Doctor',
            'Consultation',
            booking.doctor.specialization,
          ],
        }),
      );
    }, [confirmedBookings]);

  /*
   * Combine health records + consultations.
   */
  const allRecords = useMemo(() => {
    const combined = [
      ...records,
      ...consultationRecords,
    ];

    return combined.sort(
      (a, b) =>
        new Date(
          b.date,
        ).getTime() -
        new Date(
          a.date,
        ).getTime(),
    );
  }, [
    records,
    consultationRecords,
  ]);

  /*
   * Search + filter.
   */
  const filteredRecords = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return allRecords.filter(
      (record) => {
        const matchesFilter =
          selectedFilter === 'all' ||
          record.type === selectedFilter;

        if (!matchesFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return (
          record.title
            .toLowerCase()
            .includes(query) ||
          record.description
            .toLowerCase()
            .includes(query) ||
          record.tags.some((tag) =>
            tag
              .toLowerCase()
              .includes(query),
          )
        );
      },
    );
  }, [
    allRecords,
    search,
    selectedFilter,
  ]);

  /*
   * Group records by Month / Year.
   */
  const groupedRecords = useMemo(() => {
    const groups: Record<
      string,
      HealthRecord[]
    > = {};

    filteredRecords.forEach(
      (record) => {
        const group =
          getMonthYear(record.date);

        if (!groups[group]) {
          groups[group] = [];
        }

        groups[group].push(record);
      },
    );

    return groups;
  }, [filteredRecords]);

  const generatePDF = async () => {
    try {
      setGenerating(true);

      const consultationHTML =
        confirmedBookings.length > 0
          ? confirmedBookings
              .map(
                (booking) => `
                  <div class="section">
                    <div class="section-title">
                      Consultation
                    </div>

                    <div class="row">
                      <strong>Doctor:</strong>
                      ${booking.doctor.name}
                    </div>

                    <div class="row">
                      <strong>Specialization:</strong>
                      ${booking.doctor.specialization}
                    </div>

                    <div class="row">
                      <strong>Date:</strong>
                      ${booking.date}
                    </div>

                    <div class="row">
                      <strong>Time:</strong>
                      ${booking.slot}
                    </div>

                    <div class="row">
                      <strong>Location:</strong>
                      ${booking.doctor.location}
                    </div>

                    <div class="row">
                      <strong>Consultation Fee:</strong>
                      ₹${booking.doctor.consultationFee}
                    </div>

                    <div class="status">
                      ✓ Confirmed
                    </div>
                  </div>
                `,
              )
              .join('')
          : `
              <div class="text">
                No confirmed consultation records
                have been added yet.
              </div>
            `;

      const recordsHTML =
        filteredRecords.length > 0
          ? filteredRecords
              .map(
                (record) => `
                  <div class="section">
                    <div class="section-title">
                      ${getRecordLabel(
                        record.type,
                      )}
                    </div>

                    <div class="row">
                      <strong>Title:</strong>
                      ${record.title}
                    </div>

                    <div class="row">
                      <strong>Date:</strong>
                      ${formatDate(
                        record.date,
                      )}
                    </div>

                    <div class="row">
                      <strong>Description:</strong>
                      ${record.description}
                    </div>

                    <div class="row">
                      <strong>Tags:</strong>
                      ${record.tags.join(
                        ', ',
                      )}
                    </div>
                  </div>
                `,
              )
              .join('')
          : `
              <div class="text">
                No health records found.
              </div>
            `;

      const html = `
        <!DOCTYPE html>

        <html>
          <head>
            <meta
              name="viewport"
              content="width=device-width,
              initial-scale=1.0"
            />

            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 30px;
                color: #222;
              }

              .header {
                text-align: center;
                margin-bottom: 30px;
              }

              .title {
                color: #1B5E20;
                font-size: 28px;
                font-weight: bold;
              }

              .subtitle {
                color: #666;
                font-size: 14px;
                margin-top: 8px;
              }

              .section {
                border: 1px solid #ddd;
                border-radius: 12px;
                padding: 18px;
                margin-bottom: 18px;
              }

              .section-title {
                color: #1B5E20;
                font-size: 19px;
                font-weight: bold;
                margin-bottom: 10px;
              }

              .text {
                color: #555;
                font-size: 14px;
                line-height: 1.6;
              }

              .row {
                color: #555;
                font-size: 14px;
                line-height: 1.8;
              }

              .status {
                margin-top: 12px;
                padding: 8px;
                background: #E8F5E9;
                color: #2E7D32;
                border-radius: 6px;
                font-weight: bold;
              }

              .footer {
                margin-top: 30px;
                text-align: center;
                color: #888;
                font-size: 12px;
              }
            </style>
          </head>

          <body>

            <div class="header">
              <div class="title">
                Amrutam
              </div>

              <div class="subtitle">
                Health Records
              </div>
            </div>

            <div class="section">
              <div class="section-title">
                Patient Timeline
              </div>

              <div class="text">
                Complete health history and
                wellness information.
              </div>
            </div>

            ${recordsHTML}

            <div class="section">
              <div class="section-title">
                Consultation Records
              </div>

              ${consultationHTML}
            </div>

            <div class="footer">
              Generated by Amrutam
            </div>

          </body>
        </html>
      `;

      const { uri } =
        await Print.printToFileAsync({
          html,
        });

      const sharingAvailable =
        await Sharing.isAvailableAsync();

      if (!sharingAvailable) {
        Alert.alert(
          'PDF Created',
          'The health records PDF was generated successfully.',
        );

        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle:
          'Share Amrutam Health Records',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error(
        'PDF generation error:',
        error,
      );

      Alert.alert(
        'PDF Error',
        'Unable to generate the health records PDF.',
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Header */}

       <Text style={styles.title}>
  Health Records
</Text>

<Text style={styles.subtitle}>
  Your complete health history
  in one place.
</Text>

<TouchableOpacity
  style={styles.addButton}
  onPress={() =>
    navigation.navigate('AddHealthRecord')
  }
  activeOpacity={0.8}
>
  <Text style={styles.addButtonText}>
    + Add Health Record
  </Text>
</TouchableOpacity>

        {/* Search */}

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>
            🔍
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search records, tags..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
            >
              <Text style={styles.clearText}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.filterRow
          }
        >
          {filters.map((filter) => {
            const selected =
              selectedFilter ===
              filter.value;

            return (
              <TouchableOpacity
                key={filter.value}
                onPress={() =>
                  setSelectedFilter(
                    filter.value,
                  )
                }
                style={[
                  styles.filterButton,
                  selected &&
                    styles.selectedFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected &&
                      styles.selectedFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Record Count */}

        <Text style={styles.resultCount}>
          {filteredRecords.length}{' '}
          {filteredRecords.length === 1
            ? 'record'
            : 'records'}{' '}
          found
        </Text>

        {/* Timeline */}

        {Object.keys(groupedRecords)
          .length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              📂
            </Text>

            <Text style={styles.emptyTitle}>
              No Records Found
            </Text>

            <Text style={styles.emptyText}>
              Try a different search or
              filter.
            </Text>
          </View>
        ) : (
          Object.entries(
            groupedRecords,
          ).map(
            ([
              month,
              monthRecords,
            ]) => (
              <View
                key={month}
                style={styles.monthSection}
              >
                <Text
                  style={styles.monthTitle}
                >
                  {month}
                </Text>

                {monthRecords.map(
                  (record) => (
                    <View
                      key={record.id}
                      style={styles.timelineRow}
                    >
                      {/* Timeline */}

                      <View
                        style={
                          styles.timelineColumn
                        }
                      >
                        <View
                          style={
                            styles.timelineDot
                          }
                        />

                        <View
                          style={
                            styles.timelineLine
                          }
                        />
                      </View>

                      {/* Record */}

                      <View
                        style={
                          styles.recordCard
                        }
                      >
                        <View
                          style={
                            styles.recordHeader
                          }
                        >
                          <View
                            style={
                              styles.iconBox
                            }
                          >
                            <Text
                              style={
                                styles.iconText
                              }
                            >
                              {getRecordIcon(
                                record.type,
                              )}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.recordHeaderInfo
                            }
                          >
                            <Text
                              style={
                                styles.recordType
                              }
                            >
                              {getRecordLabel(
                                record.type,
                              )}
                            </Text>

                            <Text
                              style={
                                styles.recordDate
                              }
                            >
                              {formatDate(
                                record.date,
                              )}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={
                            styles.recordTitle
                          }
                        >
                          {record.title}
                        </Text>

                        <Text
                          style={
                            styles.recordDescription
                          }
                        >
                          {record.description}
                        </Text>

                        {/* Tags */}

                        <View
                          style={
                            styles.tagsRow
                          }
                        >
                          {record.tags.map(
                            (tag) => (
                              <View
                                key={tag}
                                style={
                                  styles.tag
                                }
                              >
                                <Text
                                  style={
                                    styles.tagText
                                  }
                                >
                                  #{tag}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>

                        {/* Attachment */}

                        {record.attachment && (
                          <TouchableOpacity
                            style={
                              styles.attachmentButton
                            }
                            onPress={() =>
                              Alert.alert(
                                'Attachment',
                                'Attachment preview will open here.',
                              )
                            }
                          >
                            <Text
                              style={
                                styles.attachmentText
                              }
                            >
                              📎 View Attachment
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ),
                )}
              </View>
            ),
          )
        )}

        {/* Consultation Summary */}

        <View style={styles.summaryCard}>
          <Text
            style={styles.summaryTitle}
          >
            Consultation Records
          </Text>

          {confirmedBookings.length ===
          0 ? (
            <Text style={styles.cardText}>
              No confirmed consultations
              yet.
            </Text>
          ) : (
            <>
              <Text
                style={
                  styles.bookingCount
                }
              >
                {confirmedBookings.length}{' '}
                confirmed consultation
                {confirmedBookings.length >
                1
                  ? 's'
                  : ''}
              </Text>

              {confirmedBookings.map(
                (booking) => (
                  <View
                    key={booking.id}
                    style={
                      styles.bookingPreview
                    }
                  >
                    <Text
                      style={
                        styles.bookingDoctor
                      }
                    >
                      {booking.doctor.name}
                    </Text>

                    <Text
                      style={
                        styles.bookingDetail
                      }
                    >
                      {booking.date} •{' '}
                      {booking.slot}
                    </Text>

                    <Text
                      style={
                        styles.bookingDetail
                      }
                    >
                      ₹
                      {
                        booking.doctor
                          .consultationFee
                      }
                    </Text>
                  </View>
                ),
              )}
            </>
          )}
        </View>

        {/* PDF */}

        <View style={styles.pdfCard}>
          <View style={styles.pdfIcon}>
            <Text
              style={styles.pdfIconText}
            >
              📄
            </Text>
          </View>

          <View style={styles.pdfInfo}>
            <Text style={styles.pdfTitle}>
              Health Records PDF
            </Text>

            <Text
              style={
                styles.pdfDescription
              }
            >
              Generate and share your
              health history with your
              doctor.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.generateButton,
            generating &&
              styles.disabledButton,
          ]}
          onPress={generatePDF}
          disabled={generating}
          activeOpacity={0.8}
        >
          {generating ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
                size="small"
              />

              <Text
                style={styles.buttonText}
              >
                Generating PDF...
              </Text>
            </>
          ) : (
            <Text
              style={styles.buttonText}
            >
              Generate & Share PDF
            </Text>
          )}
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
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },

  searchBox: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },

  clearText: {
    fontSize: 15,
    color: '#777',
    padding: 5,
  },

  filterRow: {
    paddingVertical: 14,
    gap: 8,
  },
addButton: {
  backgroundColor: '#2E7D32',
  borderRadius: 13,
  paddingVertical: 14,
  alignItems: 'center',
  marginBottom: 16,
},

addButtonText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '700',
},
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE5DD',
  },

  selectedFilter: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  filterText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },

  selectedFilterText: {
    color: '#FFFFFF',
  },

  resultCount: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
    marginBottom: 12,
  },

  monthSection: {
    marginBottom: 8,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 10,
  },

  timelineRow: {
    flexDirection: 'row',
  },

  timelineColumn: {
    width: 24,
    alignItems: 'center',
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E7D32',
    marginTop: 20,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#C8DCC8',
    marginTop: 4,
  },

  recordCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginLeft: 7,
    elevation: 2,
  },

  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 23,
  },

  recordHeaderInfo: {
    flex: 1,
    marginLeft: 11,
  },

  recordType: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
  },

  recordDate: {
    marginTop: 3,
    fontSize: 12,
    color: '#888',
  },

  recordTitle: {
    marginTop: 13,
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  recordDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#666',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },

  tag: {
    backgroundColor: '#F1F7F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  tagText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },

  attachmentButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 7,
  },

  attachmentText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },

  summaryCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666',
  },

  bookingCount: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },

  bookingPreview: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    marginTop: 5,
  },

  bookingDoctor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },

  bookingDetail: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },

  pdfCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  pdfIcon: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pdfIconText: {
    fontSize: 27,
  },

  pdfInfo: {
    flex: 1,
    marginLeft: 14,
  },

  pdfTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  pdfDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: '#777',
  },

  generateButton: {
    marginTop: 18,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    padding: 40,
  },

  emptyIcon: {
    fontSize: 45,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
  },

  emptyText: {
    marginTop: 7,
    color: '#777',
    textAlign: 'center',
  },
});