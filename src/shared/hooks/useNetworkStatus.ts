/**
 * useNetworkStatus Hook
 * Monitors network connectivity and triggers sync when online
 */

import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * Hook to monitor network connectivity
 */
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isOnline = state.isConnected && state.isInternetReachable !== false;
      
      // Track if we were offline (for triggering sync when back online)
      if (!isOnline) {
        setWasOffline(true);
      }
      
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Derived state
  const isOnline = networkStatus.isConnected && networkStatus.isInternetReachable !== false;
  const justCameOnline = isOnline && wasOffline;

  // Reset wasOffline flag after it's been read
  useEffect(() => {
    if (justCameOnline) {
      // Give time for any callbacks to trigger
      const timer = setTimeout(() => setWasOffline(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [justCameOnline]);

  const refresh = useCallback(async () => {
    const state = await NetInfo.fetch();
    setNetworkStatus({
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    });
    return state.isConnected && state.isInternetReachable !== false;
  }, []);

  return {
    ...networkStatus,
    isOnline,
    wasOffline,
    justCameOnline,
    refresh,
  };
}

export default useNetworkStatus;
