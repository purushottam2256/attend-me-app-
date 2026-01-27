/**
 * Profile Screen
 * User settings with premium design
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { supabase } from '../../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileScreenProps {
  userName: string;
  onLogout: () => void;
}

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  color?: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userName, onLogout }) => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userDept, setUserDept] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('dept, role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserDept(profile.dept || '');
          setUserRole(profile.role || 'faculty');
        }
      }

      const biometric = await AsyncStorage.getItem('biometricEnabled');
      setBiometricEnabled(biometric === 'true');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    setBiometricEnabled(value);
    await AsyncStorage.setItem('biometricEnabled', value.toString());
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'faculty': return 'Faculty';
      case 'class_incharge': return 'Class Incharge';
      case 'hod': return 'HOD';
      case 'principal': return 'Principal';
      case 'management': return 'Management';
      case 'developer': return 'Developer';
      default: return role;
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={isDark ? ['#1E293B', '#0F172A'] : ['#166534', '#15803D']}
      style={[styles.header, { paddingTop: insets.top + 16 }]}
    >
      <View style={styles.avatarLarge}>
        <Text style={styles.avatarText}>
          {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.headerName}>{userName}</Text>
      <Text style={styles.headerEmail}>{userEmail}</Text>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{userDept}</Text>
        </View>
        <View style={[styles.badge, styles.roleBadge]}>
          <Text style={styles.badgeText}>{formatRole(userRole)}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {title}
      </Text>
      <View style={[styles.menuCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < items.length - 1 && styles.menuItemBorder,
              { borderBottomColor: isDark ? '#334155' : '#F1F5F9' },
            ]}
            onPress={item.onPress}
            disabled={item.isToggle}
            activeOpacity={item.isToggle ? 1 : 0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: `${item.color || '#166534'}15` }]}>
              <Ionicons name={item.icon} size={20} color={item.color || '#166534'} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {item.label}
              </Text>
              {item.value && (
                <Text style={[styles.menuValue, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {item.value}
                </Text>
              )}
            </View>
            {item.isToggle ? (
              <Switch
                value={item.toggleValue}
                onValueChange={item.onToggle}
                trackColor={{ false: isDark ? '#475569' : '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            ) : (
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#475569' : '#CBD5E1'} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('Appearance', [
          {
            icon: isDark ? 'moon' : 'sunny',
            label: 'Dark Mode',
            isToggle: true,
            toggleValue: isDark,
            onToggle: () => setTheme(isDark ? 'light' : 'dark'),
            color: isDark ? '#8B5CF6' : '#F59E0B',
          },
        ])}

        {renderSection('Security', [
          {
            icon: 'finger-print',
            label: 'Biometric Login',
            isToggle: true,
            toggleValue: biometricEnabled,
            onToggle: handleBiometricToggle,
            color: '#3B82F6',
          },
          {
            icon: 'lock-closed',
            label: 'Change Password',
            onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
            color: '#22C55E',
          },
        ])}

        {renderSection('Account', [
          {
            icon: 'person',
            label: 'Edit Profile',
            onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
            color: '#6366F1',
          },
          {
            icon: 'notifications',
            label: 'Notifications',
            value: 'Enabled',
            onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
            color: '#EC4899',
          },
          {
            icon: 'help-circle',
            label: 'Help & Support',
            onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
            color: '#14B8A6',
          },
        ])}

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: isDark ? '#475569' : '#94A3B8' }]}>
          MRCE Attend-Me v1.0.0
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuValue: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 24,
  },
});

export default ProfileScreen;
