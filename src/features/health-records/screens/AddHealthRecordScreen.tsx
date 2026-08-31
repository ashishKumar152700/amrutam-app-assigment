import React, { useState } from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';

import {
  HealthRecordType,
  useHealthRecordsStore,
} from '../store/healthRecordsStore';

const recordTypes: {
  label: string;
  value: HealthRecordType;
  icon: string;
}[] = [
  {
    label: 'Lab',
    value: 'lab',
    icon: '🧪',
  },
  {
    label: 'Prescription',
    value: 'prescription',
    icon: '💊',
  },
  {
    label: 'Consultation',
    value: 'consultation',
    icon: '👨‍⚕️',
  },
  {
    label: 'Vaccination',
    value: 'vaccination',
    icon: '💉',
  },
  {
    label: 'Allergy',
    value: 'allergy',
    icon: '⚠️',
  },
];

export default function AddHealthRecordScreen({
  navigation,
}: any) {
  const addRecord = useHealthRecordsStore(
    (state) => state.addRecord,
  );

  const [type, setType] =
    useState<HealthRecordType>('lab');

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10),
    );

  const [tags, setTags] =
    useState('');

  const [attachment, setAttachment] =
    useState<{
      name: string;
      uri: string;
      mimeType?: string;
    } | null>(null);

  const pickAttachment = async () => {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: [
            'application/pdf',
            'image/*',
          ],
          copyToCacheDirectory: true,
        });

      if (
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const file = result.assets[0];

      setAttachment({
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
      });
    } catch (error) {
      console.error(
        'Attachment error:',
        error,
      );

      Alert.alert(
        'Attachment Error',
        'Unable to select the attachment.',
      );
    }
  };

  const saveRecord = () => {
    if (!title.trim()) {
      Alert.alert(
        'Missing Title',
        'Please enter a record title.',
      );

      return;
    }

    if (!description.trim()) {
      Alert.alert(
        'Missing Description',
        'Please enter a short description.',
      );

      return;
    }

    if (!date.trim()) {
      Alert.alert(
        'Missing Date',
        'Please enter the record date.',
      );

      return;
    }

    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    addRecord({
      type,
      title: title.trim(),
      description:
        description.trim(),
      date: date.trim(),
      tags: parsedTags,
      attachment:
        attachment?.uri,
    });

    Alert.alert(
      'Record Added 🎉',
      'Your health record has been added successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    );
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

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Add Health Record
        </Text>

        <Text style={styles.subtitle}>
          Add your health information to
          the patient timeline.
        </Text>

        {/* Record Type */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            Record Type
          </Text>

          <View style={styles.typeGrid}>
            {recordTypes.map(
              (recordType) => {
                const selected =
                  type ===
                  recordType.value;

                return (
                  <TouchableOpacity
                    key={
                      recordType.value
                    }
                    onPress={() =>
                      setType(
                        recordType.value,
                      )
                    }
                    style={[
                      styles.typeButton,
                      selected &&
                        styles.selectedType,
                    ]}
                  >
                    <Text
                      style={
                        styles.typeIcon
                      }
                    >
                      {
                        recordType.icon
                      }
                    </Text>

                    <Text
                      style={[
                        styles.typeText,
                        selected &&
                          styles.selectedTypeText,
                      ]}
                    >
                      {
                        recordType.label
                      }
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </View>

        {/* Details */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            Record Details
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Record title"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TextInput
            value={description}
            onChangeText={
              setDescription
            }
            placeholder="Description"
            placeholderTextColor="#999"
            multiline
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
          />

          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="Tags (comma separated)"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <Text style={styles.example}>
            Example: Blood Test, Diabetes,
            Routine
          </Text>
        </View>

        {/* Attachment */}

        <View style={styles.card}>
          <Text style={styles.heading}>
            Attachment
          </Text>

          {attachment ? (
            <View
              style={styles.fileBox}
            >
              <Text
                style={styles.fileIcon}
              >
                📎
              </Text>

              <View
                style={styles.fileInfo}
              >
                <Text
                  style={styles.fileName}
                  numberOfLines={2}
                >
                  {attachment.name}
                </Text>

                <Text
                  style={styles.fileType}
                >
                  Attachment selected
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setAttachment(null)
                }
              >
                <Text
                  style={
                    styles.removeFile
                  }
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={
                styles.attachmentButton
              }
              onPress={
                pickAttachment
              }
              activeOpacity={0.8}
            >
              <Text
                style={
                  styles.attachmentIcon
                }
              >
                📎
              </Text>

              <Text
                style={
                  styles.attachmentTitle
                }
              >
                Add PDF or Image
              </Text>

              <Text
                style={
                  styles.attachmentSubtitle
                }
              >
                Lab reports,
                prescriptions, etc.
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Save */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveRecord}
          activeOpacity={0.8}
        >
          <Text
            style={styles.saveText}
          >
            Save Health Record
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
    padding: 20,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 12,
  },

  backText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1B5E20',
  },

  subtitle: {
    marginTop: 5,
    marginBottom: 18,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 13,
  },

  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  typeButton: {
    width: '31%',
    minHeight: 75,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },

  selectedType: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },

  typeIcon: {
    fontSize: 22,
  },

  typeText: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
  },

  selectedTypeText: {
    color: '#1B5E20',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 11,
    paddingHorizontal: 14,
    marginTop: 10,
    color: '#222',
    backgroundColor: '#FAFAFA',
  },

  descriptionInput: {
    height: 90,
    paddingTop: 13,
    textAlignVertical: 'top',
  },

  example: {
    marginTop: 7,
    fontSize: 11,
    color: '#999',
  },

  attachmentButton: {
    minHeight: 125,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B8CDB8',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBF8',
  },

  attachmentIcon: {
    fontSize: 28,
  },

  attachmentTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },

  attachmentSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F7F1',
    borderRadius: 12,
    padding: 12,
  },

  fileIcon: {
    fontSize: 25,
  },

  fileInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },

  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },

  fileType: {
    marginTop: 3,
    fontSize: 11,
    color: '#777',
  },

  removeFile: {
    fontSize: 18,
    color: '#D32F2F',
    padding: 5,
  },

  saveButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});