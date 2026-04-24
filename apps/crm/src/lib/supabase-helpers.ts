/**
 * Cast typed objects to Record<string, unknown> for Supabase insert/update.
 * TypeScript interfaces lack index signatures, so direct cast fails.
 * This helper provides a clean one-step conversion.
 */
export function toRecord<T extends object>(obj: T): Record<string, unknown> {
  return obj as unknown as Record<string, unknown>
}
