import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts';
import { scale, verticalScale, moderateScale, normalizeFont } from '../../../utils/responsive';
import { StudentAggregate } from '../services/inchargeService';

interface StudentSelectionListProps {
  students: StudentAggregate[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  activeColor?: string;
  activeBgColor?: string;
}

export const StudentSelectionList: React.FC<StudentSelectionListProps> = ({
  students,
  selectedIds,
  onToggle,
  activeColor = '#3DDC97',
  activeBgColor,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Colors
  const colors = {
    text: isDark ? '#FFFFFF' : '#0F172A',
    textSec: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    inputBg: isDark ? '#1E293B' : '#F1F5F9',
    selectedBg: activeBgColor || (isDark ? 'rgba(61, 220, 151, 0.15)' : '#ECFDF5'),
    selectedBorder: activeColor,
    avatarBg: isDark ? '#334155' : '#E2E8F0',
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const lower = searchQuery.toLowerCase();
    return students.filter(
      s => 
        s.full_name.toLowerCase().includes(lower) || 
        s.roll_no.toLowerCase().includes(lower)
    );
  }, [students, searchQuery]);

  const renderItem = ({ item }: { item: StudentAggregate }) => {
    const isSelected = selectedIds.has(item.student_id);

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { 
            backgroundColor: isSelected ? colors.selectedBg : 'transparent',
            borderColor: isSelected ? colors.selectedBorder : colors.border,
            borderBottomWidth: 1, // Always show separator
          }
        ]}
        onPress={() => onToggle(item.student_id)}
        activeOpacity={0.7}
      >
        <View style={styles.left}>
            {/* Avatar Placeholder */}
            <View style={[styles.avatar, { backgroundColor: isSelected ? colors.selectedBorder : colors.avatarBg }]}>
                <Text style={[styles.avatarText, { color: isSelected ? '#fff' : colors.textSec }]}>
                    {item.full_name.substring(0, 2).toUpperCase()}
                </Text>
            </View>
            
            <View>
                <Text style={[styles.name, { color: colors.text }]}>{item.full_name}</Text>
                <Text style={[styles.roll, { color: colors.textSec }]}>{item.roll_no}</Text>
            </View>
        </View>

        <View style={styles.checkbox}>
            {isSelected ? (
                <Ionicons name="checkmark-circle" size={normalizeFont(24)} color={colors.selectedBorder} />
            ) : (
                <Ionicons name="ellipse-outline" size={normalizeFont(24)} color={colors.textSec} />
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="search" size={normalizeFont(20)} color={colors.textSec} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Search by name or roll number..."
                placeholderTextColor={colors.textSec}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={normalizeFont(18)} color={colors.textSec} />
                </TouchableOpacity>
            )}
        </View>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.student_id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: scale(16),
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  input: {
    flex: 1,
    fontSize: normalizeFont(15),
  },
  listContent: {
    paddingBottom: verticalScale(20),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderBottomWidth: 1,
  },
  left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
  },
  avatar: {
      width: scale(40),
      height: scale(40),
      borderRadius: moderateScale(20),
      alignItems: 'center',
      justifyContent: 'center',
  },
  avatarText: {
      fontSize: normalizeFont(14),
      fontWeight: '600',
  },
  name: {
      fontSize: normalizeFont(15),
      fontWeight: '600',
  },
  roll: {
      fontSize: normalizeFont(13),
      marginTop: verticalScale(2),
  },
  checkbox: {
      paddingLeft: scale(16),
  }
});
