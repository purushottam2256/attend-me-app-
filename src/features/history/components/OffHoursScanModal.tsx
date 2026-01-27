/**
 * OffHoursScanModal - Shows when faculty tries to scan during break/off-hours
 * 
 * Features:
 * - Shows reason (break, after hours, holiday, suspended)
 * - Lists previous incomplete classes for late attendance
 * - Shows next class timing if available
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type OffHoursReason = 'break' | 'after_hours' | 'before_hours' | 'holiday' | 'suspended';

interface PreviousClass {
  id: string;
  slot_id: string;
  subject: { name: string; code: string };
  start_time: string;
  end_time: string;
  target_dept: string;
  target_year: number;
  target_section: string;
}

interface NextClass {
  subject: { name: string };
  start_time: string;
  slot_id: string;
}

interface OffHoursScanModalProps {
  visible: boolean;
  onClose: () => void;
  reason: OffHoursReason;
  holidayName?: string;
  suspensionReason?: string;
  previousClasses: PreviousClass[];
  nextClass: NextClass | null;
  onSelectClass: (classItem: PreviousClass) => void;
}

const getReasonConfig = (reason: OffHoursReason, holidayName?: string, suspensionReason?: string) => {
  switch (reason) {
    case 'break':
      return {
        icon: 'cafe-outline' as const,
        title: "Break Time",
        subtitle: 'No active class at the moment. Take a well-deserved break!',
        color: '#F59E0B',
        allowPrevious: true,
      };
    case 'after_hours':
      return {
        icon: 'moon-outline' as const,
        title: 'Day Complete',
        subtitle: 'All scheduled classes have concluded for today. Great work!',
        color: '#6366F1',
        allowPrevious: true,
      };
    case 'before_hours':
      return {
        icon: 'sunny-outline' as const,
        title: 'Good Morning!',
        subtitle: 'Classes will begin shortly. Prepare for a productive day ahead.',
        color: '#F97316',
        allowPrevious: false,
      };
    case 'holiday':
      return {
        icon: 'calendar-outline' as const,
        title: holidayName || 'Holiday',
        subtitle: 'No classes scheduled today. Enjoy your time off!',
        color: '#10B981',
        allowPrevious: false,
      };
    case 'suspended':
      return {
        icon: 'warning-outline' as const,
        title: 'Classes Suspended',
        subtitle: suspensionReason || 'Academic activities have been temporarily suspended.',
        color: '#EF4444',
        allowPrevious: false,
      };
  }
};

export const OffHoursScanModal: React.FC<OffHoursScanModalProps> = ({
  visible,
  onClose,
  reason,
  holidayName,
  suspensionReason,
  previousClasses,
  nextClass,
  onSelectClass,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const config = getReasonConfig(reason, holidayName, suspensionReason);

  const glassBackground = isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)';
  const cardBackground = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : '#64748B';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const incompleteClasses = previousClasses.filter(c => !['holiday', 'before_hours'].includes(reason));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={isDark ? 50 : 30} tint={isDark ? 'dark' : 'light'} style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: glassBackground, paddingBottom: insets.bottom + 20 }]}>
          {/* Header Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }]} />
          </View>

          {/* Icon & Title */}
          <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
            <Ionicons name={config.icon} size={40} color={config.color} />
          </View>
          
          <Text style={[styles.title, { color: textPrimary }]}>{config.title}</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>{config.subtitle}</Text>

          {/* Next Class */}
          {nextClass && (
            <View style={[styles.nextClassCard, { backgroundColor: cardBackground, borderColor }]}>
              <View style={styles.nextClassHeader}>
                <Ionicons name="time-outline" size={18} color={config.color} />
                <Text style={[styles.nextClassLabel, { color: textSecondary }]}>Next Class</Text>
              </View>
              <Text style={[styles.nextClassName, { color: textPrimary }]}>{nextClass.subject.name}</Text>
              <Text style={[styles.nextClassTime, { color: config.color }]}>{nextClass.start_time}</Text>
            </View>
          )}

          {/* Previous Classes */}
          {config.allowPrevious && incompleteClasses.length > 0 && (
            <View style={styles.previousSection}>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>Take Late Attendance</Text>
              <Text style={[styles.sectionSubtitle, { color: textSecondary }]}>
                Select a class to record attendance
              </Text>
              
              <ScrollView 
                style={styles.classList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.classListContent}
              >
                {incompleteClasses.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.classCard, { backgroundColor: cardBackground, borderColor }]}
                    onPress={() => onSelectClass(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.classInfo}>
                      <Text style={[styles.className, { color: textPrimary }]} numberOfLines={1}>
                        {item.subject.name}
                      </Text>
                      <Text style={[styles.classDetails, { color: textSecondary }]}>
                        {item.start_time} - {item.end_time} • {item.target_section}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: cardBackground, borderColor }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.closeButtonText, { color: textPrimary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  nextClassCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  nextClassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  nextClassLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextClassName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextClassTime: {
    fontSize: 15,
    fontWeight: '600',
  },
  previousSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  classList: {
    maxHeight: 200,
  },
  classListContent: {
    gap: 10,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 13,
  },
  closeButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OffHoursScanModal;
