import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import DashboardScreen from '../screens/management/DashboardScreen';
import AppointmentsScreen from '../screens/management/AppointmentsScreen';
import UsageDetailsScreen from '../screens/management/UsageDetailsScreen';
import UsageReportScreen from '../screens/management/UsageReportScreen';
import ProfileScreen from '../screens/management/ProfileScreen';
import PrivacySecurityScreen from '../screens/management/PrivacySecurityScreen';
import BottomTab from '../components/navigation/BottomTab';

const Stack = createNativeStackNavigator();

const managementTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'usage', label: 'Usage', icon: '📈' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

const ManagementNavigator = () => {
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
        <Stack.Screen name="UsageDetails" component={UsageDetailsScreen} />
        <Stack.Screen name="UsageReport" component={UsageReportScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      </Stack.Navigator>
      <BottomTab tabs={managementTabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

export default ManagementNavigator;
