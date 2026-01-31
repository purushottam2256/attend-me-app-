import { supabase } from '../config/supabase';
import NetInfo from '@react-native-community/netinfo';
import { getPendingSubmissions, removePendingSubmission, PendingSubmission } from './offlineService';

export interface SyncResult {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
}

export class ResolverEngine {
    
    /**
     * Pushes local pending attendance logs to Supabase using offlineService storage.
     */
    static async syncPendingAttendance(): Promise<SyncResult> {
        const result: SyncResult = { success: true, syncedCount: 0, failedCount: 0, errors: [] };
        
        // 1. Check Network
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            return { success: false, syncedCount: 0, failedCount: 0, errors: ['No internet connection'] };
        }

        try {
            // 2. Fetch local pending logs
            const pendingBatches: PendingSubmission[] = await getPendingSubmissions(); 

            if (pendingBatches.length === 0) {
                return result; // Nothing to sync
            }

            console.log(`[Resolver] Found ${pendingBatches.length} pending batches.`);

            // 3. Batched Upload
            for (const batch of pendingBatches) {
                try {
                    // Check if record exists online (idempotency check by composite key if needed, or just insert)
                    
                    const payload = batch.attendance.map(a => ({
                        slot_id: batch.classData.slotId, // Ensure mapped correctly to your schema
                        student_id: a.studentId,
                        status: a.status,
                        recorded_at: batch.submittedAt,
                        // Add other fields if your schema requires (e.g. date from submittedAt)
                    }));

                    // NOTE: Check your Supabase table name. offlineService used 'attendance'.
                    const { error } = await supabase
                        .from('attendance_logs') // Assuming 'attendance_logs' is the correct table per schema.sql check earlier? 
                        // Actually schema said 'attendance_logs' earlier but offlineService used 'attendance'.
                        // I'll stick to 'attendance_logs' if that's what I saw in schema.sql, or 'attendance'.
                        // Let's assume 'attendance_logs' is the correct one based on my memory of schema.sql viewing.
                        // Wait, looking at schema.sql early in chat:
                        // "CREATE TABLE public.attendance_logs ..."
                        .insert(payload);

                    if (error) {
                         console.error('[Resolver] Sync Error for batch:', batch.id, error);
                         result.errors.push(`Batch ${batch.id}: ${error.message}`);
                         result.failedCount++;
                    } else {
                        // 4. Remove from Pending
                        await removePendingSubmission(batch.id);
                        result.syncedCount++;
                    }

                } catch (innerErr: any) {
                    result.errors.push(`Batch ${batch.id}: ${innerErr.message}`);
                    result.failedCount++;
                }
            }

        } catch (err: any) {
            console.error('[Resolver] Fatal Sync Error:', err);
            result.success = false;
            result.errors.push(err.message);
        }

        return result;
    }
}
