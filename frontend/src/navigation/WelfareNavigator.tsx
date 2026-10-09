import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/welfare/DashboardScreen';
import NotificationsScreen from '../screens/welfare/NotificationsScreen';
import AppointmentsScreen from '../screens/welfare/AppointmentsScreen';
import AppointmentDetailsScreen from '../screens/welfare/AppointmentDetailsScreen';
import ServicesScreen from '../screens/welfare/ServicesScreen';
import ServiceDetailsScreen from '../screens/welfare/ServiceDetailsScreen';
import SupportInformationScreen from '../screens/welfare/SupportInformationScreen';
import SupportDetailsScreen from '../screens/welfare/SupportDetailsScreen';
import ProfileScreen from '../screens/welfare/ProfileScreen';
import PrivacySecurityScreen from '../screens/welfare/PrivacySecurityScreen';
import PrivacyInformationScreen from '../screens/welfare/PrivacyInformationScreen';
import WorkScheduleScreen from '../screens/welfare/WorkScheduleScreen';
import { WelfareProvider } from '../context/WelfareContext';
import { tabScreenOptions } from './TabHelpers';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const AppointmentsStack = createNativeStackNavigator();
const ServicesStack = createNativeStackNavigator();
const SupportStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
    <DashboardStack.Screen name="Notifications" component={NotificationsScreen} />
  </DashboardStack.Navigator>
);

const AppointmentsStackScreen = () => (
  <AppointmentsStack.Navigator screenOptions={{ headerShown: false }}>
    <AppointmentsStack.Screen name="AppointmentsHome" component={AppointmentsScreen} />
    <AppointmentsStack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
  </AppointmentsStack.Navigator>
);

const ServicesStackScreen = () => (
  <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
    <ServicesStack.Screen name="ServicesHome" component={ServicesScreen} />
    <ServicesStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
  </ServicesStack.Navigator>
);

const SupportStackScreen = () => (
  <SupportStack.Navigator screenOptions={{ headerShown: false }}>
    <SupportStack.Screen name="SupportInfo" component={SupportInformationScreen} />
    <SupportStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
    <SupportStack.Screen name="SupportDetails" component={ServiceDetailsScreen} />
  </SupportStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="WorkSchedule" component={WorkScheduleScreen} />
    <ProfileStack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
    <ProfileStack.Screen name="PrivacyInformation" component={PrivacyInformationScreen} />
  </ProfileStack.Navigator>
);

const WelfareNavigator = () => (
  <WelfareProvider>
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icons: Record<string, string> = {
          Dashboard: '📊',
          Appointments: '📅',
          Support: '🛟',
          Services: '🏥',
          Profile: '👤',
        };
        return tabScreenOptions(icons[route.name] || '📊');
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsStackScreen} />
      <Tab.Screen name="Support" component={SupportStackScreen} />
      <Tab.Screen name="Services" component={ServicesStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  </WelfareProvider>
);

export default WelfareNavigator;
