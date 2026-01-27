/**
 * useBLEScanner - BLE scanning logic with debouncing
 * 
 * Note: This is a mock implementation for Expo Go.
 * Real BLE requires react-native-ble-plx with EAS Build.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface UseBLEScannerOptions {
  allowedUUIDs: string[]; // Whitelist of student UUIDs
  onDetected: (uuid: string) => boolean; // Returns true if student was found
  debounceMs?: number; // Debounce interval (default 2000ms)
  enabled?: boolean;
}

interface UseBLEScannerReturn {
  isScanning: boolean;
  startScan: () => void;
  stopScan: () => void;
  toggleScan: () => void;
  detectedCount: number;
  lastDetectedUUID: string | null;
  bluetoothEnabled: boolean;
}

export const useBLEScanner = (options: UseBLEScannerOptions): UseBLEScannerReturn => {
  const { allowedUUIDs, onDetected, debounceMs = 2000, enabled = true } = options;

  const [isScanning, setIsScanning] = useState(false);
  const [detectedCount, setDetectedCount] = useState(0);
  const [lastDetectedUUID, setLastDetectedUUID] = useState<string | null>(null);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);

  // Track recently processed UUIDs for debouncing
  const recentlyProcessed = useRef<Map<string, number>>(new Map());
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Process a detected UUID
  const processUUID = useCallback((uuid: string) => {
    const now = Date.now();
    const lastProcessed = recentlyProcessed.current.get(uuid);

    // Debounce check
    if (lastProcessed && now - lastProcessed < debounceMs) {
      return; // Already processed recently
    }

    // Check if UUID is in allowed list
    if (!allowedUUIDs.includes(uuid)) {
      return; // Not in roster, ignore
    }

    // Mark as processed
    recentlyProcessed.current.set(uuid, now);

    // Notify parent
    const wasFound = onDetected(uuid);
    if (wasFound) {
      setDetectedCount(prev => prev + 1);
      setLastDetectedUUID(uuid);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [allowedUUIDs, onDetected, debounceMs]);

  // Mock BLE scanning (simulates random detections)
  useEffect(() => {
    if (!isScanning || !enabled) {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      return;
    }

    // Simulate BLE scanning with random UUID detections
    scanIntervalRef.current = setInterval(() => {
      if (allowedUUIDs.length === 0) return;

      // Randomly pick 1-3 UUIDs to "detect"
      const numToDetect = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numToDetect; i++) {
        const randomIndex = Math.floor(Math.random() * allowedUUIDs.length);
        const uuid = allowedUUIDs[randomIndex];
        processUUID(uuid);
      }
    }, 1500); // Scan every 1.5 seconds

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, enabled, allowedUUIDs, processUUID]);

  // Clean up old entries from debounce map periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleThreshold = debounceMs * 2;
      
      recentlyProcessed.current.forEach((timestamp, uuid) => {
        if (now - timestamp > staleThreshold) {
          recentlyProcessed.current.delete(uuid);
        }
      });
    }, debounceMs);

    return () => clearInterval(cleanupInterval);
  }, [debounceMs]);

  const startScan = useCallback(() => {
    setIsScanning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const toggleScan = useCallback(() => {
    setIsScanning(prev => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  return {
    isScanning,
    startScan,
    stopScan,
    toggleScan,
    detectedCount,
    lastDetectedUUID,
    bluetoothEnabled,
  };
};

export default useBLEScanner;
