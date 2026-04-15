import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Generate a per-request nonce for Content-Security-Policy.
  // Using randomUUID + base64 gives a URL-safe, collision-resistant value.
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Run Supabase auth (handles session cookie refresh + unauthenticated redirects).
  const response = await updateSession(request)

  // Build a nonce-based CSP and set it on the response, overriding the static
  // fallback in next.config.ts.  Strategy: 'nonce-{nonce}' + 'strict-dynamic' +
  // 'unsafe-inline'.  Modern browsers (CSP Level 3) enforce the nonce and silently
  // ignore 'unsafe-inline'; legacy browsers fall back to 'unsafe-inline' only.
  const isDev = process.env.NODE_ENV === 'development'
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
