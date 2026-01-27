/**
 * MRCE Attend-Me App
 * Main entry point
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation';
import { NetworkProvider, ThemeProvider, OfflineSyncProvider } from './src/contexts';
import { OfflineBanner } from './src/components/ui/OfflineBanner';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NetworkProvider>
          <OfflineSyncProvider>
            <StatusBar style="auto" />
            <OfflineBanner />
            <RootNavigator />
          </OfflineSyncProvider>
        </NetworkProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
