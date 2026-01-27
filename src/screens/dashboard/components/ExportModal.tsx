/**
 * ExportModal - Export attendance data in various formats
 * Downloads files professionally using expo-file-system and expo-sharing
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../../../contexts';

export interface ExportSession {
  id: string;
  section: string;
  subject: string;
  date: Date;
  time: string;
  total_students: number;
  present_count: number;
}

export interface ExportStudent {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'od' | 'leave';
}

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  session: ExportSession | null;
  students: ExportStudent[];
}

type FilterType = 'all' | 'present' | 'absent' | 'od';

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  session,
  students,
}) => {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');
  const [exporting, setExporting] = useState(false);

  const colors = {
    background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.4)',
    cardBg: isDark ? '#1E293B' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    accent: '#3DDC97',
    inputBg: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
  };

  if (!session) return null;

  // Extract short roll
  const getShortRoll = (fullRoll: string): string => {
    if (fullRoll.startsWith('LE') || fullRoll.startsWith('le')) {
      return fullRoll.toUpperCase();
    }
    return fullRoll.slice(-2);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get safe filename
  const getSafeFileName = (prefix: string, ext: string): string => {
    const safeName = session.section.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = session.date.toISOString().split('T')[0];
    return `${prefix}_${safeName}_${dateStr}.${ext}`;
  };

  // Get filtered students
  const getFilteredStudents = () => {
    if (filter === 'all') return students;
    return students.filter(s => s.status === filter);
  };

  // Generate WhatsApp text
  const generateWhatsAppText = (): string => {
    const present = students.filter(s => s.status === 'present');
    const absent = students.filter(s => s.status === 'absent');
    const od = students.filter(s => s.status === 'od' || s.status === 'leave');

    const presentRolls = present.map(s => getShortRoll(s.rollNumber)).join(', ');
    const absentRolls = absent.map(s => getShortRoll(s.rollNumber)).join(', ');
    const odRolls = od.map(s => getShortRoll(s.rollNumber)).join(', ');

    let text = `📚 ${session.section} Attendance\n`;
    text += `${formatDate(session.date)}\n`;
    text += `${session.time}\n`;
    text += `${session.subject}\n\n`;
    text += `Present (${present.length}):\n${presentRolls || 'None'}\n\n`;
    text += `Absent (${absent.length}):\n${absentRolls || 'None'}`;
    if (od.length > 0) {
      text += `\n\nOD/Leave (${od.length}):\n${odRolls}`;
    }

    return text;
  };

  // Share WhatsApp
  const shareWhatsApp = async () => {
    try {
      await Share.share({ message: generateWhatsAppText() });
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  // Export JSON file - saves and shares actual file
  const exportJSON = async () => {
    setExporting(true);
    try {
      const filteredData = getFilteredStudents();
      const data = {
        class: session.section,
        subject: session.subject,
        date: formatDate(session.date),
        time: session.time,
        total: students.length,
        filter: filter,
        students: filteredData.map(s => ({
          rollNumber: s.rollNumber,
          shortRoll: getShortRoll(s.rollNumber),
          name: s.name,
          status: s.status,
        })),
      };
      
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = getSafeFileName('attendance', 'json');
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Export Attendance JSON',
          UTI: 'public.json',
        });
      } else {
        Alert.alert('Success', `File saved to: ${fileName}`);
      }
      
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to export JSON file');
    } finally {
      setExporting(false);
    }
  };

  // Export CSV file - saves and shares actual file
  const exportExcel = async () => {
    setExporting(true);
    try {
      const filteredData = getFilteredStudents();
      let csv = 'Roll Number,Short Roll,Name,Status,Class,Subject,Date,Time\n';
      filteredData.forEach(s => {
        csv += `"${s.rollNumber}","${getShortRoll(s.rollNumber)}","${s.name}","${s.status.toUpperCase()}","${session.section}","${session.subject}","${formatDate(session.date)}","${session.time}"\n`;
      });
      
      const fileName = getSafeFileName('attendance', 'csv');
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Attendance CSV',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Success', `File saved to: ${fileName}`);
      }
      
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to export CSV file');
    } finally {
      setExporting(false);
    }
  };

  // Export PDF - Coming soon placeholder
  const exportPDF = async () => {
    Alert.alert(
      'PDF Export', 
      'PDF generation coming soon! For now, use Excel export and convert to PDF.'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={[styles.overlay, { backgroundColor: colors.background }]} 
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menu, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Export Attendance
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {session.section} • {session.subject}
          </Text>

          {/* Filter chips */}
          <View style={styles.filterRow}>
            {(['all', 'present', 'absent', 'od'] as FilterType[]).map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  { backgroundColor: filter === f ? colors.accent : colors.inputBg }
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={{ 
                  color: filter === f ? '#000' : colors.textSecondary,
                  fontWeight: '600',
                  fontSize: 12,
                }}>
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Export buttons */}
          {exporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Preparing file...
              </Text>
            </View>
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#25D366' }]}
                onPress={shareWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                <Text style={styles.btnText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#4285F4' }]}
                onPress={exportJSON}
              >
                <Ionicons name="code-slash" size={20} color="#FFF" />
                <Text style={styles.btnText}>JSON</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#217346' }]}
                onPress={exportExcel}
              >
                <Ionicons name="grid" size={20} color="#FFF" />
                <Text style={styles.btnText}>Excel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#E53935' }]}
                onPress={exportPDF}
              >
                <Ionicons name="document-text" size={20} color="#FFF" />
                <Text style={styles.btnText}>PDF</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: colors.inputBg }]}
            onPress={onClose}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  menu: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 110,
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
});

export default ExportModal;
