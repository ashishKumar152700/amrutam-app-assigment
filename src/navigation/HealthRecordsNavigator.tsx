import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HealthRecordsScreen from '../screens/HealthRecordsScreen';
import AddHealthRecordScreen from '../features/health-records/screens/AddHealthRecordScreen';

export type HealthRecordsStackParamList = {
  HealthRecords: undefined;
  AddHealthRecord: undefined;
};

const Stack =
  createNativeStackNavigator<HealthRecordsStackParamList>();

export default function HealthRecordsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{
          title: 'Add Health Record',
        }}
      />
    </Stack.Navigator>
  );
}