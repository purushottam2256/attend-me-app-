/**
 * Premium Slide to Login
 * Attractive thumb with pulsing ring and fingerprint icon
 */

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - 96;
const THUMB_SIZE = 52;
const TRACK_HEIGHT = 60;
const PADDING = 4;

export interface SlideToLoginRef {
  reset: () => void;
}

interface SlideToLoginProps {
  onSlideComplete: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SlideToLogin = forwardRef<SlideToLoginRef, SlideToLoginProps>(({
  onSlideComplete,
  isLoading,
  disabled = false,
}, ref) => {
  const position = useRef(new Animated.Value(0)).current;
  const [isCompleted, setIsCompleted] = useState(false);
  const hasTriggeredHaptic = useRef(false);
  
  // Pulse animation for the ring
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  const maxSlide = SLIDER_WIDTH - THUMB_SIZE - (PADDING * 2);
  const triggerPoint = maxSlide * 0.65;

  // Pulse ring animation loop
  useEffect(() => {
    if (!isCompleted && !isLoading && !disabled) {
      const pulseAnimation = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseScale, {
              toValue: 1.4,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isCompleted, isLoading, disabled]);

  // Expose reset method
  useImperativeHandle(ref, () => ({
    reset: () => {
      setIsCompleted(false);
      hasTriggeredHaptic.current = false;
      Animated.spring(position, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: false,
      }).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  }));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled && !isLoading && !isCompleted,
    onMoveShouldSetPanResponder: () => !disabled && !isLoading && !isCompleted,
    
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      hasTriggeredHaptic.current = false;
    },
    
    onPanResponderMove: (_, gesture) => {
      const newValue = Math.max(0, Math.min(gesture.dx, maxSlide));
      position.setValue(newValue);

      if (newValue >= maxSlide * 0.5 && !hasTriggeredHaptic.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        hasTriggeredHaptic.current = true;
      }
    },
    
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx >= triggerPoint) {
        setIsCompleted(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        Animated.spring(position, {
          toValue: maxSlide,
          friction: 6,
          tension: 100,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => onSlideComplete(), 200);
        });
      } else {
        Animated.spring(position, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: false,
        }).start();
        hasTriggeredHaptic.current = false;
      }
    },
  });

  const textOpacity = position.interpolate({
    inputRange: [0, maxSlide * 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const thumbScale = position.interpolate({
    inputRange: [0, maxSlide * 0.1, maxSlide],
    outputRange: [1, 1.05, 1],
    extrapolate: 'clamp',
  });

  const progressWidth = position.interpolate({
    inputRange: [0, maxSlide],
    outputRange: [0, maxSlide + THUMB_SIZE],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {/* Progress Fill */}
        <Animated.View 
          style={[
            styles.progressFill,
            { width: progressWidth }
          ]} 
        />

        {/* Text */}
        <Animated.View style={[styles.textWrapper, { opacity: textOpacity }]}>
          <Text style={styles.slideText}>Slide to log in</Text>
        </Animated.View>

        {/* Success Text */}
        {isCompleted && (
          <View style={styles.successWrapper}>
            <Text style={styles.successText}>✓ Welcome!</Text>
          </View>
        )}

        {/* Thumb with Pulse Ring */}
        <Animated.View
          style={[
            styles.thumb,
            { 
              transform: [
                { translateX: position },
                { scale: thumbScale },
              ] 
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Pulsing Ring - Attracts attention */}
          {!isCompleted && !isLoading && (
            <Animated.View 
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                }
              ]} 
            />
          )}
          
          <View style={[
            styles.thumbInner,
            isCompleted && styles.thumbSuccess,
          ]}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : isCompleted ? (
              <Text style={styles.thumbIcon}>✓</Text>
            ) : (
              <View style={styles.playIcon} />
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  track: {
    width: SLIDER_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.premium.accent,
    opacity: 0.25,
    borderRadius: TRACK_HEIGHT / 2,
  },
  textWrapper: {
    position: 'absolute',
    left: THUMB_SIZE + 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.premium.textSecondary,
    letterSpacing: 0.5,
  },
  successWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.premium.accent,
  },
  thumb: {
    position: 'absolute',
    left: PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    borderColor: Colors.premium.accent,
  },
  thumbInner: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: Colors.premium.accent,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.premium.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  thumbSuccess: {
    backgroundColor: Colors.status.success,
  },
  thumbIcon: {
    fontSize: 22,
    color: '#1E1B4B',
    fontWeight: '700',
  },
  playIcon: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderLeftWidth: 16,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: '#1E1B4B',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});

export default SlideToLogin;
