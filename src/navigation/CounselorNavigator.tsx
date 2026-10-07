import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/counselor/DashboardScreen';
import AppointmentsScreen from '../screens/counselor/AppointmentsScreen';
import StudentListScreen from '../screens/counselor/StudentListScreen';
import StudentSessionScreen from '../screens/counselor/StudentSessionScreen';
import MessagesScreen from '../screens/counselor/MessagesScreen';
import StudentChatScreen from '../screens/counselor/StudentChatScreen';
import AvailabilityScreen from '../screens/counselor/AvailabilityScreen';
import VideoSessionScreen from '../screens/counselor/VideoSessionScreen';
import ProfileScreen from '../screens/counselor/ProfileScreen';
import EditProfileScreen from '../screens/counselor/EditProfileScreen';
import { colors } from '../theme';
import { tabScreenOptions } from './TabHelpers';

const Tab = createBottomTabNavigator();
const StudentsStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const StudentsStackScreen = () => (
  <StudentsStack.Navigator screenOptions={{ headerShown: false }}>
    <StudentsStack.Screen name="StudentList" component={StudentListScreen} />
    <StudentsStack.Screen name="StudentSession" component={StudentSessionScreen} />
  </StudentsStack.Navigator>
);

const MessagesStackScreen = () => (
  <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
    <MessagesStack.Screen name="Messages" component={MessagesScreen} />
    <MessagesStack.Screen name="StudentChat" component={StudentChatScreen} />
  </MessagesStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
  </ProfileStack.Navigator>
);

const CounselorNavigator = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const icons: Record<string, string> = {
            Dashboard: '📊',
            Appointments: '📅',
            Students: '👥',
            Messages: '💬',
            Profile: '👤',
          };
          return {
            ...tabScreenOptions(icons[route.name] || '📊'),
            contentStyle: { backgroundColor: colors.creamBackground },
          };
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} />
        <Tab.Screen name="Students" component={StudentsStackScreen} />
        <Tab.Screen name="Messages" component={MessagesStackScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
});

export default CounselorNavigator;