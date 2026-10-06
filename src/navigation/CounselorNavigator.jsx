import React, { useState } from 'react';
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
import BottomTab from '../components/navigation/BottomTab';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const counselorTabs = [
  { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'Appointments', label: 'Appointments', icon: '📅' },
  { id: 'Students', label: 'Students', icon: '👥' },
  { id: 'Messages', label: 'Messages', icon: '💬' },
  { id: 'Profile', label: 'Profile', icon: '👤' }
];

const CounselorNavigator = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.creamBackground }
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="Students" component={StudentListScreen} />
        <Stack.Screen name="StudentList" component={StudentListScreen} />
        <Stack.Screen name="StudentSession" component={StudentSessionScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="StudentChat" component={StudentChatScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="VideoSession" component={VideoSessionScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
      <BottomTab
        tabs={counselorTabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground
  }
});

export default CounselorNavigator;
