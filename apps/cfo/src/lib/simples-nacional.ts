// Anexo III — Serviços (Fator R >= 28%)
const ANEXO_III = [
  { faixa: 1, rbt12Min: 0, rbt12Max: 180_000, aliquota: 6.0, deducao: 0 },
  { faixa: 2, rbt12Min: 180_000.01, rbt12Max: 360_000, aliquota: 11.2, deducao: 9_360 },
  { faixa: 3, rbt12Min: 360_000.01, rbt12Max: 720_000, aliquota: 13.5, deducao: 17_640 },
  { faixa: 4, rbt12Min: 720_000.01, rbt12Max: 1_800_000, aliquota: 16.0, deducao: 35_640 },
  { faixa: 5, rbt12Min: 1_800_000.01, rbt12Max: 3_600_000, aliquota: 21.0, deducao: 125_640 },
  { faixa: 6, rbt12Min: 3_600_000.01, rbt12Max: 4_800_000, aliquota: 33.0, deducao: 648_000 },
]

// Anexo V — Serviços (Fator R < 28%)
const ANEXO_V = [
  { faixa: 1, rbt12Min: 0, rbt12Max: 180_000, aliquota: 15.5, deducao: 0 },
  { faixa: 2, rbt12Min: 180_000.01, rbt12Max: 360_000, aliquota: 18.0, deducao: 4_500 },
  { faixa: 3, rbt12Min: 360_000.01, rbt12Max: 720_000, aliquota: 19.5, deducao: 9_900 },
  { faixa: 4, rbt12Min: 720_000.01, rbt12Max: 1_800_000, aliquota: 20.5, deducao: 17_100 },
  { faixa: 5, rbt12Min: 1_800_000.01, rbt12Max: 3_600_000, aliquota: 23.0, deducao: 62_100 },
  { faixa: 6, rbt12Min: 3_600_000.01, rbt12Max: 4_800_000, aliquota: 30.5, deducao: 540_000 },
]

export function calcularAliquotaEfetiva(rbt12: number, anexo: 'III' | 'V' = 'III'): number {
  const tabela = anexo === 'III' ? ANEXO_III : ANEXO_V
  const faixa = tabela.find(f => rbt12 >= f.rbt12Min && rbt12 <= f.rbt12Max)
  if (!faixa) return 0
  if (faixa.faixa === 1) return faixa.aliquota
  return ((rbt12 * faixa.aliquota / 100) - faixa.deducao) / rbt12 * 100
}

export function calcularFatorR(folhaPagamento12m: number, rbt12: number): number {
  if (rbt12 === 0) return 0
  return (folhaPagamento12m / rbt12) * 100
}

export function determinarAnexo(fatorR: number): 'III' | 'V' {
  return fatorR >= 28 ? 'III' : 'V'
}
