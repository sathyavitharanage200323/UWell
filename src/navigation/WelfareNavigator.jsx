import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

// NEW: import the provider
import { WelfareProvider } from '../context/WelfareContext';

import DashboardScreen from '../screens/welfare/DashboardScreen';
import NotificationsScreen from '../screens/welfare/NotificationsScreen';
import ServicesScreen from '../screens/welfare/ServicesScreen';
import ServiceDetailsScreen from '../screens/welfare/ServiceDetailsScreen';
import AppointmentsScreen from '../screens/welfare/AppointmentsScreen';
import AppointmentDetailsScreen from '../screens/welfare/AppointmentDetailsScreen';
import SupportInformationScreen from '../screens/welfare/SupportInformationScreen';
import ProfileScreen from '../screens/welfare/ProfileScreen';
import PrivacySecurityScreen from '../screens/welfare/PrivacySecurityScreen';
import PrivacyInformationScreen from '../screens/welfare/PrivacyInformationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.creamBackground }
};

const DashboardStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const ServicesStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="ServicesHome" component={ServicesScreen} />
    <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
  </Stack.Navigator>
);

const AppointmentsStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="AppointmentsHome" component={AppointmentsScreen} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
  </Stack.Navigator>
);

const SupportStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="SupportHome" component={SupportInformationScreen} />
    <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
    <Stack.Screen name="PrivacyInformation" component={PrivacyInformationScreen} />
  </Stack.Navigator>
);

const tabIconMap = {
  Dashboard: { focused: 'grid', unfocused: 'grid-outline' },
  Services: { focused: 'heart', unfocused: 'heart-outline' },
  Appointments: { focused: 'calendar', unfocused: 'calendar-outline' },
  Support: { focused: 'shield-checkmark', unfocused: 'shield-checkmark-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' }
};

const WelfareTabs = () => (
  <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: {
        backgroundColor: colors.backgroundLight,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: 68,
        paddingTop: 8,
        paddingBottom: 10
      },
      tabBarLabelStyle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium
      },
      tabBarIcon: ({ focused, color }) => {
        const icons = tabIconMap[route.name];
        const name = focused ? icons.focused : icons.unfocused;
        return <Ionicons name={name} size={22} color={color} />;
      }
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardStack} />
    <Tab.Screen name="Services" component={ServicesStack} />
    <Tab.Screen name="Appointments" component={AppointmentsStack} />
    <Tab.Screen name="Support" component={SupportStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

// Wrapped with provider so all welfare screens can use useWelfare()
const WelfareNavigator = () => (
  <WelfareProvider>
    <WelfareTabs />
  </WelfareProvider>
);

export default WelfareNavigator;