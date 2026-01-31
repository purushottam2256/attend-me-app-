/**
 * Login Success Screen
 * Professional animated transition after successful login
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Layout } from '../../../constants';

const { width } = Dimensions.get('window');

interface LoginSuccessScreenProps {
  userName: string;
  onComplete: () => void;
}

export const LoginSuccessScreen: React.FC<LoginSuccessScreenProps> = ({
  userName,
  onComplete,
}) => {
  // Animations
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Step 1: Ring appears
    Animated.parallel([
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(ringScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 2: Checkmark appears (after 200ms)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Step 3: Success text appears
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Step 4: Welcome text appears
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(welcomeTranslateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Step 5: Navigate to dashboard
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <LinearGradient
      colors={[Colors.primary.main, Colors.primary.dark]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Success Circle */}
      <View style={styles.successContainer}>
        {/* Ring */}
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        {/* Checkmark */}
        <Animated.View
          style={[
            styles.checkContainer,
            {
              opacity: checkOpacity,
              transform: [{ scale: checkScale }],
            },
          ]}
        >
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>
      </View>

      {/* Success Text */}
      <Animated.Text
        style={[
          styles.successText,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        Login Successful
      </Animated.Text>

      {/* Welcome Text */}
      <Animated.View
        style={{
          opacity: welcomeOpacity,
          transform: [{ translateY: welcomeTranslateY }],
        }}
      >
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.screenPadding,
  },
  successContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  checkContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 28,
    fontFamily: Fonts.family.bold,
    color: '#fff',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: Fonts.family.regular,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  userName: {
    fontSize: 20,
    fontFamily: Fonts.family.semiBold,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default LoginSuccessScreen;
