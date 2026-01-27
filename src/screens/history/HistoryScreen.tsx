/**
 * HistoryScreen - The Digital Ledger
 * Fast access to past attendance records with export tools
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts';
import { DateStrip } from './components/DateStrip';
import { SessionCard } from './components/SessionCard';
import { MonthYearPicker } from './components/MonthYearPicker';

// Mock data generator
const generateMockSessions = (date: Date) => {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) return []; // Sunday - no classes
  
  const sessions = [
    {
      id: '1',
      subject: 'Data Structures & Algorithms',
      subjectCode: 'DSA',
      section: 'CSE-3-A',
      time: '09:00 - 10:00',
      total: 62,
      present: 58,
      absent: 4,
      absentees: ['21CSE101', '21CSE115', '21CSE128', '21CSE142'],
      presentees: Array.from({ length: 58 }, (_, i) => `21CSE${100 + i}`),
    },
    {
      id: '2',
      subject: 'Database Management',
      subjectCode: 'DBMS',
      section: 'CSE-3-A',
      time: '10:00 - 11:00',
      total: 62,
      present: 55,
      absent: 7,
      absentees: ['21CSE101', '21CSE102', '21CSE115', '21CSE128', '21CSE142', '21CSE150', '21CSE155'],
      presentees: Array.from({ length: 55 }, (_, i) => `21CSE${100 + i}`),
    },
    {
      id: '3',
      subject: 'Computer Networks',
      subjectCode: 'CN',
      section: 'CSE-3-A',
      time: '11:00 - 12:00',
      total: 62,
      present: 45,
      absent: 17,
      absentees: Array.from({ length: 17 }, (_, i) => `21CSE${100 + i * 3}`),
      presentees: Array.from({ length: 45 }, (_, i) => `21CSE${100 + i}`),
    },
  ];

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  return sessions.map(s => ({
    ...s,
    date,
    isSynced: Math.random() > 0.2,
    isEditable: hoursDiff < 24,
    lastModified: Math.random() > 0.7 ? '4:05 PM' : undefined,
  }));
};

export const HistoryScreen: React.FC = () => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState(generateMockSessions(new Date()));
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Colors
  const colors = {
    background: isDark ? '#0A0A0A' : '#F8FAFC',
    headerBg: isDark ? 'rgba(10,10,10,0.95)' : 'rgba(248,250,252,0.95)',
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    gradientStart: '#0D4A4A',
    gradientMid: '#1A6B6B',
    gradientEnd: '#0F3D3D',
    dockBg: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
    dockBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    dockActive: '#3DDC97',
  };

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setLoading(true);
    setSelectedDate(date);
    
    // Simulate loading
    setTimeout(() => {
      setSessions(generateMockSessions(date));
      setLoading(false);
    }, 500);
  }, []);

  // Handle month selection
  const handleMonthSelect = useCallback((date: Date) => {
    handleDateSelect(date);
  }, [handleDateSelect]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSessions(generateMockSessions(selectedDate));
      setRefreshing(false);
    }, 1000);
  }, [selectedDate]);

  // Handle edit
  const handleEdit = (sessionId: string) => {
    // Navigate to edit screen or open modal
    console.log('Edit session:', sessionId);
  };

  // Format date for display
  const formatDisplayDate = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (selectedDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Gradient */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        {/* Title Row */}
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

        {/* Date Strip */}
        <DateStrip
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </LinearGradient>

      {/* Session List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gradientStart}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.gradientStart} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Fetching records...
            </Text>
          </View>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Records
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No attendance sessions found for this date
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Dock */}
      <View style={[styles.dock, { 
        backgroundColor: colors.dockBg,
        borderColor: colors.dockBorder,
        bottom: insets.bottom + 16,
      }]}>
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Month Picker Modal */}
      <MonthYearPicker
        visible={showMonthPicker}
        selectedDate={selectedDate}
        onSelect={handleMonthSelect}
        onClose={() => setShowMonthPicker(false)}
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
});

export default HistoryScreen;
