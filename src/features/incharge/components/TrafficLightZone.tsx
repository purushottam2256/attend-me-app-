/**
 * TrafficLightZone - Shows P1 & P4 attendance as traffic light indicators
 * 
 * Colors:
 * - Green: >90% attendance
 * - Yellow: 75-90%
 * - Red: <75%
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts';

interface PeriodData {
  slot_id: string;
  present_count: number;
  total_count: number;
  percentage: number;
}

interface TrafficLightZoneProps {
  p1: PeriodData | null;
  p4: PeriodData | null;
}

const getTrafficColor = (percentage: number): string => {
  if (percentage >= 90) return '#22C55E'; // Green
  if (percentage >= 75) return '#EAB308'; // Yellow
  return '#EF4444'; // Red
};

const getTrafficLabel = (percentage: number): string => {
  if (percentage >= 90) return 'Good';
  if (percentage >= 75) return 'Fair';
  return 'Critical';
};

const TrafficLight: React.FC<{
  label: string;
  time: string;
  data: PeriodData | null;
  isDark: boolean;
}> = ({ label, time, data, isDark }) => {
  const percentage = data?.percentage ?? 0;
  const color = data ? getTrafficColor(percentage) : 'rgba(255,255,255,0.2)';
  const status = data ? getTrafficLabel(percentage) : 'No Data';

  return (
    <View style={[styles.lightContainer, { 
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(13, 74, 74, 0.06)',
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    }]}>
      {/* Traffic Light Circle */}
      <View style={[styles.lightCircle, { backgroundColor: color, shadowColor: color }]}>
        {data ? (
          <Text style={styles.percentageText}>{percentage}%</Text>
        ) : (
          <Ionicons name="remove-outline" size={24} color="#FFF" />
        )}
      </View>
      
      {/* Info */}
      <Text style={[styles.periodLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
        {label}
      </Text>
      <Text style={[styles.timeText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
        {time}
      </Text>
      
      {/* Count */}
      {data && (
        <Text style={[styles.countText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
          {data.present_count}/{data.total_count}
        </Text>
      )}
      
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.statusText, { color }]}>{status}</Text>
      </View>
    </View>
  );
};

export const TrafficLightZone: React.FC<TrafficLightZoneProps> = ({ p1, p4 }) => {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="analytics-outline" size={18} color={isDark ? '#3DDC97' : '#0D4A4A'} />
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Key Periods
        </Text>
      </View>
      
      <View style={styles.lightsRow}>
        <TrafficLight 
          label="Period 1" 
          time="9:30 AM" 
          data={p1} 
          isDark={isDark} 
        />
        <TrafficLight 
          label="Period 4" 
          time="1:20 PM" 
          data={p4} 
          isDark={isDark} 
        />
      </View>
      
      {/* Insight */}
      <View style={[styles.insightBanner, { 
        backgroundColor: isDark ? 'rgba(61, 220, 151, 0.1)' : 'rgba(61, 220, 151, 0.08)',
      }]}>
        <Ionicons name="bulb-outline" size={14} color="#3DDC97" />
        <Text style={[styles.insightText, { color: isDark ? 'rgba(255,255,255,0.8)' : '#334155' }]}>
          P4 shows if students stayed after lunch
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  lightsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  lightContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  lightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 12,
  },
  percentageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    marginBottom: 6,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  insightText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TrafficLightZone;
