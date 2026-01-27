/**
 * ProgressRing - Pure React Native Circular Progress Indicator
 * Uses View-based approach without react-native-svg
 * Apple-inspired design with smooth animations
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  backgroundColor = 'rgba(255,255,255,0.15)',
  progressColor = '#3DDC97',
  children,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  // Create a rotating effect for visual progress
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate the clip angle based on progress
  const progressAngle = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 360],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />
      
      {/* Progress Arc - Using multiple segments for visual effect */}
      <Animated.View
        style={[
          styles.progressContainer,
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Progress indicator dots */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const radius = (size - strokeWidth) / 2;
          const x = radius * Math.cos(angle) + size / 2 - 4;
          const y = radius * Math.sin(angle) + size / 2 - 4;
          const shouldShow = (i / 12) * 100 <= progress;
          
          return (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  left: x,
                  top: y,
                  backgroundColor: shouldShow ? progressColor : backgroundColor,
                  opacity: shouldShow ? 1 : 0.3,
                },
              ]}
            />
          );
        })}
      </Animated.View>

      {/* Animated glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size + 8,
            height: size + 8,
            borderRadius: (size + 8) / 2,
            borderWidth: 2,
            borderColor: progressColor,
            opacity: animatedValue.interpolate({
              inputRange: [0, 50, 100],
              outputRange: [0.2, 0.4, 0.6],
            }),
          },
        ]}
      />
      
      {/* Center Content */}
      <View style={styles.centerContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressContainer: {
    position: 'absolute',
  },
  progressDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  glowRing: {
    position: 'absolute',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressRing;
