/**
 * Incharge Service - API calls for Class Incharge Hub
 */

import { supabase } from '../../../config/supabase';

// Types
export interface StudentAggregate {
  student_id: string;
  roll_no: string;
  full_name: string;
  dept: string;
  section: string;
  year: number;
  present_sessions: number;
  absent_sessions: number;
  od_sessions: number;
  leave_sessions: number;
  total_sessions: number;
  attendance_percentage: number;
  last_attendance_date: string | null;
}

export interface PeriodAttendance {
  slot_id: string;
  present_count: number;
  total_count: number;
  percentage: number;
}

export interface Permission {
  id: string;
  student_id: string;
  type: 'od' | 'leave';
  category?: 'dept_work' | 'club_work' | 'event' | 'drive' | 'other';
  reason?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  granted_by: string;
  is_active: boolean;
  created_at: string;
}

// Fetch class students with aggregates
export const getClassStudents = async (
  dept: string,
  year: number,
  section: string
): Promise<StudentAggregate[]> => {
  const { data, error } = await supabase
    .from('view_student_aggregates')
    .select('*')
    .eq('dept', dept)
    .eq('year', year)
    .eq('section', section)
    .order('roll_no');

  if (error) {
    console.error('[InchargeService] Error fetching students:', error);
    throw error;
  }

  return data || [];
};

// Get watchlist (critical students <75%)
export const getWatchlist = async (
  dept: string,
  year: number,
  section: string,
  threshold: number = 75
): Promise<StudentAggregate[]> => {
  const { data, error } = await supabase
    .from('view_student_aggregates')
    .select('*')
    .eq('dept', dept)
    .eq('year', year)
    .eq('section', section)
    .lt('attendance_percentage', threshold)
    .order('attendance_percentage', { ascending: true });

  if (error) {
    console.error('[InchargeService] Error fetching watchlist:', error);
    throw error;
  }

  return data || [];
};

// Get today's period attendance for P1 and P4
export const getKeyPeriodAttendance = async (
  dept: string,
  year: number,
  section: string
): Promise<{ p1: PeriodAttendance | null; p4: PeriodAttendance | null }> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select(`
      slot_id,
      present_count,
      total_students
    `)
    .eq('target_dept', dept)
    .eq('target_year', year)
    .eq('target_section', section)
    .eq('date', today)
    .in('slot_id', ['p1', 'p4']);

  if (error) {
    console.error('[InchargeService] Error fetching period attendance:', error);
    throw error;
  }

  const p1Session = data?.find(s => s.slot_id === 'p1');
  const p4Session = data?.find(s => s.slot_id === 'p4');

  return {
    p1: p1Session ? {
      slot_id: 'p1',
      present_count: p1Session.present_count || 0,
      total_count: p1Session.total_students || 0,
      percentage: p1Session.total_students > 0 
        ? Math.round((p1Session.present_count / p1Session.total_students) * 100) 
        : 0,
    } : null,
    p4: p4Session ? {
      slot_id: 'p4',
      present_count: p4Session.present_count || 0,
      total_count: p4Session.total_students || 0,
      percentage: p4Session.total_students > 0 
        ? Math.round((p4Session.present_count / p4Session.total_students) * 100) 
        : 0,
    } : null,
  };
};

// Get weekly attendance trend
export const getWeeklyTrend = async (
  dept: string,
  year: number,
  section: string
): Promise<{ day: string; percentage: number }[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const { data, error } = await supabase
    .from('view_dept_attendance_summary')
    .select('date, attendance_percentage')
    .eq('target_dept', dept)
    .eq('target_year', year)
    .eq('target_section', section)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date');

  if (error) {
    console.error('[InchargeService] Error fetching weekly trend:', error);
    throw error;
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (data || []).map(d => ({
    day: dayNames[new Date(d.date).getDay()],
    percentage: d.attendance_percentage || 0,
  }));
};

// Check permission overlap
export const checkPermissionOverlap = async (
  studentId: string,
  type: 'od' | 'leave',
  startDate: string,
  endDate: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('attendance_permissions')
    .select('id')
    .eq('student_id', studentId)
    .eq('type', type)
    .eq('is_active', true)
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  if (error) {
    console.error('[InchargeService] Error checking overlap:', error);
    throw error;
  }

  return (data?.length || 0) > 0;
};

// Add permission (OD or Leave)
export const addPermission = async (
  permission: Omit<Permission, 'id' | 'created_at' | 'is_active'>
): Promise<Permission> => {
  // First check for overlap
  const hasOverlap = await checkPermissionOverlap(
    permission.student_id,
    permission.type,
    permission.start_date,
    permission.end_date
  );

  if (hasOverlap) {
    throw new Error(`Conflict: Student already has ${permission.type} on overlapping date range`);
  }

  const { data, error } = await supabase
    .from('attendance_permissions')
    .insert({
      ...permission,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('[InchargeService] Error adding permission:', error);
    throw error;
  }

  return data;
};

// Get student by roll number
export const getStudentByRollNo = async (
  rollNo: string,
  dept: string,
  section: string
): Promise<{ id: string; full_name: string; roll_no: string } | null> => {
  const { data, error } = await supabase
    .from('students')
    .select('id, full_name, roll_no')
    .eq('roll_no', rollNo)
    .eq('dept', dept)
    .eq('section', section)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('[InchargeService] Error fetching student:', error);
    throw error;
  }

  return data;
};

export default {
  getClassStudents,
  getWatchlist,
  getKeyPeriodAttendance,
  getWeeklyTrend,
  checkPermissionOverlap,
  addPermission,
  getStudentByRollNo,
};
