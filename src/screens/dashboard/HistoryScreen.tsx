/**
 * HistoryScreen - The Digital Ledger
 * Fast access to past attendance records with export tools
 * Premium design with date strip, accordion cards, and floating dock
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Share,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts';
import { supabase } from '../../config/supabase';
import { getAttendanceHistory, AttendanceSession } from '../../services/dashboardService';
import { EditAttendanceModal, ExportModal, FilterBar, type ExportSession, type ExportStudent } from './components';

// Date tile width
const DATE_TILE_WIDTH = 56;

// Months for picker
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HistoryScreen: React.FC = () => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSession, setEditSession] = useState<AttendanceSession | null>(null);
  const [editStudents, setEditStudents] = useState<any[]>([]);
  
  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSession, setExportSession] = useState<ExportSession | null>(null);
  const [exportStudents, setExportStudents] = useState<ExportStudent[]>([]);
  
  // Filter state for year, section, and period
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  // Colors
  const colors = {
    background: isDark ? '#0A0A0A' : '#F8FAFC',
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    textMuted: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8',
    cardBg: isDark ? 'rgba(30, 41, 59, 0.6)' : '#FFFFFF',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    statBg: isDark ? 'rgba(255,255,255,0.08)' : '#F8FAFC',
    buttonBg: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
    activeBg: isDark ? '#FFFFFF' : '#0F172A',
    activeText: isDark ? '#0F172A' : '#FFFFFF',
    inactiveBg: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
    dockBg: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
    dockBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    indicator: '#3DDC97',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
    noClass: '#FF8C42', // Orange for no-class days
  };

  // Generate dates for date strip (based on selectedDate's month)
  const generateDates = useCallback(() => {
    const dates: Date[] = [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate all dates of the selected month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  }, [selectedDate]);

  const dates = generateDates();

  // Check if same day
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  // Get no-class reason for a date
  const getNoClassReason = (date: Date): { isNoClass: boolean; reason: string; emoji: string } => {
    const day = date.getDay();
    
    // Sunday only (Saturday is working day)
    if (day === 0) {
      return { isNoClass: true, reason: 'Sunday', emoji: '☀️' };
    }
    
    // Check for holidays (example - could be from API)
    const dateStr = date.toISOString().split('T')[0];
    const holidays: Record<string, string> = {
      '2026-01-26': 'Republic Day',
      '2026-08-15': 'Independence Day',
      '2026-10-02': 'Gandhi Jayanti',
      // Add more holidays as needed
    };
    
    if (holidays[dateStr]) {
      return { isNoClass: true, reason: holidays[dateStr], emoji: '🎊' };
    }
    
    return { isNoClass: false, reason: '', emoji: '' };
  };

  // Load history
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Format date for query
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await getAttendanceHistory(user.id, 'All');
      
      // Filter by selected date
      const filtered = data.filter(session => {
        const sessionDate = new Date(session.date);
        return isSameDay(sessionDate, selectedDate);
      });
      
      setSessions(filtered);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setExpandedId(null);
  };

  // Handle month selection
  const handleMonthSelect = () => {
    const newDate = new Date(pickerYear, pickerMonth, 1);
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  // Generate WhatsApp report
  const generateWhatsAppReport = (session: AttendanceSession) => {
    const dateStr = new Date(session.date).toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'short' 
    });
    
    const report = `📅 ${dateStr} | ${session.subject?.name || 'Class'}\n` +
      `${session.target_dept}-${session.target_year}-${session.target_section}\n` +
      `✅ Present: ${session.present_count}/${session.total_students}\n` +
      `❌ Absent: ${session.absent_count}`;
    
    Share.share({
      message: report,
      title: `Attendance Report`,
    });
  };

  // Get health color
  const getHealthColor = (present: number, total: number) => {
    const percent = total > 0 ? (present / total) * 100 : 0;
    if (percent >= 75) return colors.success;
    if (percent >= 50) return colors.warning;
    return colors.danger;
  };

  // Check if editable (within 24 hours)
  const isEditable = (dateStr: string) => {
    const sessionDate = new Date(dateStr);
    const now = new Date();
    const hoursDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  // Handle edit session
  const handleEditSession = (session: AttendanceSession) => {
    // Generate mock student data - in production, fetch from API
    const mockStudents = Array.from({ length: session.total_students }, (_, i) => {
      const rollNum = i + 1;
      const isLE = rollNum > 60; // Example: LE students start after 60
      const shortRoll = isLE ? `LE-${rollNum - 60}` : String(rollNum).padStart(2, '0');
      const fullRoll = isLE ? `LE-${rollNum - 60}` : `22Q91A66${shortRoll}`;
      const isPresent = i < session.present_count;
      
      return {
        id: String(i),
        rollNumber: shortRoll,
        fullRollNumber: fullRoll,
        name: `Student ${fullRoll}`,
        status: isPresent ? 'present' as const : 'absent' as const,
      };
    });

    setEditSession(session);
    setEditStudents(mockStudents);
    setShowEditModal(true);
  };

  // Handle save edited attendance
  const handleSaveAttendance = (updatedStudents: any[]) => {
    // In production, call API to save
    const present = updatedStudents.filter(s => s.status === 'present').length;
    const absent = updatedStudents.filter(s => s.status === 'absent').length;
    console.log(`Saved: ${present} present, ${absent} absent`);
    setShowEditModal(false);
    loadHistory(); // Refresh
  };

  // Handle export session
  const handleExportSession = (session: AttendanceSession) => {
    // Generate mock student data - in production, fetch from API
    const mockStudents: ExportStudent[] = Array.from({ length: session.total_students }, (_, i) => {
      const rollNum = i + 1;
      const isLE = rollNum > 60;
      const shortRoll = isLE ? `LE-${rollNum - 60}` : String(rollNum).padStart(2, '0');
      const fullRoll = isLE ? `LE-${rollNum - 60}` : `22Q91A66${shortRoll}`;
      const isPresent = i < session.present_count;
      
      return {
        id: String(i),
        rollNumber: fullRoll,
        name: `Student ${rollNum}`,
        status: isPresent ? 'present' as const : 'absent' as const,
      };
    });

    setExportSession({
      id: session.id,
      section: `${session.target_dept}-${session.target_year}-${session.target_section}`,
      subject: session.subject?.name || 'Class',
      date: new Date(session.date),
      time: session.slot_id || '10:00 AM',
      total_students: session.total_students,
      present_count: session.present_count,
    });
    setExportStudents(mockStudents);
    setShowExportModal(true);
  };

  // Format display date
  const formatDisplayDate = () => {
    const today = new Date();
    if (isSameDay(selectedDate, today)) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(selectedDate, yesterday)) return 'Yesterday';
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render date strip
  const renderDateStrip = () => (
    <View style={styles.dateStripContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateStripContent}
      >
        {dates.map((date, index) => {
          const isActive = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const noClassInfo = getNoClassReason(date);
          
          // Determine tile color
          let tileBg = colors.inactiveBg;
          let textColor = colors.textPrimary;
          let dayColor = colors.textSecondary;
          
          if (isActive) {
            tileBg = colors.activeBg;
            textColor = colors.activeText;
            dayColor = colors.activeText;
          } else if (noClassInfo.isNoClass) {
            tileBg = isDark ? 'rgba(255, 140, 66, 0.15)' : 'rgba(255, 140, 66, 0.1)';
            textColor = colors.noClass;
            dayColor = colors.noClass;
          }
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateTile,
                {
                  backgroundColor: tileBg,
                  borderColor: noClassInfo.isNoClass && !isActive ? colors.noClass + '30' : colors.cardBorder,
                },
              ]}
              onPress={() => handleDateSelect(date)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayText,
                { color: dayColor }
              ]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)}
              </Text>
              <Text style={[
                styles.dateText,
                { color: textColor }
              ]}>
                {date.getDate()}
              </Text>
              {isActive && <View style={[styles.indicator, { backgroundColor: noClassInfo.isNoClass ? colors.noClass : colors.indicator }]} />}
              {isToday && !isActive && (
                <View style={[styles.todayDot, { backgroundColor: colors.indicator }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Render session card
  const renderSessionCard = (session: AttendanceSession, index: number) => {
    const isExpanded = expandedId === (session.id || String(index));
    const healthColor = getHealthColor(session.present_count, session.total_students);
    const canEdit = isEditable(session.date);
    const percentage = session.total_students > 0 
      ? Math.round((session.present_count / session.total_students) * 100) 
      : 0;

    return (
      <TouchableOpacity
        key={session.id || index}
        style={[styles.sessionCard, { 
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }]}
        onPress={() => setExpandedId(isExpanded ? null : (session.id || String(index)))}
        activeOpacity={0.9}
      >
        {/* Health Strip */}
        <View style={[styles.healthStrip, { backgroundColor: healthColor }]} />

        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.subjectInfo}>
              <Text style={[styles.subject, { color: colors.textPrimary }]} numberOfLines={1}>
                {session.subject?.name || 'Unknown Subject'}
              </Text>
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {session.target_dept}-{session.target_year}-{session.target_section} • {String(session.slot_id).toUpperCase()}
              </Text>
            </View>
            <Ionicons 
              name="cloud-done" 
              size={16} 
              color={colors.success} 
            />
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.statBg }]}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{session.total_students}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.statBg }]}>
              <Text style={[styles.statValue, { color: colors.success }]}>{session.present_count}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Present</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.statBg }]}>
              <Text style={[styles.statValue, { color: colors.danger }]}>{session.absent_count}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Absent</Text>
            </View>
          </View>

          {/* Expanded Panel */}
          {isExpanded && (
            <View style={styles.expandPanel}>
              {/* Percentage */}
              <View style={styles.percentRow}>
                <Text style={[styles.percentLabel, { color: colors.textSecondary }]}>Attendance</Text>
                <Text style={[styles.percentValue, { color: healthColor }]}>{percentage}%</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: colors.indicator, flex: 1 }]}
                  onPress={() => handleExportSession(session)}
                >
                  <Ionicons name="share-outline" size={16} color="#000" />
                  <Text style={[styles.actionBtnText, { color: '#000' }]}>Export / Share</Text>
                </TouchableOpacity>

                {canEdit ? (
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: colors.buttonBg }]}
                    onPress={() => handleEditSession(session)}
                  >
                    <Ionicons name="pencil-outline" size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.actionBtn, { backgroundColor: colors.buttonBg, opacity: 0.5 }]}>
                    <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Expand Indicator */}
          <View style={styles.expandIndicator}>
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color={colors.textMuted} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render month picker modal
  const renderMonthPicker = () => (
    <Modal visible={showMonthPicker} transparent animationType="fade" onRequestClose={() => setShowMonthPicker(false)}>
      <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableWithoutFeedback>
            <View style={[styles.modal, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Month</Text>
                <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.yearRow}>
                <TouchableOpacity onPress={() => setPickerYear(y => y - 1)}>
                  <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={[styles.yearText, { color: colors.textPrimary }]}>{pickerYear}</Text>
                <TouchableOpacity onPress={() => setPickerYear(y => y + 1)}>
                  <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.monthGrid}>
                {MONTHS.map((m, index) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.monthTile,
                      { backgroundColor: pickerMonth === index ? colors.indicator : colors.buttonBg }
                    ]}
                    onPress={() => setPickerMonth(index)}
                  >
                    <Text style={[
                      styles.monthText,
                      { color: pickerMonth === index ? '#000' : colors.textPrimary }
                    ]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.indicator }]}
                onPress={handleMonthSelect}
              >
                <Text style={styles.confirmText}>Go to {MONTHS[pickerMonth]} {pickerYear}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#0D4A4A', '#1A6B6B', '#0F3D3D']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>History</Text>
            <Text style={styles.subtitle}>{formatDisplayDate()}</Text>
          </View>
          <TouchableOpacity
            style={styles.calendarBtn}
            onPress={() => setShowMonthPicker(true)}
          >
            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {renderDateStrip()}
      </LinearGradient>

      {/* Filter Bar Component */}
      <FilterBar
        filterYear={filterYear}
        filterSection={filterSection}
        filterPeriod={filterPeriod}
        onYearChange={setFilterYear}
        onSectionChange={setFilterSection}
        onPeriodChange={setFilterPeriod}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D4A4A" />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D4A4A" />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Fetching records...
            </Text>
          </View>
        ) : sessions.length > 0 ? (
          sessions
            .filter(session => {
              // Convert target_year to string for comparison
              const yearMatch = filterYear === 'all' || String(session.target_year) === filterYear;
              const sectionMatch = filterSection === 'all' || session.target_section === filterSection;
              // Match period like P1, P2 etc (slot_id format: p1, p2...)
              const periodMatch = filterPeriod === 'all' || session.slot_id?.toUpperCase() === filterPeriod;
              return yearMatch && sectionMatch && periodMatch;
            })
            .map((session, index) => renderSessionCard(session, index))
        ) : (
          (() => {
            const noClassInfo = getNoClassReason(selectedDate);
            return (
              <View style={[styles.emptyContainer, { 
                backgroundColor: noClassInfo.isNoClass ? (isDark ? 'rgba(255, 140, 66, 0.08)' : 'rgba(255, 140, 66, 0.05)') : 'transparent',
                borderRadius: 20,
                marginHorizontal: 16,
                paddingVertical: 40,
              }]}>
                <Text style={styles.emptyEmoji}>
                  {noClassInfo.isNoClass ? noClassInfo.emoji : '📅'}
                </Text>
                <Text style={[styles.emptyTitle, { 
                  color: noClassInfo.isNoClass ? colors.noClass : colors.textPrimary 
                }]}>
                  {noClassInfo.isNoClass ? noClassInfo.reason : 'No Records'}
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {noClassInfo.isNoClass 
                    ? `No classes scheduled for ${noClassInfo.reason.toLowerCase()}`
                    : 'No attendance sessions found for this date'}
                </Text>
                {noClassInfo.isNoClass && (
                  <View style={[styles.noClassBadge, { backgroundColor: colors.noClass + '20' }]}>
                    <Text style={[styles.noClassBadgeText, { color: colors.noClass }]}>
                      Non-working day
                    </Text>
                  </View>
                )}
              </View>
            );
          })()
        )}
      </ScrollView>

      {/* Floating Dock */}
      <View style={[styles.dock, { 
        backgroundColor: colors.dockBg,
        borderColor: colors.dockBorder,
        bottom: insets.bottom + 16,
      }]}>
        <TouchableOpacity style={styles.dockItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {renderMonthPicker()}

      {/* Edit Attendance Modal */}
      <EditAttendanceModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        session={editSession ? {
          id: editSession.id || '',
          subject: editSession.subject?.name || 'Unknown',
          subjectCode: editSession.subject?.code || 'N/A',
          section: `${editSession.target_year}-${editSession.target_dept}-${editSession.target_section}`,
          date: new Date(editSession.date),
          time: editSession.slot_id || '10:00',
          total: editSession.total_students,
        } : null}
        students={editStudents}
        onSave={handleSaveAttendance}
      />

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        session={exportSession}
        students={exportStudents}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateStripContainer: {
    paddingVertical: 12,
  },
  dateStripContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dateTile: {
    width: DATE_TILE_WIDTH,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  todayDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noClassBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sessionCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  healthStrip: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  expandPanel: {
    paddingTop: 16,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  percentLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  percentValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  dock: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dockItem: {
    padding: 8,
  },
  modalOverlay: {
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
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
    color: '#000',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  filterGroup: {
    flex: 1,
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChipPremium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 32,
    alignItems: 'center',
  },
  filterDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 55,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  simpleFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  simpleFilterLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  simpleFilterChips: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  simpleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterSep: {
    width: 1,
    height: 16,
    marginHorizontal: 4,
  },
  parallelFilter: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 16,
  },
  filterHalf: {
    flex: 1,
    alignItems: 'center',
  },
  filterHalfLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  filterHalfChips: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filterPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    minWidth: 26,
    alignItems: 'center',
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 10,
    minWidth: 50,
  },
  filterBoxChips: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 12,
  },
  filterBoxChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
  },
});

export default HistoryScreen;
