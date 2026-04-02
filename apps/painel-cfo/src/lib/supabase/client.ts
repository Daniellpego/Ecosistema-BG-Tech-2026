import { createBrowserClient } from '@supabase/ssr'

// Module-level singleton — one client per browser session
let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (_client) return _client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // During build-time prerendering, env vars may not exist.
    // Return a client with placeholder values — it won't make real requests
    // because client components only fetch data on the browser at runtime.
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  _client = createBrowserClient(supabaseUrl, supabaseKey)
  return _client
}
