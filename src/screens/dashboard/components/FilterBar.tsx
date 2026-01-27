/**
 * FilterBar - Year/Section/Period filter component for HistoryScreen
 * Clean, theme-aware filter boxes with horizontal scrollable chips
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useColors } from '../../../hooks';

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
              fontSize: 12,
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
    paddingBottom: 8,
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
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 10,
    minWidth: 55,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
  },
});

export default FilterBar;
