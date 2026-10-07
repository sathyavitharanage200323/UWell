import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import ProfileScreen from '../screens/student/ProfileScreen';
import { tabScreenOptions } from './TabHelpers';

const Tab = createBottomTabNavigator();
const MoodStack = createNativeStackNavigator();
const CounselorsStack = createNativeStackNavigator();
const SessionsStack = createNativeStackNavigator();

const MoodStackScreen = () => (
  <MoodStack.Navigator screenOptions={{ headerShown: false }}>
    <MoodStack.Screen name="MoodCheckIn" component={MoodCheckInScreen} />
    <MoodStack.Screen name="MoodResult" component={MoodResultScreen} />
  </MoodStack.Navigator>
);

const CounselorsStackScreen = () => (
  <CounselorsStack.Navigator screenOptions={{ headerShown: false }}>
    <CounselorsStack.Screen name="CounselorList" component={CounselorListScreen} />
    <CounselorsStack.Screen name="CounselorProfile" component={CounselorProfileScreen} />
    <CounselorsStack.Screen name="Availability" component={AvailabilityScreen} />
  </CounselorsStack.Navigator>
);

const SessionsStackScreen = () => (
  <SessionsStack.Navigator screenOptions={{ headerShown: false }}>
    <SessionsStack.Screen name="MySessions" component={MySessionsScreen} />
    <SessionsStack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
    <SessionsStack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
    <SessionsStack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
  </SessionsStack.Navigator>
);

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icons: Record<string, string> = {
          Home: '🏠',
          Mood: '😊',
          Counselors: '👥',
          Sessions: '📅',
          Resources: '📚',
          Profile: '👤',
        };
        return tabScreenOptions(icons[route.name] || '🏠');
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodStackScreen} />
      <Tab.Screen name="Counselors" component={CounselorsStackScreen} />
      <Tab.Screen name="Sessions" component={SessionsStackScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;