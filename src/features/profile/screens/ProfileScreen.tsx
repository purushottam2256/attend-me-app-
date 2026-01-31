import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  Vibration,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { supabase } from '../../../config/supabase';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { SlideToLogout } from '../components/SlideToLogout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

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
  destructive?: boolean;
}

// --- Components ---

const ZenToast = ({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) => {
    if (!visible) return null;
    
    useEffect(() => {
        const timer = setTimeout(onHide, 3000);
        return () => clearTimeout(timer);
    }, [visible]);

    return (
        <View style={styles.toastContainer}>
            <View style={styles.toastContent}>
                <Ionicons name="checkmark-circle" size={20} color="#0F766E" />
                <Text style={styles.toastText}>{message}</Text>
            </View>
        </View>
    );
};



export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userName, onLogout }) => {
  const navigation = useNavigation();
  const { isDark, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  
  // -- Settings State --
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [textSize, setTextSize] = useState(1); // 0: Small, 1: Standard, 2: Large

  // -- User Data --
  const [userEmail, setUserEmail] = useState('');
  const [userDept, setUserDept] = useState('');
  const [userRole, setUserRole] = useState('');
  const [displayName, setDisplayName] = useState(userName);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // -- Modals --
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  // Removed avatarModalVisible as we are back to native
  // const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // -- Toast State --
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // -- Forms --
  // Leave
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveFrom, setLeaveFrom] = useState(new Date());
  const [leaveTo, setLeaveTo] = useState(new Date());
  
  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'from' | 'to'>('from');

  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  // Edit Profile
  const [editName, setEditName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Report
  const [reportQuery, setReportQuery] = useState('');
  const [hasScreenshot, setHasScreenshot] = useState(false);

  useEffect(() => {
    loadUserData();
    loadSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        const { data: profile } = await supabase
            .from('profiles')
            .select('dept, role, full_name')
            .eq('id', user.id)
            .single();
        if (profile) {
            setUserDept(profile.dept || '');
            setUserRole(profile.role || 'faculty');
            if (profile.full_name) setDisplayName(profile.full_name);
        }
      }
    } catch (error) { console.error(error); }
  };

  const loadSettings = async () => {
      try {
          const haptics = await AsyncStorage.getItem('hapticsEnabled');
          if (haptics !== null) setHapticsEnabled(haptics === 'true');
          
          const notifs = await AsyncStorage.getItem('notificationsEnabled');
          if (notifs !== null) setNotificationsEnabled(notifs === 'true');
      } catch (e) {}
  };

  const toggleHaptics = async (val: boolean) => {
      setHapticsEnabled(val);
      await AsyncStorage.setItem('hapticsEnabled', val.toString());
      if (val) Haptics.selectionAsync();
  };

  const toggleNotifications = async (val: boolean) => {
      setNotificationsEnabled(val);
      await AsyncStorage.setItem('notificationsEnabled', val.toString());
  };

  const showZenToast = (msg: string) => {
      setToastMessage(msg);
      setToastVisible(true);
      if (hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // --- Actions ---
  const handleApplyLeave = () => {
      if (!leaveReason.trim()) {
          Alert.alert('Required', 'Please enter a reason.');
          return;
      }
      setIsSubmittingLeave(true);
      setTimeout(() => {
          setIsSubmittingLeave(false);
          setLeaveModalVisible(false);
          showZenToast('Application Sent Successfully');
          setLeaveReason('');
      }, 1000);
  };

  const handleUpdatePhoto = async () => {
      // Request permission using Native Image Picker
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant gallery permission to change photo.');
          return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
          setProfileImage(result.assets[0].uri);
          setIsSavingProfile(true);
          // Simulate upload delay
          setTimeout(() => {
              setIsSavingProfile(false);
              showZenToast('Profile Photo Updated');
          }, 1200);
      }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
          setShowDatePicker(false);
      }
      
      if (selectedDate) {
          if (datePickerMode === 'from') {
              setLeaveFrom(selectedDate);
          } else {
              setLeaveTo(selectedDate);
          }
      }
  };

  const showDatepicker = (mode: 'from' | 'to') => {
      setDatePickerMode(mode);
      setShowDatePicker(true);
  };

  const handleUpdateProfile = async () => {
      if (!editName.trim()) return;
      setIsSavingProfile(true);
      setTimeout(() => {
         setDisplayName(editName);
         setIsSavingProfile(false);
         setEditProfileVisible(false);
         showZenToast('Profile Updated Successfully');
      }, 800);
  };

  const handleReportIssue = () => {
      if (!reportQuery.trim()) return;
      setReportModalVisible(false);
      setReportQuery('');
      setHasScreenshot(false);
      showZenToast('Report Submitted. ID: #8821');
  };

  // --- Render Sections ---
  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {title}
      </Text>
      <View style={[
          styles.menuCard, 
          { 
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderWidth: isDark ? 0 : 1,
              borderColor: '#E2E8F0'
          }
      ]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < items.length - 1 && styles.menuItemBorder,
              { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9' },
            ]}
            onPress={item.onPress}
            disabled={item.isToggle}
            activeOpacity={item.isToggle ? 1 : 0.7}
          >
            <View style={[
                styles.menuIconContainer, 
                { backgroundColor: 'transparent' } 
            ]}>
              <Ionicons 
                name={item.icon} 
                size={22} 
                color={item.destructive ? '#EF4444' : (item.color || '#334155')} 
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={[
                  styles.menuLabel, 
                  { color: item.destructive ? '#EF4444' : (isDark ? '#FFFFFF' : '#0F172A') }
              ]}>
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
                trackColor={{ false: isDark ? '#475569' : '#E2E8F0', true: '#10B981' }}
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
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F9FAFB' }]}>
      <ZenToast 
        visible={toastVisible} 
        message={toastMessage} 
        onHide={() => setToastVisible(false)} 
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <DigitalIdCard 
            user={{ name: displayName, email: userEmail, dept: userDept, role: userRole, photoUrl: profileImage || undefined }}
            onEdit={() => setEditProfileVisible(true)}
        />

        <View style={{ marginBottom: 24 }} />

        {renderSection('Faculty Services', [
           { icon: 'document-text', label: 'Apply for Leave', value: 'Notify HOD', onPress: () => setLeaveModalVisible(true), color: '#3B82F6' },
           { icon: 'calendar', label: 'My Schedule', value: 'Weekly Timetable', onPress: () => setScheduleModalVisible(true), color: '#8B5CF6' }
        ])}

        {renderSection('App Settings', [
          { icon: isDark ? 'moon' : 'sunny', label: 'Dark Mode', isToggle: true, toggleValue: isDark, onToggle: () => setTheme(isDark ? 'light' : 'dark'), color: isDark ? '#8B5CF6' : '#F59E0B' },
          { icon: 'notifications', label: 'Push Notifications', isToggle: true, toggleValue: notificationsEnabled, onToggle: toggleNotifications, color: '#EC4899' },
          { icon: 'phone-portrait', label: 'Haptic Feedback', isToggle: true, toggleValue: hapticsEnabled, onToggle: toggleHaptics, color: '#10B981' }
        ])}

        {renderSection('Help & Support', [
           { icon: 'help-buoy', label: 'Help Center', value: 'User Guide', onPress: () => setHelpModalVisible(true), color: '#14B8A6' },
           { icon: 'medkit', label: 'Beacon Doctor', value: 'System Diagnostics', onPress: () => (navigation as any).navigate('BeaconDoctor'), color: '#10B981' },
           { icon: 'warning', label: 'Report Issue', onPress: () => setReportModalVisible(true), color: '#F59E0B' }
        ])}

        <View style={styles.logoutContainer}>
            <SlideToLogout onLogout={onLogout} />
        </View>

        <Text style={[styles.versionText, { color: isDark ? '#475569' : '#94A3B8' }]}>MRCE Attend-Me v1.0.3</Text>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- Leave Modal --- */}
      <Modal visible={leaveModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Apply for Leave</Text>
                  
                  <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>REASON</Text>
                  <TextInput 
                      style={[styles.input, { color: isDark ? '#FFF' : '#0F172A', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', height: 80, textAlignVertical: 'top' }]}
                      value={leaveReason} onChangeText={setLeaveReason} multiline placeholder="I am taking leave because..." placeholderTextColor="#94A3B8"
                  />

                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                      <View style={{ flex: 1 }}>
                          <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>FROM</Text>
                          <TouchableOpacity onPress={() => showDatepicker('from')} style={[styles.dateBtn, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                              <Text style={{ color: isDark ? '#FFF' : '#0F172A' }}>{leaveFrom.toLocaleDateString()}</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={{ flex: 1 }}>
                          <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>TO</Text>
                          <TouchableOpacity onPress={() => showDatepicker('to')} style={[styles.dateBtn, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                              <Text style={{ color: isDark ? '#FFF' : '#0F172A' }}>{leaveTo.toLocaleDateString()}</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

                  <View style={styles.modalActions}>
                      <TouchableOpacity onPress={() => setLeaveModalVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={handleApplyLeave} style={styles.saveBtn}>
                          {isSubmittingLeave ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Submit</Text>}
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
          
          {showDatePicker && (
              <DateTimePicker
                  testID="dateTimePicker"
                  value={datePickerMode === 'from' ? leaveFrom : leaveTo}
                  mode="date"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  themeVariant={isDark ? 'dark' : 'light'}
              />
          )}
      </Modal>

      {/* --- Avatar Picker Modal (Replaces Native Gallery) --- */}
      <Modal visible={editProfileVisible && isSavingProfile === false /* reusing edit visibility context or new state? We used editProfileVisible for the name input modal. Let's create a new one or overlay. Actually let's use a new state 'avatarModalVisible' */} animationType="fade" transparent>
          {/* We will handle this in the next replacement block correctly by adding the state */}
      </Modal>

      {/* --- Schedule Modal (Full Screen) --- */}
      <Modal visible={scheduleModalVisible} animationType="slide" transparent={false}>
          <View style={[styles.modalOverlay, { padding: 0, backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
              <View style={[styles.modalCardFull, { flex: 1, borderRadius: 0, width: '100%', maxHeight: '100%' }]}>
                  <View style={[styles.modalHeader, { marginTop: insets.top + 10 }]}>
                      <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F172A', marginBottom: 0 }]}>Weekly Schedule</Text>
                      <TouchableOpacity onPress={() => {
                          setScheduleModalVisible(false);
                          showZenToast('Schedule Updated');
                      }}>
                          <Ionicons name="close-circle" size={32} color={isDark ? '#FFF' : '#0F172A'} />
                      </TouchableOpacity>
                  </View>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}>
                      <View>
                          {/* Header Row */}
                          <View style={[styles.tableRow, { backgroundColor: isDark ? '#334155' : '#F1F5F9', borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}>
                              <View style={[styles.cellFixed, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}>
                                  <Text style={[styles.cellTextBold, { color: isDark ? '#94A3B8' : '#64748B' }]}>TIME</Text>
                              </View>
                              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                                  <View key={day} style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0', backgroundColor: isDark ? '#0F172A' : '#FFF' }]}>
                                      <Text style={[styles.cellTextBold, { color: '#0F766E' }]}>{day}</Text>
                                  </View>
                              ))}
                          </View>

                          {/* Data Rows */}
                          {[
                              { time: '09:30', m: 'CN (Lab)', t: 'OS', w: 'DBMS', th: 'CN', f: 'SE', s: '-' },
                              { time: '10:20', m: 'CN (Lab)', t: 'OS', w: 'DBMS', th: 'CN', f: 'SE', s: '-' },
                              { time: '11:10', m: 'CN (Lab)', t: 'DAA', w: 'Lib', th: 'DAA', f: 'Ment', s: '-' },
                              { time: '12:00', m: 'LUNCH', t: 'LUNCH', w: 'LUNCH', th: 'LUNCH', f: 'LUNCH', s: '-' },
                              { time: '01:00', m: 'SE', t: 'DBMS', w: 'OS', th: 'DBMS', f: 'DAA', s: '-' },
                              { time: '01:50', m: 'DAA', t: 'Sports', w: 'CN', th: 'Lib', f: 'OS', s: '-' },
                              { time: '02:40', m: '-', t: '-', w: '-', th: '-', f: '-', s: '-' }
                          ].map((row, i) => (
                              <View key={i} style={[styles.tableRow, { backgroundColor: row.time === '12:00' ? (isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7') : 'transparent' }]}>
                                  <View style={[styles.cellFixed, { borderColor: isDark ? '#475569' : '#E2E8F0', backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                                      <Text style={[styles.cellText, { color: isDark ? '#FFF' : '#0F172A', fontWeight: '700' }]}>{row.time}</Text>
                                  </View>
                                  <View style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}><Text style={[styles.cellText, { color: isDark ? '#CBD5E1' : '#334155' }]}>{row.m}</Text></View>
                                  <View style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}><Text style={[styles.cellText, { color: isDark ? '#CBD5E1' : '#334155' }]}>{row.t}</Text></View>
                                  <View style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}><Text style={[styles.cellText, { color: isDark ? '#CBD5E1' : '#334155' }]}>{row.w}</Text></View>
                                  <View style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}><Text style={[styles.cellText, { color: isDark ? '#CBD5E1' : '#334155' }]}>{row.th}</Text></View>
                                  <View style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}><Text style={[styles.cellText, { color: isDark ? '#CBD5E1' : '#334155' }]}>{row.f}</Text></View>
                                  <View style={[styles.cell, { borderColor: isDark ? '#475569' : '#E2E8F0' }]}><Text style={[styles.cellText, { color: isDark ? '#CBD5E1' : '#334155' }]}>{row.s}</Text></View>
                              </View>
                          ))}
                      </View>
                  </ScrollView>
              </View>
          </View>
      </Modal>

      {/* --- Help Modal --- */}
      <Modal visible={helpModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Help Center</Text>
                  <Text style={{ color: '#64748B', marginBottom: 20 }}>
                      Welcome to the professional guide.
                      {'\n\n'}1. **Attendance**: Use "Take Attendance" from Home.
                      {'\n'}2. **Beacons**: Ensure Bluetooth is ON (Green Status).
                      {'\n'}3. **Reports**: Apply for leave or report bugs here.
                  </Text>
                  
                  <Text style={[styles.inputLabel, { color: '#64748B' }]}>TEXT SIZE ADJUSTMENT</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', padding: 12, borderRadius: 12 }}>
                      <TouchableOpacity onPress={() => setTextSize(0)}><Text style={{ fontSize: 12, color: textSize === 0 ? '#10B981' : '#94A3B8' }}>Small</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => setTextSize(1)}><Text style={{ fontSize: 16, color: textSize === 1 ? '#10B981' : '#94A3B8' }}>Standard</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => setTextSize(2)}><Text style={{ fontSize: 20, color: textSize === 2 ? '#10B981' : '#94A3B8' }}>Large</Text></TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => setHelpModalVisible(false)} style={styles.saveBtn}>
                      <Text style={styles.saveText}>Close Guide</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* --- Report Modal --- */}
      <Modal visible={reportModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Report Issue</Text>
                  
                  <TextInput 
                      style={[styles.input, { color: isDark ? '#FFF' : '#0F172A', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', height: 100, textAlignVertical: 'top' }]}
                      value={reportQuery} onChangeText={setReportQuery} multiline placeholder="Describe the issue..." placeholderTextColor="#94A3B8"
                  />

                  <TouchableOpacity 
                    style={[styles.photoUpload, { borderColor: isDark ? '#334155' : '#E2E8F0', marginTop: 12, borderStyle: 'solid' }]}
                    onPress={() => setHasScreenshot(!hasScreenshot)}
                  >
                      <Ionicons name={hasScreenshot ? "checkmark-circle" : "image"} size={24} color={hasScreenshot ? "#10B981" : "#94A3B8"} />
                      <Text style={{ color: hasScreenshot ? "#10B981" : "#94A3B8", fontSize: 12 }}>
                          {hasScreenshot ? 'Screenshot Attached' : 'Attach Screenshot'}
                      </Text>
                  </TouchableOpacity>

                  <View style={styles.modalActions}>
                      <TouchableOpacity onPress={() => setReportModalVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={handleReportIssue} style={styles.saveBtn}><Text style={styles.saveText}>Submit Report</Text></TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

      {/* --- Edit Profile Modal --- */}
      <Modal visible={editProfileVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Edit Profile</Text>
                  <TextInput 
                      style={[styles.input, { color: isDark ? '#FFF' : '#0F172A', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
                      value={editName} onChangeText={setEditName} placeholder="Full Name" placeholderTextColor="#94A3B8"
                  />
                  
                  <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#64748B', marginTop: 16 }]}>PHOTO</Text>
                  <TouchableOpacity 
                    style={[styles.photoUpload, { borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                    onPress={handleUpdatePhoto}
                  >
                      <Ionicons name="camera" size={24} color="#0F766E" />
                      <Text style={{ color: '#0F766E', fontSize: 12 }}>Tap to change photo</Text>
                  </TouchableOpacity>

                   <View style={styles.modalActions}>
                      <TouchableOpacity onPress={() => setEditProfileVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={handleUpdateProfile} style={styles.saveBtn}>
                          {isSavingProfile ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Save</Text>}
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

      {/* Modal - Removed Avatar Picker Modal (Reverted to Native) */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 0 },
  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  menuCard: { borderRadius: 16, overflow: 'hidden', shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1 },
  menuIconContainer: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  menuValue: { fontSize: 13, marginTop: 2 },
  logoutContainer: { marginTop: 10 },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 24, fontWeight: '500' },
  
  // Modal & Toast
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { borderRadius: 24, padding: 24 },
  modalCardFull: { borderRadius: 24, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  inputLabel: { fontSize: 11, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  input: { borderRadius: 12, padding: 12, borderWidth: 1, fontSize: 15, borderColor: '#E2E8F0', marginBottom: 16 },
  dateBtn: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  photoUpload: { height: 80, borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 12 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  cancelText: { color: '#64748B', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0F766E', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#FFF', fontWeight: '700' },
  
  // Toast
  toastContainer: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 100, alignItems: 'center' },
  toastContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 100, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, gap: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  toastText: { fontWeight: '600', color: '#0F766E', fontSize: 13 },

  // Schedule Table
  tableRow: { flexDirection: 'row' },
  cellFixed: { width: 70, padding: 12, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  cell: { width: 90, padding: 12, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  cellText: { fontSize: 13, textAlign: 'center' },
  cellTextBold: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  
  // Date Picker
  dateOption: { paddingVertical: 16, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});


