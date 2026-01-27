/**
 * DateStrip - Horizontal scrollable date selector
 * Premium infinite scroll with active state indicator
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useColors } from '../../../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DATE_TILE_WIDTH = 56;

interface DateStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate dates for the past 30 days
  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Check if same day
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  // Format day name
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  };

  // Colors from global theme hook
  const colors = useColors();

  // Scroll to selected date on mount
  useEffect(() => {
    const index = dates.findIndex(d => isSameDay(d, selectedDate));
    if (index !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: index * (DATE_TILE_WIDTH + 10) - SCREEN_WIDTH / 2 + DATE_TILE_WIDTH / 2,
          animated: false,
        });
      }, 100);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date, index) => {
          const isActive = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateTile,
                {
                  backgroundColor: isActive ? colors.textPrimary : colors.inputBg,
                  borderColor: colors.cardBorder,
                },
              ]}
              onPress={() => onDateSelect(date)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayText,
                { color: isActive ? colors.background : colors.textSecondary }
              ]}>
                {formatDay(date)}
              </Text>
              <Text style={[
                styles.dateText,
                { color: isActive ? colors.background : colors.textPrimary }
              ]}>
                {date.getDate()}
              </Text>
              {isActive && <View style={[styles.indicator, { backgroundColor: colors.indicator }]} />}
              {isToday && !isActive && (
                <View style={[styles.todayDot, { backgroundColor: colors.indicator }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
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
});

export default DateStrip;
