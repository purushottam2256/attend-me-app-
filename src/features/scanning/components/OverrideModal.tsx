/**
 * OverrideModal - Confirmation when re-scanning a class
 * Shows at top with Go Back and Take Anyway buttons
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OverrideModalProps {
  visible: boolean;
  className: string;
  takenAt: string;
  onOverride: () => void;
  onCancel: () => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  visible,
  className,
  takenAt,
  onOverride,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBg}>
            <Ionicons name="alert-circle" size={22} color="#F59E0B" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Override Previous Attendance?</Text>
            <Text style={styles.subtitle}>
              {className} • {takenAt}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.backButton} onPress={onCancel}>
            <Ionicons name="arrow-back" size={16} color="#6B7280" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.continueButton} onPress={onOverride}>
            <Text style={styles.continueButtonText}>Take Anyway</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0D4A4A',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OverrideModal;
