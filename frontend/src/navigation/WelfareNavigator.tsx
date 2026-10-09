import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const ServicesStack = createNativeStackNavigator();
const AppointmentsStack = createNativeStackNavigator();
const SupportStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
    <DashboardStack.Screen name="Notifications" component={NotificationsScreen} />
  </DashboardStack.Navigator>
);

const ServicesStackScreen = () => (
  <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
    <ServicesStack.Screen name="ServicesHome" component={ServicesScreen} />
    <ServicesStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
  </ServicesStack.Navigator>
);

const AppointmentsStackScreen = () => (
  <AppointmentsStack.Navigator screenOptions={{ headerShown: false }}>
    <AppointmentsStack.Screen name="AppointmentsHome" component={AppointmentsScreen} />
    <AppointmentsStack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
  </AppointmentsStack.Navigator>
);

const SupportStackScreen = () => (
  <SupportStack.Navigator screenOptions={{ headerShown: false }}>
    <SupportStack.Screen name="SupportInfo" component={SupportInformationScreen} />
    <SupportStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
    <SupportStack.Screen name="SupportDetails" component={SupportDetailsScreen} />
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

type TabIconProps = { focused: boolean; color: string; size: number };

const tabIconMap: Record<string, (props: TabIconProps) => React.ReactElement> = {
  Dashboard: ({ color, size }) => (
    <MaterialCommunityIcons
      name="view-grid-outline"
      size={size || 24}
      color={color}
    />
  ),
  Services: ({ color, size }) => (
    <MaterialCommunityIcons
      name="heart-pulse"
      size={size || 24}
      color={color}
    />
  ),
  Appointments: ({ color, size }) => (
    <MaterialCommunityIcons
      name="calendar-blank-outline"
      size={size || 24}
      color={color}
    />
  ),
  Support: ({ color, size }) => (
    <MaterialCommunityIcons
      name="shield-account-outline"
      size={size || 24}
      color={color}
    />
  ),
  Profile: ({ color, size }) => (
    <MaterialCommunityIcons
      name="account-outline"
      size={size || 24}
      color={color}
    />
  ),
};

const WelfareNavigator = () => (
  <WelfareProvider>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: (props) => {
          const IconComponent = tabIconMap[route.name];
          return IconComponent ? IconComponent(props) : null;
        },
        tabBarActiveTintColor: colors.primary || '#E8836B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0E4DE',
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          shadowColor: '#C6AEA1',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Services" component={ServicesStackScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsStackScreen} />
      <Tab.Screen name="Support" component={SupportStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  </WelfareProvider>
);

export default WelfareNavigator;
