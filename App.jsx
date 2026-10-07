import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AuthNavigator />
        </NavigationContainer>
      </AuthProvider>
    </AppProvider>
  );
}
