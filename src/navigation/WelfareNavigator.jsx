import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import DashboardScreen from '../screens/welfare/DashboardScreen';
import AppointmentsScreen from '../screens/welfare/AppointmentsScreen';
import AppointmentDetailsScreen from '../screens/welfare/AppointmentDetailsScreen';
import StudentsScreen from '../screens/welfare/StudentsScreen';
import StudentDetailsScreen from '../screens/welfare/StudentDetailsScreen';
import ServicesScreen from '../screens/welfare/ServicesScreen';
import ServiceDetailsScreen from '../screens/welfare/ServiceDetailsScreen';
import ProfileScreen from '../screens/welfare/ProfileScreen';
import BottomTab from '../components/navigation/BottomTab';

const Stack = createNativeStackNavigator();

const welfareTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'services', label: 'Services', icon: '🏥' },
  { id: 'profile', label: 'Profile', icon: '👤' }
];

const WelfareNavigator = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
        <Stack.Screen name="Students" component={StudentsScreen} />
        <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
      <BottomTab tabs={welfareTabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

export default WelfareNavigator;
