import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/management/DashboardScreen';
import AppointmentsScreen from '../screens/management/AppointmentsScreen';
import UsageDetailsScreen from '../screens/management/UsageDetailsScreen';
import UsageReportScreen from '../screens/management/UsageReportScreen';
import ProfileScreen from '../screens/management/ProfileScreen';
import PrivacySecurityScreen from '../screens/management/PrivacySecurityScreen';
import { tabScreenOptions } from './TabHelpers';

const Tab = createBottomTabNavigator();
const UsageStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const UsageStackScreen = () => (
  <UsageStack.Navigator screenOptions={{ headerShown: false }}>
    <UsageStack.Screen name="UsageReport" component={UsageReportScreen} />
    <UsageStack.Screen name="UsageDetails" component={UsageDetailsScreen} />
  </UsageStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
  </ProfileStack.Navigator>
);

const ManagementNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icons: Record<string, string> = {
          Dashboard: '📊',
          Appointments: '📅',
          Usage: '📈',
          Profile: '👤',
          Settings: '⚙️',
        };
        return tabScreenOptions(icons[route.name] || '📊');
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Usage" component={UsageStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
      <Tab.Screen name="Settings" component={PrivacySecurityScreen} />
    </Tab.Navigator>
  );
};

export default ManagementNavigator;