/**
 * FilterBar - Year/Section/Period filter component for HistoryScreen
 * Clean, theme-aware filter boxes with horizontal scrollable chips
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useColors } from '../../../hooks';
import { scale, verticalScale, moderateScale, normalizeFont } from '../../../utils/responsive';

// Filter options
const YEARS = ['all', '1', '2', '3', '4'];
const SECTIONS = ['all', 'A', 'B', 'C', 'D', 'E', 'F'];
const PERIODS = ['all', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

interface FilterBarProps {
  filterYear: string;
  filterSection: string;
  filterPeriod: string;
  onYearChange: (year: string) => void;
  onSectionChange: (section: string) => void;
  onPeriodChange: (period: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterYear,
  filterSection,
  filterPeriod,
  onYearChange,
  onSectionChange,
  onPeriodChange,
}) => {
  const colors = useColors();

  const renderFilterBox = (
    label: string,
    options: string[],
    selected: string,
    onSelect: (value: string) => void,
    displayFn?: (value: string) => string
  ) => (
    <View style={[styles.filterBox, { 
      backgroundColor: colors.inputBg,
      borderColor: colors.cardBorder,
    }]}>
      <Text style={[styles.filterLabel, { color: colors.textMuted }]}>{label}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterChips}
      >
        {options.map(opt => (
          <TouchableOpacity
            key={`${label}-${opt}`}
            style={[
              styles.filterChip,
              { backgroundColor: colors.inputBg },
              selected === opt && { backgroundColor: colors.indicator }
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text style={{ 
              color: selected === opt ? '#000' : colors.textSecondary,
              fontSize: normalizeFont(12),
              fontWeight: '600',
            }}>
              {displayFn ? displayFn(opt) : opt === 'all' ? 'All' : opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderFilterBox('Year', YEARS, filterYear, onYearChange)}
      {renderFilterBox('Section', SECTIONS, filterSection, onSectionChange)}
      {renderFilterBox('Period', PERIODS, filterPeriod, onPeriodChange)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(8),
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginHorizontal: scale(12),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: normalizeFont(11),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: scale(10),
    minWidth: scale(55),
  },
  filterChips: {
    flexDirection: 'row',
    gap: scale(6),
    paddingRight: scale(12),
  },
  filterChip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    minWidth: scale(36),
    alignItems: 'center',
  },
});

export default FilterBar;
