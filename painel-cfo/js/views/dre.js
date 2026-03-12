// ═══════════════════════════════════════════════
// CFO Dashboard v2 — DRE Gerencial View
// ═══════════════════════════════════════════════

import { fmtR, filterData, calcTax, safe, pct, MONTHS } from '../utils.js';
import * as State from '../state.js';

export function renderDRE() {
    const { m, y, client, project } = State.getFilters();
    const isConf = x => x?.status === 'Confirmado';

    const entries = State.getEntradas();
    const fixed = State.getFixos();
    const variable = State.getVariaveis();

    // Mensal
    const eM = filterData(entries, m, y, false, client, project).filter(isConf);
    const vM = filterData(variable, m, y, false, client, project).filter(isConf);
    const fM = filterData(fixed, m, y, false, client, project).filter(isConf);

    const rbM = safe(eM.reduce((a, b) => a + Number(b.valor), 0));
    const cvM = safe(vM.reduce((a, b) => a + Number(b.valor), 0));
    const mbM = rbM - cvM;
    const cfM = safe(fM.reduce((a, b) => a + Number(b.valor), 0));
    const roM = mbM - cfM;
    const impM = calcTax(rbM);
    const rlM = roM - impM;

    // YTD (Year To Date)
    const eYTD = filterData(entries, m, y, true, client, project).filter(isConf);
    const vYTD = filterData(variable, m, y, true, client, project).filter(isConf);
    const fYTD = filterData(fixed, m, y, true, client, project).filter(isConf);

    const rbYTD = safe(eYTD.reduce((a, b) => a + Number(b.valor), 0));
    const cvYTD = safe(vYTD.reduce((a, b) => a + Number(b.valor), 0));
    const mbYTD = rbYTD - cvYTD;
    const cfYTD = safe(fYTD.reduce((a, b) => a + Number(b.valor), 0));
    const roYTD = mbYTD - cfYTD;
    const impYTD = calcTax(rbYTD);
    const rlYTD = roYTD - impYTD;

    const labelPeriodo = m === 'anual' ? `Ano ${y}` : `${MONTHS[parseInt(m)]}/ ${y}`;
    const elLabel = document.getElementById('dre-lbl-periodo');
    if (elLabel) elLabel.textContent = labelPeriodo;

    const taxRate = (State.getState().aliquota_imposto * 100).toFixed(1);

    const html = `
        <tr class="dre-row-main" onclick="window.CFO.drilldown('receita', '${m}', '${y}')">
            <td><i data-lucide="trending-up" class="dre-icon"></i> Receita Bruta</td>
            <td class="dre-val">${fmtR(rbM)}</td>
            <td class="dre-val">${fmtR(rbYTD)}</td>
        </tr>
        <tr class="dre-row-sub" onclick="window.CFO.drilldown('variavel', '${m}', '${y}')">
            <td><i data-lucide="minus" class="dre-icon"></i> (−) Custos Variáveis</td>
            <td class="dre-val-neg">${fmtR(cvM)}</td>
            <td class="dre-val-neg">${fmtR(cvYTD)}</td>
        </tr>
        <tr class="dre-row-main highlight">
            <td><i data-lucide="separator-horizontal" class="dre-icon"></i> Margem Bruta (L1)</td>
            <td class="dre-val">${fmtR(mbM)} <span class="dre-pct">${pct(mbM, rbM)}</span></td>
            <td class="dre-val">${fmtR(mbYTD)} <span class="dre-pct">${pct(mbYTD, rbYTD)}</span></td>
        </tr>
        <tr class="dre-row-sub" onclick="window.CFO.drilldown('fixo', '${m}', '${y}')">
            <td><i data-lucide="building" class="dre-icon"></i> (−) Custos Fixos</td>
            <td class="dre-val-neg">${fmtR(cfM)}</td>
            <td class="dre-val-neg">${fmtR(cfYTD)}</td>
        </tr>
        <tr class="dre-row-main highlight">
            <td><i data-lucide="activity" class="dre-icon"></i> Resultado Operacional (L2)</td>
            <td class="dre-val">${fmtR(roM)}</td>
            <td class="dre-val">${fmtR(roYTD)}</td>
        </tr>
        <tr class="dre-row-sub" onclick="window.CFO.openTaxModal()">
            <td><i data-lucide="percent" class="dre-icon"></i> (−) Impostos (${taxRate}%)</td>
            <td class="dre-val-neg">${fmtR(impM)}</td>
            <td class="dre-val-neg">${fmtR(impYTD)}</td>
        </tr>
        <tr class="dre-row-main final ${rlM >= 0 ? 'pos' : 'neg'}">
            <td><i data-lucide="pie-chart" class="dre-icon"></i> Resultado Líquido (L3)</td>
            <td class="dre-val">${fmtR(rlM)} <span class="dre-pct">${pct(rlM, rbM)}</span></td>
            <td class="dre-val">${fmtR(rlYTD)} <span class="dre-pct">${pct(rlYTD, rbYTD)}</span></td>
        </tr>
    `;

    const tbody = document.getElementById('dre-tbody');
    if (tbody) {
        tbody.innerHTML = html;
        if (window.lucide) lucide.createIcons();
    }
}
