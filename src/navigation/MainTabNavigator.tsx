/**
 * Main Tab Navigator with Floating Dock
 * 
 * Features:
 * - Floating dock container (not attached to bottom)
 * - Frosted glass effect
 * - Elevated SCAN button
 * - Premium design language
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { HomeScreen } from '../features/dashboard';
import { AttendanceScreen } from '../features/attendance';
import { HistoryScreen } from '../features/history';
import { ProfileScreen } from '../features/profile';
import { ScanScreen } from '../features/scanning';
import { SwapScreen } from '../features/swap';
import { MyClassHubScreen } from '../features/incharge';
import { useTheme } from '../contexts';

export type MainTabParamList = {
  Home: undefined;
  Delegate: undefined;
  Scan: undefined;
  History: undefined;
  MyClass: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface MainTabNavigatorProps {
  userName: string;
  userRole?: 'faculty' | 'class_incharge' | 'lab_incharge' | 'hod' | 'management';
  onLogout: () => void;
}

// Custom Floating Scan Button
const ScanButton: React.FC<BottomTabBarButtonProps> = ({ onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected;
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity 
      style={styles.scanButtonContainer} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[
        styles.scanButton, 
        focused && styles.scanButtonFocused,
        { transform: [{ scale: scaleValue }] }
      ]}>
        <Ionicons name="scan" size={24} color="#FFFFFF" />
      </Animated.View>
      <Text style={styles.scanLabel}>Scan</Text>
    </TouchableOpacity>
  );
};

// Placeholder screens with premium design
const DelegateScreen: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: isDark ? '#0F172A' : '#F0FDF4' }]}>
      <View style={[styles.placeholderIcon, { backgroundColor: 'rgba(61, 220, 151, 0.15)' }]}>
        <Ionicons name="swap-horizontal" size={48} color="#3DDC97" />
      </View>
      <Text style={[styles.placeholderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
        Swap Classes
      </Text>
      <Text style={[styles.placeholderDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
        Request class swaps or substitutes
      </Text>
    </View>
  );
};

// MyClassScreen is imported from features/incharge

export const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ userName, userRole, onLogout }) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Class incharges and lab incharges see MyClass instead of Profile in dock
  const showMyClass = userRole === 'class_incharge' || userRole === 'lab_incharge';
  
  const bottomOffset = Math.max(insets.bottom, 12) + 8;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Delegate':
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
              break;
            case 'Scan':
              iconName = 'scan';
              break;
            case 'History':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'MyClass':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={23} color={color} />;
        },
        tabBarActiveTintColor: isDark ? '#3DDC97' : '#0D4A4A',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        tabBarStyle: [
          styles.floatingDock,
          { 
            bottom: bottomOffset,
            backgroundColor: isDark ? 'rgba(13, 74, 74, 0.92)' : 'rgba(255, 255, 255, 0.92)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(61, 220, 151, 0.15)' : 'rgba(0, 0, 0, 0.06)',
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarBackground: () => (
          <BlurView 
            intensity={isDark ? 60 : 80} 
            style={[StyleSheet.absoluteFill, styles.blurContainer]}
            tint={isDark ? 'dark' : 'light'}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="Home"
        options={{ tabBarLabel: 'Home' }}
      >
        {() => <HomeScreen userName={userName} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Delegate"
        component={SwapScreen}
        options={{ tabBarLabel: 'Swap' }}
      />
      
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <ScanButton {...props} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ tabBarLabel: 'History' }}
      />
      
      {/* MyClass - visible in dock for class/lab incharges */}
      <Tab.Screen 
        name="MyClass"
        component={MyClassHubScreen}
        options={{ 
          tabBarLabel: 'My Class',
          tabBarButton: showMyClass ? undefined : () => null, // Hide from dock if not incharge
        }}
      />
      
      {/* Profile - visible in dock for non-incharges, but always navigable */}
      <Tab.Screen 
        name="Profile"
        options={{ 
          tabBarLabel: 'Profile',
          tabBarButton: showMyClass ? () => null : undefined, // Hide from dock for incharges
        }}
      >
        {() => <ProfileScreen userName={userName} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  floatingDock: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 35,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  blurContainer: {
    borderRadius: 35,
    overflow: 'hidden',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  tabItem: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  scanButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  scanButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0D4A4A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0D4A4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  scanButtonFocused: {
    backgroundColor: '#1A6B6B',
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0D4A4A',
    marginTop: 4,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  placeholderDesc: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MainTabNavigator;
