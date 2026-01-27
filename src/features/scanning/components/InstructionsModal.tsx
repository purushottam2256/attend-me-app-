/**
 * InstructionsModal - Pre-scan instructions popup
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface InstructionsModalProps {
  visible: boolean;
  onClose: () => void;
  onDontShowAgain?: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  visible,
  onClose,
  onDontShowAgain,
}) => {
  const instructions = [
    { icon: 'bluetooth', text: 'Ensure Bluetooth is ON' },
    { icon: 'phone-portrait-outline', text: 'Keep phone near students for better detection' },
    { icon: 'people-outline', text: 'Ask students to stay in their seats' },
    { icon: 'walk-outline', text: 'Avoid walking too fast — scanning takes 2–5 seconds' },
    { icon: 'add-circle-outline', text: "If a student isn't detected, add manually or rescan" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.emoji}>👉</Text>
                <Text style={styles.title}>Before You Start Scanning</Text>
              </View>

              {/* Instructions List */}
              <View style={styles.instructionsList}>
                {instructions.map((item, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon as any} size={20} color="#059669" />
                    </View>
                    <Text style={styles.instructionText}>{item.text}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                {onDontShowAgain && (
                  <TouchableOpacity style={styles.secondaryButton} onPress={onDontShowAgain}>
                    <Text style={styles.secondaryButtonText}>Don't show again</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                  <Text style={styles.primaryButtonText}>Got it</Text>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  instructionsList: {
    gap: 14,
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 20,
    paddingTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default InstructionsModal;
