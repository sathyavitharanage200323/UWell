import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import StudentNavigator from './StudentNavigator';
import CounselorNavigator from './CounselorNavigator';
import WelfareNavigator from './WelfareNavigator';
import ManagementNavigator from './ManagementNavigator';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoadingScreen from '../screens/auth/LoadingScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLoading, setShowLoading] = React.useState(true);

  const handleGetStarted = () => {
    setShowLoading(false);
  };

  if (isLoading && showLoading) {
    return <LoadingScreen onGetStarted={handleGetStarted} />;
  }

  if (isAuthenticated) {
    switch (user?.role) {
      case 'student':
        return <StudentNavigator />;
      case 'counselor':
        return <CounselorNavigator />;
      case 'welfare':
        return <WelfareNavigator />;
      case 'management':
        return <ManagementNavigator />;
      default:
        return <WelcomeScreen />;
    }
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
