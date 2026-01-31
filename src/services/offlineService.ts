/**
 * Offline Service - Roster Caching & Submission Queue
 * 
 * Features:
 * - Cache all today's class rosters when online
 * - Retrieve cached rosters when offline
 * - Queue attendance submissions for later sync
 * - Auto-sync pending submissions when online
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

// Storage keys
const STORAGE_KEYS = {
  CACHED_ROSTERS: '@attend_me/cached_rosters',
  ROSTER_CACHE_DATE: '@attend_me/roster_cache_date',
  PENDING_SUBMISSIONS: '@attend_me/pending_submissions',
  LAST_SYNC_TIME: '@attend_me/last_sync_time',
};

// Types
export interface CachedRoster {
  classId: string;
  slotId: number;
  subjectName: string;
  section: string;
  students: CachedStudent[];
  cachedAt: string;
}

export interface CachedStudent {
  id: string;
  name: string;
  rollNo: string;
  bluetoothUUID: string | null;
  batch?: number;
}

export interface PendingSubmission {
  id: string;
  classData: {
    slotId: number;
    subjectName: string;
    section: string;
  };
  attendance: {
    studentId: string;
    status: 'present' | 'absent' | 'od' | 'leave';
  }[];
  submittedAt: string;
  retryCount: number;
}

export interface SyncStatus {
  lastSyncTime: string | null;
  pendingCount: number;
  isExpired: boolean;
}

// ============================================================================
// ROSTER CACHING
// ============================================================================

/**
 * Cache all rosters for today's classes
 * Call this in the morning when online
 */
export async function cacheAllRosters(
  schedule: Array<{ slot_id: number; subject?: { name: string }; target_dept: string; target_year: number; target_section: string }>
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log('[OfflineService] Caching rosters for', schedule.length, 'classes');
    
    const cachedRosters: { [key: string]: CachedRoster } = {};
    
    for (const slot of schedule) {
      const classKey = `${slot.slot_id}`;
      
      // Fetch students for this class
      const { data: students, error } = await supabase
        .from('students')
        .select('id, name, roll_number, bluetooth_uuid, batch')
        .eq('department', slot.target_dept)
        .eq('year', slot.target_year)
        .eq('section', slot.target_section)
        .order('roll_number');
      
      if (error) {
        console.error('[OfflineService] Error fetching roster for slot', slot.slot_id, error);
        continue;
      }
      
      cachedRosters[classKey] = {
        classId: classKey,
        slotId: slot.slot_id,
        subjectName: slot.subject?.name || 'Unknown',
        section: `${slot.target_dept}-${slot.target_year}-${slot.target_section}`,
        students: (students || []).map(s => ({
          id: s.id,
          name: s.name,
          rollNo: s.roll_number,
          bluetoothUUID: s.bluetooth_uuid,
          batch: s.batch,
        })),
        cachedAt: new Date().toISOString(),
      };
    }
    
    // Store in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_ROSTERS, JSON.stringify(cachedRosters));
    await AsyncStorage.setItem(STORAGE_KEYS.ROSTER_CACHE_DATE, new Date().toISOString().split('T')[0]);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
    
    console.log('[OfflineService] Cached', Object.keys(cachedRosters).length, 'rosters');
    
    return { success: true, count: Object.keys(cachedRosters).length };
  } catch (error) {
    console.error('[OfflineService] Error caching rosters:', error);
    return { success: false, count: 0, error: String(error) };
  }
}

/**
 * Get cached roster for a specific class
 */
export async function getCachedRoster(slotId: number): Promise<CachedRoster | null> {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ROSTERS);
    if (!cached) return null;
    
    const rosters = JSON.parse(cached) as { [key: string]: CachedRoster };
    return rosters[String(slotId)] || null;
  } catch (error) {
    console.error('[OfflineService] Error getting cached roster:', error);
    return null;
  }
}

/**
 * Check if cache is valid (same day)
 */
export async function isCacheValid(): Promise<boolean> {
  try {
    const cacheDate = await AsyncStorage.getItem(STORAGE_KEYS.ROSTER_CACHE_DATE);
    if (!cacheDate) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return cacheDate === today;
  } catch {
    return false;
  }
}

