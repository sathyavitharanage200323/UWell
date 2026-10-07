import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/counselor/DashboardScreen';
import AppointmentsScreen from '../screens/counselor/AppointmentsScreen';
import StudentListScreen from '../screens/counselor/StudentListScreen';
import StudentSessionScreen from '../screens/counselor/StudentSessionScreen';
import MessagesScreen from '../screens/counselor/MessagesScreen';
import StudentChatScreen from '../screens/counselor/StudentChatScreen';
import ProfileScreen from '../screens/counselor/ProfileScreen';
import EditProfileScreen from '../screens/counselor/EditProfileScreen';
import ClinicalFocusAreasScreen from '../screens/counselor/ClinicalFocusAreasScreen';
import FocusAreaDetailScreen from '../screens/counselor/FocusAreaDetailScreen';
import { colors } from '../theme';

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
    <ProfileStack.Screen name="ClinicalFocusAreas" component={ClinicalFocusAreasScreen} />
    <ProfileStack.Screen name="FocusAreaDetail" component={FocusAreaDetailScreen} />
  </ProfileStack.Navigator>
);

type TabIconProps = { focused: boolean; color: string; size: number };

const tabIconMap: Record<string, (props: TabIconProps) => React.ReactElement> = {
  Dashboard: ({ focused, color }) => (
    <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={22} color={color} />
  ),
  Appointments: ({ focused, color }) => (
    <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
  ),
  Students: ({ focused, color }) => (
    <Ionicons name={focused ? 'people' : 'people-outline'} size={22} color={color} />
  ),
  Messages: ({ focused, color }) => (
    <Ionicons name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} size={22} color={color} />
  ),
  Profile: ({ focused, color }) => (
    <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
  ),
};

const CounselorNavigator = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: (props) => {
            const IconComponent = tabIconMap[route.name];
            return IconComponent ? IconComponent(props) : null;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: Platform.OS === 'ios' ? 82 : 64,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginTop: 2,
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen
          name="Appointments"
          component={AppointmentsScreen}
          options={{ tabBarBadge: undefined }}
        />
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
