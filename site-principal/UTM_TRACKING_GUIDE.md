# Guia Completo: UTM Tracking e Análise de Criativos

## 📊 O que são Parâmetros UTM?

Parâmetros UTM são tags adicionadas às URLs para rastrear de onde vem cada lead. Essencialmente, você está "marcando" cada clique para saber exatamente qual anúncio, criativo e campanha gerou cada conversão.

---

## 🎯 **SIM, VOCÊ PRECISA USAR PARÂMETROS UTM NOS ANÚNCIOS!**

### ❌ **Sem UTMs:**
- Você sabe que 50 leads vieram do Meta Ads
- Mas não sabe qual criativo converteu mais
- Não sabe qual campanha tem melhor ROI
- Otimização = chute no escuro

### ✅ **Com UTMs:**
- Sabe exatamente qual criativo gerou 30 leads tier A
- Sabe qual campanha tem melhor custo por lead qualificado
- Pode escalar o que funciona e pausar o que não funciona
- Otimização = baseada em dados reais

---

## 🔧 Parâmetros UTM Configurados

O site está configurado para capturar **4 parâmetros UTM**:

| Parâmetro | Uso | Exemplo |
|-----------|-----|---------|
| `utm_source` | De onde vem o tráfego | `facebook`, `instagram`, `google` |
| `utm_medium` | Tipo de mídia | `cpc`, `social`, `email` |
| `utm_campaign` | Nome da campanha | `leads_londrina_mar26` |
| `utm_content` | **Qual criativo específico** | `video_dono`, `carrossel_dor`, `imagem_dashboard` |

**O mais importante para A/B test de criativos é `utm_content`** ✨

---

## 🎬 Como Configurar URLs nos Anúncios do Meta Ads

### **Estrutura da URL completa:**

```
https://gradios.com.br/diagnostico?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_londrina_mar26&utm_content=NOME_DO_CRIATIVO
```

### **Exemplo Real - 3 Criativos Diferentes:**

**Criativo 1: Vídeo do Dono Falando**
```
https://gradios.com.br/diagnostico?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_londrina_mar26&utm_content=video_dono
```

**Criativo 2: Carrossel com Dor + Solução**
```
https://gradios.com.br/diagnostico?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_londrina_mar26&utm_content=carrossel_dor
```

**Criativo 3: Imagem Estática do Dashboard**
```
https://gradios.com.br/diagnostico?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_londrina_mar26&utm_content=imagem_dashboard
```

---

## 📝 Onde Colocar a URL no Meta Ads

### **Passo a Passo:**

1. **Acesse o Gerenciador de Anúncios**
2. **Crie a Campanha** → Nome: "Leads Londrina Mar/26"
3. **Crie o Conjunto de Anúncios** → Público de Londrina, budget etc
4. **Crie o Anúncio**:
   - Faça o criativo (vídeo/imagem/carrossel)
   - Em **"Website URL"** ou **"Link de Destino"**:
     - Cole a URL com UTMs: `https://gradios.com.br/diagnostico?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_londrina_mar26&utm_content=video_dono`
   - Dê um nome descritivo ao anúncio (ex: "Vídeo Dono - Londrina")

5. **Duplique o anúncio** para testar outros criativos:
   - Anúncio 2: Troque o criativo + mude `utm_content=carrossel_dor`
   - Anúncio 3: Novo criativo + `utm_content=imagem_dashboard`

---

## 🧪 Convenção de Nomenclatura para `utm_content`

Use nomes curtos, descritivos e sem espaços:

### ✅ **BOM:**
- `video_dono`
- `carrossel_antes_depois`
- `imagem_dashboard_animado`
- `ugc_cliente_satisfeito`
- `quote_depoimento_soma`

### ❌ **RUIM:**
- `criativo 1` (vago demais)
- `Vídeo do Gustavo falando sobre automação` (muito longo)
- `teste_v2_final_AGORA_SIM` (confuso)

---

## 📊 Como Analisar os Resultados (Pós-Campanha)

### **Query SQL no Supabase**

Após rodar os anúncios por 3-7 dias, rode essa query no Supabase:

```sql
SELECT
  utm_content,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN tier = 'A' THEN 1 END) as leads_tier_a,
  COUNT(CASE WHEN tier = 'B' THEN 1 END) as leads_tier_b,
  COUNT(CASE WHEN tier = 'C' THEN 1 END) as leads_tier_c,
  ROUND(AVG(score), 1) as score_medio
FROM quiz_leads
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND utm_campaign = 'leads_londrina_mar26'
GROUP BY utm_content
ORDER BY total_leads DESC;
```

### **Exemplo de Resultado:**

