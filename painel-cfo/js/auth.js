// ═══════════════════════════════════════════════
// CFO Dashboard v2 — Supabase Auth Module
// ═══════════════════════════════════════════════

import { CONFIG } from './config.js';

let supabaseClient = null;

export function getSupabase() {
    if (!supabaseClient) {
        if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
            console.error('❌ Supabase configuration missing! Check environment variables.');
        }
        supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

export async function signIn(email, password) {
    const sb = getSupabase();
    // Suporta login com alias "bgtech" → email real
    const LOGIN_ALIASES = { 'bgtech': 'acessosbgtech@gmail.com' };
    const actualEmail = LOGIN_ALIASES[email.toLowerCase().trim()] || email;
    const { data, error } = await sb.auth.signInWithPassword({ email: actualEmail, password });
    if (error) throw new Error(error.message);
    return data.user;
}

export async function signOut() {
    const sb = getSupabase();
    await sb.auth.signOut();
    window.location.reload();
}

export async function getSession() {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    return session;
}

export function onAuthChange(callback) {
    const sb = getSupabase();
    sb.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
}