// ============================================================================
// SUBMISSION QUEUE
// ============================================================================

/**
 * Queue attendance submission for later sync
 */
export async function queueSubmission(submission: Omit<PendingSubmission, 'id' | 'retryCount'>): Promise<string> {
  try {
    const pendingStr = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SUBMISSIONS);
    const pending: PendingSubmission[] = pendingStr ? JSON.parse(pendingStr) : [];
    
    const newSubmission: PendingSubmission = {
      ...submission,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryCount: 0,
    };
    
    pending.push(newSubmission);
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(pending));
    
    console.log('[OfflineService] Queued submission:', newSubmission.id);
    return newSubmission.id;
  } catch (error) {
    console.error('[OfflineService] Error queuing submission:', error);
    throw error;
  }
}

/**
 * Get all pending submissions
 */
export async function getPendingSubmissions(): Promise<PendingSubmission[]> {
  try {
    const pendingStr = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SUBMISSIONS);
    return pendingStr ? JSON.parse(pendingStr) : [];
  } catch {
    return [];
  }
}

/**
 * Get count of pending submissions
 */
export async function getPendingCount(): Promise<number> {
  const pending = await getPendingSubmissions();
  return pending.length;
}

/**
 * Sync all pending submissions to Supabase
 */
export async function syncPendingSubmissions(): Promise<{ synced: number; failed: number }> {
  try {
    const pending = await getPendingSubmissions();
    if (pending.length === 0) {
      return { synced: 0, failed: 0 };
    }
    
    console.log('[OfflineService] Syncing', pending.length, 'pending submissions');
    
    let synced = 0;
    let failed = 0;
    const remaining: PendingSubmission[] = [];
    
    for (const submission of pending) {
      try {
        // Submit to Supabase
        const { error } = await supabase.from('attendance').insert(
          submission.attendance.map(a => ({
            slot_id: submission.classData.slotId,
            student_id: a.studentId,
            status: a.status,
            recorded_at: submission.submittedAt,
            is_synced: true,
          }))
        );
        
        if (error) {
          console.error('[OfflineService] Sync error:', error);
          submission.retryCount += 1;
          if (submission.retryCount < 3) {
            remaining.push(submission);
          }
          failed++;
        } else {
          synced++;
        }
      } catch (err) {
        console.error('[OfflineService] Submission failed:', err);
        submission.retryCount += 1;
        if (submission.retryCount < 3) {
          remaining.push(submission);
        }
        failed++;
      }
    }
    
    // Update remaining pending
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(remaining));
    
    console.log('[OfflineService] Sync complete:', { synced, failed, remaining: remaining.length });
    return { synced, failed };
  } catch (error) {
    console.error('[OfflineService] Sync error:', error);
    return { synced: 0, failed: 0 };
  }
}

/**
 * Remove a specific pending submission
 */
export async function removePendingSubmission(submissionId: string): Promise<void> {
  try {
    const pending = await getPendingSubmissions();
    const filtered = pending.filter(p => p.id !== submissionId);
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('[OfflineService] Error removing submission:', error);
  }
}

// ============================================================================
// SYNC STATUS
// ============================================================================

/**
 * Get overall sync status
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  try {
    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
    const pendingCount = await getPendingCount();
    const isExpired = !(await isCacheValid());
    
    return {
      lastSyncTime: lastSync,
      pendingCount,
      isExpired,
    };
  } catch {
    return {
      lastSyncTime: null,
      pendingCount: 0,
      isExpired: true,
    };
  }
}

/**
 * Clear all cached data (for debugging/logout)
 */
export async function clearOfflineData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CACHED_ROSTERS,
      STORAGE_KEYS.ROSTER_CACHE_DATE,
      STORAGE_KEYS.PENDING_SUBMISSIONS,
      STORAGE_KEYS.LAST_SYNC_TIME,
    ]);
    console.log('[OfflineService] Cleared all offline data');
  } catch (error) {
    console.error('[OfflineService] Error clearing data:', error);
  }
}
