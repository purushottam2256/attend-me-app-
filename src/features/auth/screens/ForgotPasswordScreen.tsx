/**
 * Premium Forgot Password Screen
 * Matches login screen design philosophy
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { Colors } from '../../../constants';
import { requestPasswordReset } from '../../../services/authService';

const { width } = Dimensions.get('window');

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState(false);

  // Animations
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(formSlide, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSendResetLink = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { success, error: resetError } = await requestPasswordReset(email.trim());
      
      if (resetError) {
        setError(resetError);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setEmailSent(true);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          Colors.premium.gradientStart,
          Colors.premium.gradientMid,
          Colors.premium.gradientEnd,
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Orb */}
      <View style={styles.orb} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {/* Form Card */}
            <Animated.View
              style={[
                styles.formCard,
                {
                  opacity: formOpacity,
                  transform: [{ translateY: formSlide }],
                },
              ]}
            >
              <BlurView intensity={25} tint="dark" style={styles.blur}>
                <View style={styles.formInner}>
                  {!emailSent ? (
                    <>
                      {/* Title */}
                      <Text style={styles.title}>Reset Password</Text>
                      <Text style={styles.subtitle}>
                        Enter your email and we'll send you a reset link.
                      </Text>

                      {/* Error */}
                      {error && (
                        <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}

                      {/* Email Input */}
                      <View
                        style={[
                          styles.inputContainer,
                          focusedField && styles.inputFocused,
                        ]}
                      >
                        <Text style={styles.inputIcon}>✉</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Email address"
                          placeholderTextColor={Colors.premium.textMuted}
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                            setError(null);
                          }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          onFocus={() => setFocusedField(true)}
                          onBlur={() => setFocusedField(false)}
                        />
                      </View>

                      {/* Submit Button */}
                      <TouchableOpacity
                        style={[
                          styles.submitButton,
                          isLoading && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSendResetLink}
                        disabled={isLoading}
                      >
                        <Text style={styles.submitText}>
                          {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* Success State */}
                      <View style={styles.successIcon}>
                        <Text style={styles.successEmoji}>✉️</Text>
                      </View>

                      <Text style={styles.successTitle}>Check Your Email</Text>
                      <Text style={styles.successSubtitle}>
                        We've sent a reset link to:
                      </Text>
                      <Text style={styles.emailText}>{email}</Text>

                      <View style={styles.stepsContainer}>
                        <Text style={styles.stepsTitle}>Next Steps:</Text>
                        <Text style={styles.stepsText}>
                          1. Open the email we sent{'\n'}
                          2. Click the reset link{'\n'}
                          3. Set your new password{'\n'}
                          4. Return here to sign in
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={onSuccess}
                      >
                        <Text style={styles.submitText}>Back to Login</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.tryAgainButton}
                        onPress={() => {
                          setEmailSent(false);
                          setEmail('');
                        }}
                      >
                        <Text style={styles.tryAgainText}>
                          Try different email
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  orb: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.premium.accent,
    opacity: 0.08,
    top: -50,
    right: -50,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 0,
    zIndex: 10,
  },
  backText: {
    fontSize: 17,
    color: Colors.premium.textSecondary,
    fontWeight: '500',
  },
  formCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 40,
  },
  blur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  formInner: {
    padding: 28,
    backgroundColor: Colors.premium.surface,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.premium.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.premium.textSecondary,
    marginBottom: 28,
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.premium.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.premium.border,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 58,
  },
  inputFocused: {
    borderColor: Colors.premium.borderFocus,
    backgroundColor: Colors.premium.surfaceLight,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: Colors.premium.textPrimary,
  },
  submitButton: {
    backgroundColor: Colors.premium.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0D4A4A',
  },
  // Success State
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.premium.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 36,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.premium.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.premium.textSecondary,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.premium.textPrimary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  stepsContainer: {
    backgroundColor: 'rgba(61, 220, 151, 0.1)',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(61, 220, 151, 0.2)',
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.premium.accent,
    marginBottom: 12,
  },
  stepsText: {
    fontSize: 15,
    color: Colors.premium.textSecondary,
    lineHeight: 24,
  },
  tryAgainButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  tryAgainText: {
    fontSize: 15,
    color: Colors.premium.accent,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
