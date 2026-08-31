import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DoctorListScreen from '../features/consultation/screens/DoctorListScreen';
import DoctorDetailsScreen from '../features/consultation/screens/DoctorDetailsScreen';
import { Doctor } from '../features/consultation/types/doctor';

export type ConsultationStackParamList = {
  DoctorList: undefined;

  DoctorDetails: {
    doctor: Doctor;
  };
};

const Stack =
  createNativeStackNavigator<ConsultationStackParamList>();

export default function ConsultationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorList"
        component={DoctorListScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}