import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
    
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}