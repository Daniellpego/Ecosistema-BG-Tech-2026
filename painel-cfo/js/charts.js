// ═══════════════════════════════════════════════
// CFO Dashboard v2 — Charts (ApexCharts)
// ═══════════════════════════════════════════════

import { fmtR, MONTHS, filterData, calcTax, safe } from './utils.js';
import * as State from './state.js';

let charts = { area: null, donut: null, dreBar: null, dreLine: null };

const baseOpts = {
    chart: { background: 'transparent', fontFamily: 'Poppins', toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
    theme: { mode: 'dark' }
};

export function initCharts() {
    charts.area = new ApexCharts(document.querySelector('#chart-area'), {
        ...baseOpts,
        series: [], chart: { ...baseOpts.chart, type: 'area', height: 280 },
        colors: ['#10b981', '#ef4444'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
        stroke: { curve: 'smooth', width: 3 }, dataLabels: { enabled: false },
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        xaxis: { categories: [], labels: { style: { colors: '#94a3b8', fontWeight: 600 } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#94a3b8' }, formatter: v => `R$${(v / 1000).toFixed(0)}k` } },
        legend: { labels: { colors: '#94a3b8' } },
        tooltip: { theme: 'dark', y: { formatter: v => fmtR(v) } }
    });

    charts.donut = new ApexCharts(document.querySelector('#chart-donut'), {
        ...baseOpts,
        series: [], labels: [], chart: { ...baseOpts.chart, type: 'donut', height: 280 },
        colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7', '#0369a1'],
        stroke: { show: true, colors: ['#0a0f1a'], width: 4 },
        dataLabels: { enabled: false },
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { color: '#94a3b8' }, value: { color: 'white', fontSize: '24px', fontWeight: 900, formatter: v => fmtR(v) }, total: { show: true, label: 'Total Fixos', color: '#94a3b8', formatter: w => fmtR(w.globals.seriesTotals.reduce((a, b) => a + b, 0)) } } } } },
        tooltip: { theme: 'dark' }
    });

    charts.dreBar = new ApexCharts(document.querySelector('#chart-dre-bar'), {
        ...baseOpts,
        series: [], chart: { ...baseOpts.chart, type: 'bar', height: 280 },
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
        dataLabels: { enabled: false },
        xaxis: { categories: [], labels: { style: { colors: '#94a3b8' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#94a3b8' }, formatter: v => `R$${(v / 1000).toFixed(0)}k` } },
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        tooltip: { theme: 'dark', y: { formatter: v => fmtR(v) } }
    });

    charts.dreLine = new ApexCharts(document.querySelector('#chart-dre-line'), {
        ...baseOpts,
        series: [], chart: { ...baseOpts.chart, type: 'area', height: 280 },
        colors: ['#0ea5e9'],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
        stroke: { curve: 'smooth', width: 3 }, dataLabels: { enabled: false },
        markers: { size: 4, colors: ['#0ea5e9'], strokeColors: '#0a0f1a', strokeWidth: 2 },
        xaxis: { categories: [], labels: { style: { colors: '#94a3b8' } } },
        yaxis: { labels: { style: { colors: '#94a3b8' }, formatter: v => `R$${(v / 1000).toFixed(0)}k` } },
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        tooltip: { theme: 'dark', y: { formatter: v => fmtR(v) } }
    });

    Object.values(charts).forEach(c => c.render());
}

export function updateCharts() {
    const { client, project } = State.getFilters();
    const entradas = State.getEntradas();
    const fixos = State.getFixos();
    const variaveis = State.getVariaveis();
    const isConf = x => x?.status === 'Confirmado';

    const aRec = [], aDesp = [], aCats = [], dreRB = [], dreCV = [], dreCF = [], dreRL = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const mStr = d.getMonth().toString(), yStr = d.getFullYear().toString();

        const e = safe(filterData(entradas, mStr, yStr, false, client, project).filter(isConf).reduce((a, b) => a + safe(Number(b.valor)), 0));
        const f = safe(filterData(fixos, mStr, yStr, false, client, project).filter(isConf).reduce((a, b) => a + safe(Number(b.valor)), 0));
        const u = safe(filterData(variaveis, mStr, yStr, false, client, project).filter(isConf).reduce((a, b) => a + safe(Number(b.valor)), 0));
        const tax = calcTax(e);
        const totalSaidas = f + u + tax;

        aRec.push(e); aDesp.push(totalSaidas);
        aCats.push(MONTHS[d.getMonth()].substring(0, 3));
        dreRB.push(e); dreCV.push(u + tax); dreCF.push(f);
        dreRL.push(e - totalSaidas);
    }

    if (charts.area) {
        charts.area.updateSeries([{ name: 'Receita Bruta', data: aRec }, { name: 'Burn Rate', data: aDesp }]);
        charts.area.updateOptions({ xaxis: { categories: aCats } });
    }
    if (charts.dreBar) {
        charts.dreBar.updateSeries([{ name: 'Receita', data: dreRB }, { name: 'Var.+Imp', data: dreCV }, { name: 'Fixo', data: dreCF }]);
        charts.dreBar.updateOptions({ xaxis: { categories: aCats } });
    }
    if (charts.dreLine) {
        charts.dreLine.updateSeries([{ name: 'Resultado Líquido', data: dreRL }]);
        charts.dreLine.updateOptions({ xaxis: { categories: aCats } });
    }

    // Donut — current filter period
    const { m, y } = State.getFilters();
    const curFixos = filterData(fixos, m, y, false, client, project).filter(isConf);
    const catMap = {};
    curFixos.forEach(x => { catMap[x.categoria || 'Outros'] = (catMap[x.categoria || 'Outros'] || 0) + Number(x.valor); });
    const labels = Object.keys(catMap), series = Object.values(catMap);

    if (charts.donut) {
        if (series.length > 0) {
            charts.donut.updateOptions({ labels });
            charts.donut.updateSeries(series);
        } else {
            charts.donut.updateSeries([1]);
            charts.donut.updateOptions({ labels: ['Sem dados'], colors: ['#1e293b'] });
        }
    }
}