| utm_content | total_leads | leads_tier_a | leads_tier_b | score_medio |
|-------------|-------------|--------------|--------------|-------------|
| video_dono | 42 | 18 | 15 | 67.3 |
| carrossel_dor | 31 | 8 | 12 | 52.1 |
| imagem_dashboard | 12 | 2 | 4 | 48.7 |

**Interpretação:**
- ✅ `video_dono` → **Escalar!** Mais leads, mais tier A, score mais alto
- ⚠️ `carrossel_dor` → Bom volume mas qualidade média
- ❌ `imagem_dashboard` → **Pausar!** Baixo volume e qualidade

---

## 🎯 Workflow Completo de Otimização

### **Dia 1-3: Teste**
1. Crie 3-5 anúncios com criativos diferentes
2. Cada um com `utm_content` único
3. Budget igual para todos (ex: R$ 30/dia cada)

### **Dia 4-7: Análise**
1. Rode a query SQL acima
2. Identifique:
   - Qual criativo tem **mais leads tier A**
   - Qual criativo tem **melhor score médio**
   - Qual criativo tem **melhor custo por lead** (veja no Meta Ads)

### **Dia 8+: Escala**
1. **Pause** criativos com baixa performance
2. **Duplique** o melhor criativo e aumente budget 2x
3. **Teste** variações do vencedor (ex: se vídeo funciona, teste outro ângulo)

---

## 🔄 Iteração Contínua

Toda semana:
1. Rode a query SQL
2. Compare criativos
3. Pause os piores
4. Escale os melhores
5. Crie 1-2 novos para testar

**Regra de ouro**: Sempre tenha pelo menos 1 criativo novo testando enquanto escala o que funciona.

---

## 🛠️ Ferramentas Úteis

### **1. Gerador de URLs com UTM (Opcional)**
Se preferir usar ferramenta visual:
- **Google Campaign URL Builder**: https://ga-dev-tools.google/campaign-url-builder/

Preencha:
- Website URL: `https://gradios.com.br/diagnostico`
- Campaign Source: `facebook`
- Campaign Medium: `cpc`
- Campaign Name: `leads_londrina_mar26`
- Campaign Content: `video_dono`

Ele gera: `https://gradios.com.br/diagnostico?utm_source=facebook&utm_medium=cpc&utm_campaign=leads_londrina_mar26&utm_content=video_dono`

### **2. Planilha de Tracking (Recomendado)**

Crie uma planilha para organizar:

| Criativo | utm_content | Data Criação | Status | Observações |
|----------|-------------|--------------|--------|-------------|
| Vídeo Dono 1min | video_dono | 24/03/26 | Ativo | Melhor performance |
| Carrossel 3 cards | carrossel_dor | 24/03/26 | Pausado | CPL alto |
| Imagem Dashboard | imagem_dashboard | 24/03/26 | Testando | - |

---

## ❓ FAQ

### **1. Preciso criar UTMs diferentes para cada conjunto de anúncios?**
Não necessariamente. O mais importante é:
- `utm_campaign` → Igual para toda a campanha
- `utm_content` → **Diferente para cada criativo**

Se quiser separar por conjunto de anúncios (ex: público frio vs retargeting), use `utm_term`:
```
?utm_campaign=leads_londrina_mar26&utm_content=video_dono&utm_term=cold
?utm_campaign=leads_londrina_mar26&utm_content=video_dono&utm_term=retargeting
```

### **2. E se eu esquecer de colocar UTM em um anúncio?**
O anúncio vai funcionar normalmente, mas os leads aparecerão com `utm_content = NULL` no banco. Você não saberá qual criativo gerou.

### **3. Posso mudar o `utm_content` depois de criar o anúncio?**
Tecnicamente sim, mas **NÃO recomendado**. Crie um novo anúncio com o novo UTM para manter dados consistentes.

### **4. Quantos criativos diferentes devo testar ao mesmo tempo?**
- **Ideal**: 3-5 criativos
- **Mínimo**: 2 (senão não é teste)
- **Máximo**: 7-8 (mais que isso dispersa muito o budget)

### **5. Os UTMs afetam o SEO ou performance do site?**
Não. Parâmetros UTM são ignorados pelos buscadores e não afetam nada técnico.

---

## ✅ Checklist Final

Antes de ligar a campanha, confirme:

- [ ] Pixel Meta instalado no site (ID: `1826186485006703`) ✅
- [ ] Evento `Lead` disparando na submissão do quiz ✅
- [ ] Campo `utm_content` adicionado ao banco Supabase ✅
- [ ] URLs dos anúncios com UTMs configuradas
- [ ] Planilha de tracking criada
- [ ] Query SQL salva para análise pós-campanha

---

## 📞 Suporte

Dúvidas sobre UTMs ou análise de dados? Entre em contato com o time de tech.

**Última atualização**: 24/03/2026
