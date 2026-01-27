/**
 * SafetyFooter - Bottom action bar with submit/cancel
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafetyFooterProps {
  presentCount: number;
  absentCount: number;
  totalCount: number;
  onSubmit: () => void;
  onCancel: () => void;
  onRescan: () => void;
  isSubmitting?: boolean;
}

export const SafetyFooter: React.FC<SafetyFooterProps> = ({
  presentCount,
  absentCount,
  totalCount,
  onSubmit,
  onCancel,
  onRescan,
  isSubmitting = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
      
      {/* Verification Line */}
      <View style={styles.verifyLine}>
        <Ionicons name="shield-checkmark" size={16} color="#059669" />
        <Text style={styles.verifyText}>
          Verify Headcount: <Text style={styles.verifyCount}>{presentCount}</Text> Present, {' '}
          <Text style={styles.absentCount}>{absentCount}</Text> Absent
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rescanButton} onPress={onRescan} activeOpacity={0.7}>
          <Ionicons name="refresh" size={18} color="#059669" />
          <Text style={styles.rescanButtonText}>Rescan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={onSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
          </Text>
          {!isSubmitting && <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  verifyLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  verifyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  verifyCount: {
    fontWeight: '700',
    color: '#059669',
  },
  absentCount: {
    fontWeight: '700',
    color: '#EF4444',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  rescanButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SafetyFooter;
