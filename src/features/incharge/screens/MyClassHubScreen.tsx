/**
 * MyClassHubScreen - Main hub for Class Incharge
 * 
 * Features:
 * - Traffic Light Zone (P1 & P4)
 * - Weekly Trends
 * - Watchlist (Critical Students)
 * - Add Permission Button
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { TrafficLightZone, WatchlistCard, TrendsSection } from '../components';
import { useTheme } from '../../../contexts';
import { supabase } from '../../../config/supabase';
import {
  getWatchlist,
  getKeyPeriodAttendance,
  getWeeklyTrend,
  type StudentAggregate,
  type PeriodAttendance,
} from '../services/inchargeService';

interface ClassInfo {
  dept: string;
  year: number;
  section: string;
}

export const MyClassHubScreen: React.FC = () => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [p1, setP1] = useState<PeriodAttendance | null>(null);
  const [p4, setP4] = useState<PeriodAttendance | null>(null);
  const [watchlist, setWatchlist] = useState<StudentAggregate[]>([]);
  const [trendData, setTrendData] = useState<{ day: string; percentage: number }[]>([]);

  // Get class info from user profile
  const fetchClassInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('dept')
      .eq('id', user.id)
      .single();

    if (!profile?.dept) return null;

    // For now, assume incharge handles year 1, section A
    // In production, this would come from a class_assignments table
    return {
      dept: profile.dept,
      year: 3, // TODO: Get from class assignment
      section: 'A', // TODO: Get from class assignment
    };
  };

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const info = await fetchClassInfo();
      if (!info) {
        setLoading(false);
        return;
      }
      setClassInfo(info);

      // Fetch all data in parallel
      const [periods, students, trends] = await Promise.all([
        getKeyPeriodAttendance(info.dept, info.year, info.section),
        getWatchlist(info.dept, info.year, info.section, 75),
        getWeeklyTrend(info.dept, info.year, info.section),
      ]);

      setP1(periods.p1);
      setP4(periods.p4);
      setWatchlist(students.slice(0, 5)); // Show top 5
      setTrendData(trends);
    } catch (error) {
      console.error('[MyClassHub] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleAddPermission = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to Permission screen
    // navigation.navigate('Permission' as never);
  };

  // Theme colors
  const colors = {
    bg: isDark ? ['#0D4A4A', '#1A6B6B', '#0F3D3D'] : ['#F0FDF4', '#ECFDF5', '#F0FDF4'],
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : '#64748B',
    surface: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
    accent: '#3DDC97',
  };

  if (loading) {
    return (
      <LinearGradient colors={colors.bg as [string, string, string]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading class data...
        </Text>
      </LinearGradient>
    );
  }

  if (!classInfo) {
    return (
      <LinearGradient colors={colors.bg as [string, string, string]} style={styles.loadingContainer}>
        <Ionicons name="school-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          No Class Assigned
        </Text>
        <Text style={[styles.subText, { color: colors.textSecondary }]}>
          Please contact admin to assign a class
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.bg as [string, string, string]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              My Class
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {classInfo.dept} - Year {classInfo.year}, Section {classInfo.section}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.settingsBtn, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Profile' as never);
            }}
          >
            <Ionicons name="person-circle-outline" size={26} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Traffic Light Zone */}
        <TrafficLightZone p1={p1} p4={p4} />

        {/* Trends */}
        <TrendsSection data={trendData} />

        {/* Watchlist */}
        <View style={styles.watchlistSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleRow}>
              <Ionicons name="warning-outline" size={18} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Watchlist
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{watchlist.length}</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.viewAllText, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {watchlist.length === 0 ? (
            <View style={[styles.emptyCard, { 
              backgroundColor: colors.surface,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            }]}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#22C55E" />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                All students above 75% attendance! 🎉
              </Text>
            </View>
          ) : (
            watchlist.map((student) => (
              <WatchlistCard
                key={student.student_id}
                studentName={student.full_name}
                rollNo={student.roll_no}
                percentage={student.attendance_percentage}
              />
            ))
          )}
        </View>

        {/* Add Permission Section */}
        <View style={styles.permissionSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>
            Add Permission
          </Text>
          <View style={styles.permissionButtons}>
            <TouchableOpacity 
              style={[styles.permBtn, { backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.1)' }]}
              activeOpacity={0.7}
              onPress={handleAddPermission}
            >
              <Ionicons name="calendar-outline" size={20} color="#EAB308" />
              <Text style={[styles.permBtnText, { color: colors.textPrimary }]}>Leave</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.permBtn, { backgroundColor: isDark ? 'rgba(61, 220, 151, 0.15)' : 'rgba(61, 220, 151, 0.1)' }]}
              activeOpacity={0.7}
            >
              <Ionicons name="briefcase-outline" size={20} color="#3DDC97" />
              <Text style={[styles.permBtnText, { color: colors.textPrimary }]}>Dept Work</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.permBtn, { backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.1)' }]}
              activeOpacity={0.7}
            >
              <Ionicons name="people-outline" size={20} color="#4F46E5" />
              <Text style={[styles.permBtnText, { color: colors.textPrimary }]}>Club</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.permBtn, { backgroundColor: isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.1)' }]}
              activeOpacity={0.7}
            >
              <Ionicons name="megaphone-outline" size={20} color="#EC4899" />
              <Text style={[styles.permBtnText, { color: colors.textPrimary }]}>Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  subText: {
    fontSize: 13,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  permissionSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  permissionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  permBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  permBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default MyClassHubScreen;
