import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/student/home';
import MoodCheckInScreen from '../screens/student/mood-checkin';
import MoodResultScreen from '../screens/student/checkin-result';
import ResourcesScreen from '../screens/student/wellness-resources';
import ResourceDetailsScreen from '../screens/student/resource-details';
import CounselorListScreen from '../screens/student/counselor-search';
import CounselorProfileScreen from '../screens/student/counselor-details';
import AvailabilityScreen from '../screens/student/availability';
import BookAppointmentScreen from '../screens/student/book-appointment';
import ReviewBookingScreen from '../screens/student/booking-review';
import BookingConfirmedScreen from '../screens/student/booking-confirmation';
import AppointmentDetailsScreen from '../screens/student/appointment-details';
import MySessionsScreen from '../screens/student/my-appointments';
import ProfileScreen from '../screens/student/profile';
import EditProfileScreen from '../screens/student/edit-profile';
import SettingsScreen from '../screens/student/settings';
import SecurityScreen from '../screens/student/security';
import ChangePasswordScreen from '../screens/student/change-password';
import PrivacyInformationScreen from '../screens/student/privacy-information';
import MentalHealthTipsScreen from '../screens/student/mental-health-tips';
import WellbeingCheckScreen from '../screens/student/wellbeing-check';
import WellbeingRecommendationScreen from '../screens/student/wellbeing-recommendation';
import { tabScreenOptions } from './TabHelpers';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const MoodStack = createNativeStackNavigator();
const CounselorsStack = createNativeStackNavigator();
const SessionsStack = createNativeStackNavigator();
const ResourcesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="MentalHealthTips" component={MentalHealthTipsScreen} />
    <HomeStack.Screen name="ResourceDetails" component={ResourceDetailsScreen} />
    <HomeStack.Screen name="WellbeingCheck" component={WellbeingCheckScreen} />
    <HomeStack.Screen name="WellbeingRecommendation" component={WellbeingRecommendationScreen} />
  </HomeStack.Navigator>
);

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
    <CounselorsStack.Screen name="BookAppointment" component={BookAppointmentScreen} />
    <CounselorsStack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
    <CounselorsStack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
    <CounselorsStack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
  </CounselorsStack.Navigator>
);

const SessionsStackScreen = () => (
  <SessionsStack.Navigator screenOptions={{ headerShown: false }}>
    <SessionsStack.Screen name="MySessions" component={MySessionsScreen} />
    <SessionsStack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
    <SessionsStack.Screen name="Availability" component={AvailabilityScreen} />
    <SessionsStack.Screen name="BookAppointment" component={BookAppointmentScreen} />
    <SessionsStack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
    <SessionsStack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
  </SessionsStack.Navigator>
);

const ResourcesStackScreen = () => (
  <ResourcesStack.Navigator screenOptions={{ headerShown: false }}>
    <ResourcesStack.Screen name="ResourcesList" component={ResourcesScreen} />
    <ResourcesStack.Screen name="ResourceDetails" component={ResourceDetailsScreen} />
  </ResourcesStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="Security" component={SecurityScreen} />
    <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <ProfileStack.Screen name="PrivacyInformation" component={PrivacyInformationScreen} />
  </ProfileStack.Navigator>
);

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabScreenOptions('', route.name),
      })}
    >
      <Tab.Screen name="Home"       component={HomeStackScreen}      options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Mood"       component={MoodStackScreen}      options={{ tabBarLabel: 'Check-In' }} />
      <Tab.Screen name="Counselors" component={CounselorsStackScreen} options={{ tabBarLabel: 'Counselors' }} />
      <Tab.Screen name="Sessions"   component={SessionsStackScreen}  options={{ tabBarLabel: 'Sessions' }} />
      <Tab.Screen name="Resources"  component={ResourcesStackScreen} options={{ tabBarLabel: 'Resources' }} />
      <Tab.Screen name="Profile"    component={ProfileStackScreen}   options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
