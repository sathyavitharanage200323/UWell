import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import HomeScreen from '../screens/student/HomeScreen';
import MoodCheckInScreen from '../screens/student/MoodCheckInScreen';
import MoodResultScreen from '../screens/student/MoodResultScreen';
import ResourcesScreen from '../screens/student/ResourcesScreen';
import CounselorListScreen from '../screens/student/CounselorListScreen';
import CounselorProfileScreen from '../screens/student/CounselorProfileScreen';
import AvailabilityScreen from '../screens/student/AvailabilityScreen';
import AppointmentDetailsScreen from '../screens/student/AppointmentDetailsScreen';
import ReviewBookingScreen from '../screens/student/ReviewBookingScreen';
import BookingConfirmedScreen from '../screens/student/BookingConfirmedScreen';
import MySessionsScreen from '../screens/student/MySessionsScreen';
import BottomTab from '../components/navigation/BottomTab';

const Stack = createNativeStackNavigator();

const studentTabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'mood', label: 'Mood', icon: '😊' },
  { id: 'counselors', label: 'Counselors', icon: '👥' },
  { id: 'sessions', label: 'Sessions', icon: '📅' },
  { id: 'resources', label: 'Resources', icon: '📚' }
];

const StudentNavigator = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MoodCheckIn" component={MoodCheckInScreen} />
        <Stack.Screen name="MoodResult" component={MoodResultScreen} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
        <Stack.Screen name="CounselorList" component={CounselorListScreen} />
        <Stack.Screen name="CounselorProfile" component={CounselorProfileScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
        <Stack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
        <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
        <Stack.Screen name="MySessions" component={MySessionsScreen} />
      </Stack.Navigator>
      <BottomTab tabs={studentTabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

export default StudentNavigator;
