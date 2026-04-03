import { createClient } from '@/lib/supabase/client'

export async function logAction(
  action: 'create' | 'update' | 'delete',
  tableName: string,
  recordId: string,
  details?: Record<string, unknown>
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('audit_log').insert({
      user_email: user?.email ?? 'unknown',
      action,
      table_name: tableName,
      record_id: recordId,
      details: details ?? {},
      created_at: new Date().toISOString(),
    } as unknown as Record<string, unknown>)
  } catch {
    // Audit log failures should not break the app
    console.warn('Failed to write audit log')
  }
}
