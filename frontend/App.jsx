import React from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import AuthNavigator from './src/navigation/AuthNavigator';

// Suppress intrusive LogBox popups on the screen for expected API responses and Expo CLI reconnection warnings
LogBox.ignoreLogs([
  '[UWell API Res',
  'Cannot connect to Expo CLI',
  'Request failed with status code 403',
  'Request failed with status code 401',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AuthNavigator />
          </NavigationContainer>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
