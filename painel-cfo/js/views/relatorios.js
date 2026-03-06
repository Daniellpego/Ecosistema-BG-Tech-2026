// ═══════════════════════════════════════════════
// CFO Dashboard v2 — Relatórios View
// ═══════════════════════════════════════════════

import { fmtR } from '../utils.js';
import * as State from '../state.js';

export function renderRelatorios() {
    // UI for report selection
}

export function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("CFO Dashboard - Relatório Gerencial", 10, 10);
    // ... logic to add table
    doc.save("relatorio-cfo.pdf");
}

export function exportCSV() {
    const data = State.getState().lancamentos;
    let csv = "Data,Nome,Valor,Tipo,Categoria\n";
    data.forEach(l => {
        csv += `${l.data},${l.nome},${l.valor},${l.tipo},${l.categoria}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-cfo.csv';
    a.click();
}
