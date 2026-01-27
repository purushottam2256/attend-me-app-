/**
 * ToastNotification - Custom themed toast that appears at top of screen
 * Replaces gray Alert.alert() with app-themed notifications
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  visible: boolean;
  type: ToastType;
  message: string;
  onDismiss: () => void;
  duration?: number; // ms, default 3000
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  type,
  message,
  onDismiss,
  duration = 3000,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Colors for each type
  const typeColors = {
    success: { bg: '#0D4A4A', icon: '#3DDC97', iconName: 'checkmark-circle' },
    error: { bg: '#4A0D0D', icon: '#FF6B6B', iconName: 'close-circle' },
    warning: { bg: '#4A3D0D', icon: '#FFD93D', iconName: 'warning' },
    info: { bg: '#0D3A4A', icon: '#5AC8FA', iconName: 'information-circle' },
  };

  const colors = typeColors[type];

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 8,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.toast, { backgroundColor: colors.bg }]}
        activeOpacity={0.9}
        onPress={handleDismiss}
      >
        <Ionicons
          name={colors.iconName as any}
          size={22}
          color={colors.icon}
        />
        <Text style={[styles.message, { color: '#FFFFFF' }]} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={18} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default ToastNotification;
