/**
 * CircularClockHero - Premium circular clock widget for live class
 * Features:
 * - Real clock display (current time)
 * - Animated circular progress ring (SVG)
 * - SlideToStart gesture slider
 * - Premium glassmorphism design
 * - Smooth animations
 */

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = 160;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Ref interface for external reset
export interface CircularClockHeroRef {
  reset: () => void;
}

interface CircularClockHeroProps {
  subjectName: string;
  section: string;
  startTime: string;
  endTime: string;
  progress: number; // 0-100
  onSlideComplete: () => void;
  onManualEntry: () => void;
}

export const CircularClockHero = forwardRef<CircularClockHeroRef, CircularClockHeroProps>(({
  subjectName,
  section,
  startTime,
  endTime,
  progress,
  onSlideComplete,
  onManualEntry,
}, ref) => {
  const { isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Slider state
  const sliderX = useRef(new Animated.Value(0)).current;
  const [sliderCompleted, setSliderCompleted] = useState(false);
  const [sliderMaxWidth, setSliderMaxWidth] = useState(200);
  const thumbWidth = 44;
  const maxSlide = sliderMaxWidth - thumbWidth - 8;

  // Expose reset method via ref for parent to call when returning to screen
  useImperativeHandle(ref, () => ({
    reset: () => {
      sliderX.setValue(0);
      setSliderCompleted(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
  }));

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Glow animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  // Slow rotation for decorative dots
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Use ref to track current maxSlide for PanResponder
  const maxSlideRef = useRef(maxSlide);
  maxSlideRef.current = maxSlide;
  
  const sliderCompletedRef = useRef(sliderCompleted);
  sliderCompletedRef.current = sliderCompleted;

  // Slider pan responder with refs for current values
  const panResponder = React.useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => !sliderCompletedRef.current,
      onMoveShouldSetPanResponder: () => !sliderCompletedRef.current,
      onPanResponderGrant: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (_, gestureState) => {
        const currentMax = maxSlideRef.current;
        const newX = Math.min(Math.max(0, gestureState.dx), currentMax);
        sliderX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentMax = maxSlideRef.current;
        const progressPct = gestureState.dx / currentMax;
        if (progressPct >= 0.6) {
          Animated.spring(sliderX, {
            toValue: currentMax,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start(() => {
            setSliderCompleted(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onSlideComplete();
          });
        } else {
          Animated.spring(sliderX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    }),
    [sliderX, onSlideComplete]
  );

  const sliderTextOpacity = sliderX.interpolate({
    inputRange: [0, maxSlide * 0.4],
    outputRange: [1, 0],
  });

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Colors - glassy white card center
  const colors = {
    ringBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(13, 74, 74, 0.08)',
    ringProgress: '#3DDC97',
    cardBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)',
    cardBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : '#64748B',
    textMuted: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8',
    accentBg: isDark ? 'rgba(61, 220, 151, 0.12)' : 'rgba(61, 220, 151, 0.1)',
    sliderBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13, 74, 74, 0.08)',
  };

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <Animated.View style={[styles.glowBg, { opacity: glowOpacity }]} />

      {/* Main card - no borders */}
      <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
        {/* Live badge */}
        <View style={[styles.liveBadge, { backgroundColor: colors.accentBg }]}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        {/* Circular clock */}
        <Animated.View style={[styles.clockContainer, { transform: [{ scale: pulseAnim }] }]}>
          {/* Decorative rotating dots */}
          <Animated.View style={[styles.decorRing, { transform: [{ rotate: rotation }] }]}>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <View
                key={angle}
                style={[
                  styles.decorDot,
                  {
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -RING_SIZE / 2 - 10 },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>

          {/* SVG Ring */}
          <Svg width={RING_SIZE} height={RING_SIZE} style={styles.svgRing}>
            <Defs>
              <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#3DDC97" />
                <Stop offset="100%" stopColor="#0D4A4A" />
              </SvgGradient>
            </Defs>
            
            {/* Background ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={colors.ringBg}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
            />
            
            {/* Progress ring */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="url(#progressGradient)"
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>

          {/* Center content - Real clock */}
          <View style={styles.clockCenter}>
            <Text style={[styles.clockTime, { color: colors.textPrimary }]}>
              {formatTime(currentTime)}
            </Text>
            <Text style={[styles.clockLabel, { color: colors.textSecondary }]}>
              {Math.round(progress)}% complete
            </Text>
          </View>
        </Animated.View>

        {/* Class info */}
        <View style={styles.classInfo}>
          <Text style={[styles.subjectName, { color: colors.textPrimary }]} numberOfLines={1}>
            {subjectName}
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            {section}
          </Text>
        </View>

        {/* Actions Row - Slider and Manual Entry side by side */}
        <View style={styles.actionsRow}>
          {/* Slide to Start */}
          <View 
            style={[styles.sliderContainer, { backgroundColor: colors.sliderBg }]}
            onLayout={(e) => setSliderMaxWidth(e.nativeEvent.layout.width)}
          >
            <Animated.Text style={[styles.sliderText, { color: colors.textMuted, opacity: sliderTextOpacity }]}>
              {sliderCompleted ? 'Scanning...' : 'Slide to Start'}
            </Animated.Text>
            
            <Animated.View
              style={[styles.sliderThumb, { transform: [{ translateX: sliderX }] }]}
              {...panResponder.panHandlers}
            >
              <LinearGradient
                colors={['#0D4A4A', '#1A6B6B']}
                style={styles.thumbGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={sliderCompleted ? 'checkmark' : 'chevron-forward'} size={22} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>

            {/* Arrow hints */}
            {!sliderCompleted && (
              <View style={styles.arrowHints}>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ opacity: 0.4 }} />
              </View>
            )}
          </View>

          {/* Manual entry button */}
          <TouchableOpacity
            style={[styles.manualButton, { backgroundColor: colors.accentBg }]}
            onPress={onManualEntry}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={18} color="#3DDC97" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  glowBg: {
    position: 'absolute',
    top: 20,
    left: '15%',
    right: '15%',
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(61, 220, 151, 0.25)',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3DDC97',
  },
  liveText: {
    color: '#3DDC97',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  clockContainer: {
    width: RING_SIZE + 30,
    height: RING_SIZE + 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  decorRing: {
    position: 'absolute',
    width: RING_SIZE + 20,
    height: RING_SIZE + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(61, 220, 151, 0.3)',
  },
  svgRing: {
    position: 'absolute',
  },
  clockCenter: {
    alignItems: 'center',
  },
  clockTime: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  clockLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  classInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: 8,
  },
  sliderContainer: {
    flex: 1,
    maxWidth: 220,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  sliderText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  sliderThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    zIndex: 10,
  },
  thumbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowHints: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
  },
  manualButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualButtonText: {
    color: '#3DDC97',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CircularClockHero;
