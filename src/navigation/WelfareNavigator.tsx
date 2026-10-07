import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/welfare/DashboardScreen';
import AppointmentsScreen from '../screens/welfare/AppointmentsScreen';
import AppointmentDetailsScreen from '../screens/welfare/AppointmentDetailsScreen';
import ServicesScreen from '../screens/welfare/ServicesScreen';
import ServiceDetailsScreen from '../screens/welfare/ServiceDetailsScreen';
import SupportInformationScreen from '../screens/welfare/SupportInformationScreen';
import ProfileScreen from '../screens/welfare/ProfileScreen';
import { WelfareProvider } from '../context/WelfareContext';
import { tabScreenOptions } from './TabHelpers';

const Tab = createBottomTabNavigator();
const AppointmentsStack = createNativeStackNavigator();
const ServicesStack = createNativeStackNavigator();

const AppointmentsStackScreen = () => (
  <AppointmentsStack.Navigator screenOptions={{ headerShown: false }}>
    <AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} />
    <AppointmentsStack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
  </AppointmentsStack.Navigator>
);

const ServicesStackScreen = () => (
  <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
    <ServicesStack.Screen name="Services" component={ServicesScreen} />
    <ServicesStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
  </ServicesStack.Navigator>
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsStackScreen} />
      <Tab.Screen name="Support" component={SupportInformationScreen} />
      <Tab.Screen name="Services" component={ServicesStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  </WelfareProvider>
);

export default WelfareNavigator;