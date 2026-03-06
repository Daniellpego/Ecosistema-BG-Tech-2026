# Configuração de Variáveis de Ambiente (Vercel)

Para que o deploy funcione corretamente, você precisa adicionar as seguintes variáveis no painel da Vercel (Settings > Environment Variables):

1. `SUPABASE_URL`: A URL do seu projeto Supabase (ex: <https://xxx.supabase.co>).
2. `SUPABASE_ANON_KEY`: A chave anônima (anon/public) do seu projeto Supabase.

O script `build.js` vai ler esses valores e gerar o arquivo `js/config.js` automaticamente durante o deploy.
