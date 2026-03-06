// ═══════════════════════════════════════════════
// CFO Dashboard v2 — Stress Test (1000 lançamentos)
// Cole e execute no Console do navegador (F12)
// ═══════════════════════════════════════════════

(async function stressTest() {
    console.log('🚀 [STRESS] Iniciando geração de 1.000 lançamentos...');
    console.time('[STRESS] Total');

    const SUPABASE_URL = 'https://urpuiznydrlwmaqhdids.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycHVpem55ZHJsd21hcWhkaWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjQ0OTIsImV4cCI6MjA4NzIwMDQ5Mn0.qSoyYmBTvgdOAickkuLCYCveOj2ELIZt85LFZb6veQ8';

    const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    if (!sb) { console.error('❌ Supabase não disponível'); return; }

    const { data: { session } } = await sb.auth.getSession();
    if (!session) { console.error('❌ Você precisa estar logado!'); return; }
    const userId = session.user.id;

    // ─── Geração de dados aleatórios ───────────
    const tipos = ['receita', 'fixo', 'variavel'];
    const catsEntradas = ['Receita de Setup (Pontual)', 'Receita de Mensalidades (Recorrente)', 'Projetos Avulsos / Serviços Pontuais', 'Outras Receitas'];
    const catsFixos = ['Contabilidade', 'Ferramentas (Google, Software, etc.)', 'Hospedagem / Infraestrutura', 'Pró-labore', 'Taxas Bancárias Fixas', 'Outros Custos Fixos'];
    const catsVar = ['Marketing (Tráfego, Campanhas)', 'Taxas de Meios de Pagamento', 'Freelancers por Projeto', 'Serviços Terceirizados Pontuais', 'APIs e Consumo Variável', 'Gasto Não Previsto'];
    const statuses = ['Confirmado', 'Previsto'];
    const clientes = ['Cliente Alpha', 'Beta Corp', 'Gamma Inc', 'Delta Ltda', 'Epsilon SA', null];
    const projetos = ['Projeto X', 'Automação Y', 'Dashboard Z', 'App W', 'Site V', null];

    function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function rndVal(min, max) { return +(min + Math.random() * (max - min)).toFixed(2); }
    function rndDate(year) {
        const m = Math.floor(Math.random() * 12) + 1;
        const d = Math.floor(Math.random() * 28) + 1;
        return `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    const items = [];
    for (let i = 0; i < 1000; i++) {
        const tipo = rnd(tipos);
        const cats = tipo === 'receita' ? catsEntradas : (tipo === 'fixo' ? catsFixos : catsVar);
        items.push({
            id: crypto.randomUUID(),
            nome: `Stress #${i + 1} - ${tipo.toUpperCase()} ${Math.random().toString(36).substr(2, 5)}`,
            valor: tipo === 'receita' ? rndVal(100, 15000) : rndVal(50, 5000),
            data: rndDate(2026),
            tipo,
            categoria: rnd(cats),
            status: rnd(statuses),
            recorrencia: Math.random() > 0.7 ? 'mensal' : 'unico',
            cliente: rnd(clientes),
            projeto: rnd(projetos),
            descricao: `Gerado automaticamente pelo stress test #${i + 1}`,
            user_id: userId
        });
    }

    console.log(`📝 [STRESS] ${items.length} itens gerados. Enviando em batches de 100...`);

    // ─── Envio em batches ──────────────────────
    const BATCH_SIZE = 100;
    let inserted = 0;
    let errors = 0;

    for (let b = 0; b < items.length; b += BATCH_SIZE) {
        const batch = items.slice(b, b + BATCH_SIZE);
        const { data, error } = await sb
            .from('cfo_lancamentos')
            .upsert(batch, { onConflict: 'id' })
            .select('id');

        if (error) {
            console.error(`❌ [STRESS] Batch ${b / BATCH_SIZE + 1} falhou:`, error.message);
            errors += batch.length;
        } else {
            inserted += (data?.length || batch.length);
            console.log(`✅ [STRESS] Batch ${b / BATCH_SIZE + 1}/10 — ${inserted} itens inseridos`);
        }
    }

    console.timeEnd('[STRESS] Total');
    console.log(`\n🏁 [STRESS] RESULTADO FINAL:`);
    console.log(`   ✅ Inseridos: ${inserted}`);
    console.log(`   ❌ Falhas: ${errors}`);
    console.log(`\n📊 Agora recarregue a página (F5) e observe:`);
    console.log(`   1. Tempo de carregamento do Overview`);
    console.log(`   2. Lag na renderização do DRE com 1000 itens`);
    console.log(`   3. Scroll na tabela de Custos Fixos`);
    console.log(`   4. Gráficos mantêm a responsividade?`);
    console.log(`\n🗑️ Para LIMPAR os dados de stress, execute:`);
    console.log(`   stressClean()`);

    // Registrar cleanup no window
    window.stressClean = async function () {
        console.log('🧹 Removendo dados de stress test...');
        const { error } = await sb
            .from('cfo_lancamentos')
            .delete()
            .like('nome', 'Stress #%');
        if (error) console.error('❌ Erro ao limpar:', error.message);
        else console.log('✅ Dados de stress removidos! Recarregue a página.');
    };
})();
