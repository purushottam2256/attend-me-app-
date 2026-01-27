/**
 * HeadcountModal - Confirm attendance before submission
 * Theme-aware premium design
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
import { useTheme } from '../../../contexts';

interface HeadcountModalProps {
  visible: boolean;
  detectedCount: number;
  absentCount: number;
  onSubmit: () => void;
  onCancel: () => void;
  onRescan: () => void;
}

export const HeadcountModal: React.FC<HeadcountModalProps> = ({
  visible,
  detectedCount,
  absentCount,
  onSubmit,
  onCancel,
  onRescan,
}) => {
  const { isDark } = useTheme();

  // Theme-aware colors
  const colors = {
    modalBg: isDark ? '#1C1C1E' : '#FFFFFF',
    titleText: isDark ? '#FFFFFF' : '#0F172A',
    labelText: isDark ? 'rgba(255,255,255,0.6)' : '#6B7280',
    divider: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    warningBg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
    warningText: isDark ? '#FBBF24' : '#92400E',
    cancelBg: isDark ? '#2C2C2E' : '#F3F4F6',
    cancelText: isDark ? 'rgba(255,255,255,0.7)' : '#6B7280',
    rescanBg: isDark ? 'rgba(61, 220, 151, 0.15)' : 'rgba(5, 150, 105, 0.1)',
    rescanText: isDark ? '#3DDC97' : '#059669',
    submitBg: isDark ? '#3DDC97' : '#059669',
    success: '#34C759',
    danger: '#FF6B6B',
    successBg: isDark ? 'rgba(52, 199, 89, 0.15)' : 'rgba(34, 197, 94, 0.1)',
    dangerBg: isDark ? 'rgba(255, 107, 107, 0.15)' : 'rgba(239, 68, 68, 0.1)',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, { backgroundColor: colors.modalBg }]}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.emoji}>👥</Text>
                <Text style={[styles.title, { color: colors.titleText }]}>Confirm Headcount</Text>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <View style={[styles.statIcon, { backgroundColor: colors.successBg }]}>
                    <Ionicons name="checkmark-circle" size={28} color={colors.success} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.success }]}>{detectedCount}</Text>
                  <Text style={[styles.statLabel, { color: colors.labelText }]}>Present</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                <View style={styles.statBox}>
                  <View style={[styles.statIcon, { backgroundColor: colors.dangerBg }]}>
                    <Ionicons name="close-circle" size={28} color={colors.danger} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.danger }]}>{absentCount}</Text>
                  <Text style={[styles.statLabel, { color: colors.labelText }]}>Absent</Text>
                </View>
              </View>

              {/* Warning */}
              <View style={[styles.warningBox, { backgroundColor: colors.warningBg }]}>
                <Ionicons name="information-circle" size={20} color="#F59E0B" />
                <Text style={[styles.warningText, { color: colors.warningText }]}>
                  Please verify the headcount before submitting. If you find any anomaly, report to HOD.
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { backgroundColor: colors.cancelBg }]} 
                  onPress={onCancel}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.cancelText }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.rescanButton, { backgroundColor: colors.rescanBg }]} 
                  onPress={onRescan}
                >
                  <Ionicons name="refresh" size={18} color={colors.rescanText} />
                  <Text style={[styles.rescanButtonText, { color: colors.rescanText }]}>Rescan</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: colors.submitBg }]} 
                onPress={onSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Attendance</Text>
                <Ionicons name="arrow-forward" size={20} color={isDark ? '#000000' : '#FFFFFF'} />
              </TouchableOpacity>
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
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
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
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 80,
    marginHorizontal: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  rescanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  rescanButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HeadcountModal;
