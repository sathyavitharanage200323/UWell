import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';

// TESTING ONLY - remove this line later
import WelfareNavigator from './src/navigation/WelfareNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            {/* TESTING ONLY - replace with AuthNavigator later */}
            <WelfareNavigator />
          </NavigationContainer>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}