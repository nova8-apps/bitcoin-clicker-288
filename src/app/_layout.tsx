import React from 'react';
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="dark">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0a0a0f' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="stats"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Statistics',
              headerStyle: { backgroundColor: '#12121a' },
              headerTintColor: '#ffffff',
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Settings',
              headerStyle: { backgroundColor: '#12121a' },
              headerTintColor: '#ffffff',
            }}
          />
        </Stack>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
