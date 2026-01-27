/**
 * MonthYearPicker - Calendar modal for month and year selection
 */

import React, { useState } from 'react';
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

interface MonthYearPickerProps {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  selectedDate,
  onSelect,
  onClose,
}) => {
  const { isDark } = useTheme();
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());

  const colors = {
    modalBg: isDark ? '#1C1C1E' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    activeBg: isDark ? '#3DDC97' : '#0D4A4A',
    activeText: isDark ? '#000000' : '#FFFFFF',
    inactiveBg: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
  };

  const handleSelect = () => {
    const newDate = new Date(year, month, 1);
    onSelect(newDate);
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableWithoutFeedback>
            <View style={[styles.modal, { backgroundColor: colors.modalBg }]}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Select Month</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Year Selector */}
              <View style={styles.yearRow}>
                <TouchableOpacity onPress={() => setYear(y => y - 1)}>
                  <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={[styles.yearText, { color: colors.textPrimary }]}>{year}</Text>
                <TouchableOpacity onPress={() => setYear(y => y + 1)}>
                  <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Month Grid */}
              <View style={styles.monthGrid}>
                {MONTHS.map((m, index) => {
                  const isActive = month === index;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.monthTile,
                        { 
                          backgroundColor: isActive ? colors.activeBg : colors.inactiveBg,
                        }
                      ]}
                      onPress={() => setMonth(index)}
                    >
                      <Text style={[
                        styles.monthText,
                        { color: isActive ? colors.activeText : colors.textPrimary }
                      ]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.activeBg }]}
                onPress={handleSelect}
              >
                <Text style={[styles.confirmText, { color: colors.activeText }]}>
                  Go to {MONTHS[month]} {year}
                </Text>
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
  modal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 20,
  },
  yearText: {
    fontSize: 22,
    fontWeight: '700',
    minWidth: 60,
    textAlign: 'center',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  monthTile: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MonthYearPicker;
