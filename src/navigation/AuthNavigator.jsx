import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import StudentNavigator from './StudentNavigator';
import CounselorNavigator from './CounselorNavigator';
import WelfareNavigator from './WelfareNavigator';
import ManagementNavigator from './ManagementNavigator';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
// ── Legacy single-form register (kept as fallback, unused in main flow) ──
import RegisterScreen from '../screens/auth/RegisterScreen';
// ── New: role-selector + four separate registration screens ──────────────
import RegisterSelectScreen from '../screens/auth/RegisterSelectScreen';
import StudentRegisterScreen from '../screens/auth/StudentRegisterScreen';
import CounselorRegisterScreen from '../screens/auth/CounselorRegisterScreen';
import WelfareRegisterScreen from '../screens/auth/WelfareRegisterScreen';
import ManagementRegisterScreen from '../screens/auth/ManagementRegisterScreen';
// ── Counselor root-level screens (reachable from any counselor tab) ───────
import AvailabilityScreen from '../screens/counselor/AvailabilityScreen';
import VideoSessionScreen from '../screens/counselor/VideoSessionScreen';
import { USER_ROLES } from '../utils/constants';

const Stack = createNativeStackNavigator();
const CounselorRootStack = createNativeStackNavigator();

/**
 * Wraps the counselor tab navigator in a root stack so that
 * Availability and VideoSession are reachable from any tab.
 */
const CounselorRootNavigator = () => (
  <CounselorRootStack.Navigator screenOptions={{ headerShown: false }}>
    <CounselorRootStack.Screen name="CounselorTabs"  component={CounselorNavigator} />
    <CounselorRootStack.Screen name="Availability"   component={AvailabilityScreen} />
    <CounselorRootStack.Screen name="VideoSession"   component={VideoSessionScreen} />
  </CounselorRootStack.Navigator>
);

const AuthNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLoading, setShowLoading] = React.useState(true);

  if (isLoading && showLoading) {
    const LoadingScreen = require('../screens/auth/LoadingScreen').default;
    return <LoadingScreen onGetStarted={() => setShowLoading(false)} />;
  }

  if (isAuthenticated) {
    switch (user?.role) {
      case USER_ROLES.STUDENT:    return <StudentNavigator />;
      case USER_ROLES.COUNSELOR:  return <CounselorRootNavigator />;
      case USER_ROLES.WELFARE:    return <WelfareNavigator />;
      case USER_ROLES.MANAGEMENT: return <ManagementNavigator />;
      default:                    return <WelcomeScreen />;
    }
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Entry points */}
      <Stack.Screen name="Welcome"  component={WelcomeScreen} />
      <Stack.Screen name="Login"    component={LoginScreen} />

      {/* Register → role selector (replaces old single RegisterScreen) */}
      <Stack.Screen name="Register"          component={RegisterSelectScreen} />

      {/* Four separate role-specific registration screens */}
      <Stack.Screen name="StudentRegister"    component={StudentRegisterScreen} />
      <Stack.Screen name="CounselorRegister"  component={CounselorRegisterScreen} />
      <Stack.Screen name="WelfareRegister"    component={WelfareRegisterScreen} />
      <Stack.Screen name="ManagementRegister" component={ManagementRegisterScreen} />

      {/* Legacy fallback — kept for any deep-links that may reference it */}
      <Stack.Screen name="RegisterLegacy"    component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
