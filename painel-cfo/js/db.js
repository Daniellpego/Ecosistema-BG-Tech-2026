// ═══════════════════════════════════════════════
// CFO Dashboard v2 — Database Layer (Supabase CRUD)
// ═══════════════════════════════════════════════

import { getSupabase } from './auth.js';

export async function fetchLancamentos() {
    const sb = getSupabase();
    const { data, error } = await sb.from('cfo_lancamentos').select('*').order('data', { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function upsertLancamento(item) {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const payload = { ...item, user_id: session?.user?.id };
    delete payload._tipo;
    delete payload._local;

    const { data, error } = await sb
        .from('cfo_lancamentos')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteLancamento(id) {
    const sb = getSupabase();
    const { error } = await sb.from('cfo_lancamentos').delete().eq('id', id);
    if (error) throw error;
}

export async function fetchProjecoes() {
    const sb = getSupabase();
    const { data, error } = await sb.from('cfo_projecoes').select('*').order('data', { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function upsertProjecao(item) {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const payload = { ...item, user_id: session?.user?.id };
    const { data, error } = await sb.from('cfo_projecoes').upsert(payload, { onConflict: 'id' }).select().single();
    if (error) throw error;
    return data;
}

export async function deleteProjecao(id) {
    const sb = getSupabase();
    const { error } = await sb.from('cfo_projecoes').delete().eq('id', id);
    if (error) throw error;
}

export async function fetchConfig() {
    const sb = getSupabase();
    const { data, error } = await sb.from('cfo_config_v2').select('*').eq('id', 1).single();
    if (error) throw error;
    return data;
}

export async function updateCaixa(valor) {
    const sb = getSupabase();
    const { data, error } = await sb
        .from('cfo_config_v2')
        .update({ caixa_disponivel: valor, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateTaxConfig(aliquota, regime) {
    const sb = getSupabase();
    const { data, error } = await sb
        .from('cfo_config_v2')
        .update({
            aliquota_imposto: aliquota,
            regime_tributario: regime,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export function subscribeRealtime(onLanc, onProj, onConfig) {
    const sb = getSupabase();
    return sb.channel('cfo-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cfo_lancamentos' }, onLanc)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cfo_projecoes' }, onProj)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cfo_config_v2' }, onConfig)
        .subscribe();
}
