/**
 * SlideToStart - Gesture-based slider with haptic feedback
 * Requires 60% horizontal drag to trigger action
 * Resets when component re-renders (parent screen focuses)
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { scale, verticalScale, moderateScale, normalizeFont } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlideToStartProps {
  onComplete: () => void;
  label?: string;
  disabled?: boolean;
  resetKey?: number; // Pass changing value to reset slider
}

export const SlideToStart: React.FC<SlideToStartProps> = ({
  onComplete,
  label = 'Slide to Start',
  disabled = false,
  resetKey = 0,
}) => {
  const [completed, setCompleted] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const containerWidth = useRef(SCREEN_WIDTH - scale(80)); // More conservative default
  const thumbWidth = scale(48); // Match actual thumb width in styles
  const padding = scale(4); // Padding on each side
  const threshold = 0.6;

  // Calculate max slide with proper bounds
  const getMaxSlide = () => containerWidth.current - thumbWidth - (padding * 2);

  // Reset slider when resetKey changes or component remounts
  useEffect(() => {
    translateX.setValue(0);
    setCompleted(false);
  }, [resetKey, translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !completed,
      onMoveShouldSetPanResponder: () => !disabled && !completed,
      
      onPanResponderGrant: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.min(Math.max(0, gestureState.dx), getMaxSlide());
        translateX.setValue(newX);
      },
      
      onPanResponderRelease: (_, gestureState) => {
        const max = getMaxSlide();
        const progress = gestureState.dx / max;
        
        if (progress >= threshold) {
          Animated.spring(translateX, {
            toValue: max,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start(() => {
            setCompleted(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onComplete();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  const textOpacity = translateX.interpolate({
    inputRange: [0, getMaxSlide() * 0.4],
    outputRange: [1, 0],
  });

  return (
    <View 
      style={[styles.container, disabled && styles.disabled]}
      onLayout={(e) => {
        containerWidth.current = e.nativeEvent.layout.width;
      }}
    >
      <LinearGradient
        colors={['#0D4A4A', '#1A6B6B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.track}
      >
        {/* Label */}
        <Animated.Text style={[styles.label, { opacity: textOpacity }]}>
          {label}
        </Animated.Text>
        
        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
          ]}
          {...panResponder.panHandlers}
        >
          <Ionicons 
            name={completed ? 'checkmark' : 'chevron-forward'} 
            size={normalizeFont(24)} 
            color="#0D4A4A" 
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: verticalScale(56),
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    flex: 1,
    borderRadius: moderateScale(28),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4),
    overflow: 'hidden',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: normalizeFont(15),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  thumb: {
    position: 'absolute',
    left: scale(4),
    width: scale(48),
    height: scale(48),
    borderRadius: moderateScale(24),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
});

export default SlideToStart;
