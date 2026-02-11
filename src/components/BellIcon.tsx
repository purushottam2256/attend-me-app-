import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale, normalizeFont } from '../utils/responsive';

interface BellIconProps {
  style?: any;
  size?: number;
  color?: string;
}

export const BellIcon = ({ style, size = moderateScale(24), color = '#FFF' }: BellIconProps) => {
  const { unreadCount } = useNotifications();
  const navigation = useNavigation();
  const handlePress = () => {
      // @ts-ignore
      navigation.navigate('Notifications');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
           <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 8, // Removed to allow external sizing
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: verticalScale(-5),
    right: scale(-5),
    backgroundColor: '#EF4444',
    borderRadius: moderateScale(10),
    minWidth: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(4),
    borderWidth: 1.5,
    borderColor: '#0D4A4A', // Match header bg for cutout effect
  },
  badgeText: {
    color: '#FFF',
    fontSize: normalizeFont(10),
    fontWeight: '700',
  },
  dot: { // Deprecated
    width: scale(8),
    height: scale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#FFFFFF',
  }
});
