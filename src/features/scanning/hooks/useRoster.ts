/**
 * useRoster - Fetches and manages class roster from Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../config/supabase';

export type StudentStatus = 'pending' | 'present' | 'absent' | 'od';

export interface RosterStudent {
  id: string;
  studentId: string;
  name: string;
  rollNo: string;
  bleUUID?: string;
  status: StudentStatus;
  detectedAt?: number;
  reason?: string; // For OD/Leave reason
}

interface UseRosterOptions {
  classId?: string;
  targetDept?: string;
  targetYear?: number;
  targetSection?: string;
  batch?: number | null;
}

interface UseRosterReturn {
  roster: RosterStudent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateStudentStatus: (studentId: string, status: StudentStatus) => void;
  markAsPresent: (bleUUID: string) => boolean;
  presentCount: number;
  absentCount: number;
  odCount: number;
  totalCount: number;
}

export const useRoster = (options: UseRosterOptions): UseRosterReturn => {
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { targetDept, targetYear, targetSection, batch } = options;

  // Fetch roster from Supabase
  const fetchRoster = useCallback(async () => {
    if (!targetDept || !targetYear || !targetSection) {
      setError('Missing class parameters');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query students table with filters
      let query = supabase
        .from('students')
        .select('id, student_id, name, roll_no, ble_uuid, batch')
        .eq('dept', targetDept)
        .eq('year', targetYear)
        .eq('section', targetSection)
        .order('roll_no', { ascending: true });

      // Filter by batch if specified (for labs)
      if (batch && batch !== null) {
        query = query.eq('batch', batch);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform to RosterStudent format
      const students: RosterStudent[] = (data || []).map((s: any) => ({
        id: s.id,
        studentId: s.student_id,
        name: s.name,
        rollNo: s.roll_no,
        bleUUID: s.ble_uuid,
        status: 'pending' as StudentStatus,
        detectedAt: undefined,
      }));

      setRoster(students);
    } catch (err: any) {
      console.error('Error fetching roster:', err);
      setError(err.message || 'Failed to load roster');
      
      // Use mock data on error (for development)
      const mockRoster: RosterStudent[] = Array.from({ length: 60 }, (_, i) => ({
        id: `student-${i + 1}`,
        studentId: `STU${String(i + 1).padStart(4, '0')}`,
        name: `Student ${i + 1}`,
        rollNo: `${targetDept}${String(i + 1).padStart(3, '0')}`,
        bleUUID: `uuid-${i + 1}`,
        status: 'pending' as StudentStatus,
      }));
      setRoster(mockRoster);
    } finally {
      setLoading(false);
    }
  }, [targetDept, targetYear, targetSection, batch]);

  // Initial fetch
  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  // Update a student's status
  const updateStudentStatus = useCallback((studentId: string, status: StudentStatus) => {
    setRoster(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, status, detectedAt: status === 'present' ? Date.now() : s.detectedAt }
        : s
    ));
  }, []);

  // Mark student as present by BLE UUID (returns true if found)
  const markAsPresent = useCallback((bleUUID: string): boolean => {
    let found = false;
    setRoster(prev => prev.map(s => {
      if (s.bleUUID === bleUUID && s.status === 'pending') {
        found = true;
        return { ...s, status: 'present' as StudentStatus, detectedAt: Date.now() };
      }
      return s;
    }));
    return found;
  }, []);

  // Derived counts
  const presentCount = roster.filter(s => s.status === 'present').length;
  const absentCount = roster.filter(s => s.status === 'absent' || s.status === 'pending').length;
  const odCount = roster.filter(s => s.status === 'od').length;
  const totalCount = roster.length;

  return {
    roster,
    loading,
    error,
    refresh: fetchRoster,
    updateStudentStatus,
    markAsPresent,
    presentCount,
    absentCount,
    odCount,
    totalCount,
  };
};

export default useRoster;
