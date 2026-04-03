'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { calcularAliquotaEfetiva } from '@/lib/simples-nacional'

interface TaxContextType {
  simplesEnabled: boolean
  setSimplesEnabled: (v: boolean) => void
  aliquota: number
  anexo: 'III' | 'V'
  setAnexo: (v: 'III' | 'V') => void
  rbt12: number
  setRbt12: (v: number) => void
}

const TaxContext = createContext<TaxContextType>({
  simplesEnabled: false,
  setSimplesEnabled: () => {},
  aliquota: 6,
  anexo: 'V',
  setAnexo: () => {},
  rbt12: 0,
  setRbt12: () => {},
})

export function TaxProvider({ children }: { children: ReactNode }) {
  const [simplesEnabled, setSimplesEnabled] = useState(false)
  const [anexo, setAnexo] = useState<'III' | 'V'>('V')
  const [rbt12, setRbt12] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bg-simples-enabled')
      if (saved === 'true') setSimplesEnabled(true)
      const savedAnexo = localStorage.getItem('bg-simples-anexo')
      if (savedAnexo === 'III' || savedAnexo === 'V') setAnexo(savedAnexo)
      const savedRbt = localStorage.getItem('bg-simples-rbt12')
      if (savedRbt) setRbt12(Number(savedRbt))
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem('bg-simples-enabled', simplesEnabled ? 'true' : 'false')
      localStorage.setItem('bg-simples-anexo', anexo)
      localStorage.setItem('bg-simples-rbt12', String(rbt12))
    } catch {}
  }, [simplesEnabled, anexo, rbt12, loaded])

  const aliquota = rbt12 > 0
    ? calcularAliquotaEfetiva(rbt12, anexo)
    : (anexo === 'V' ? 15.5 : 6)

  return (
    <TaxContext.Provider value={{ simplesEnabled, setSimplesEnabled, aliquota, anexo, setAnexo, rbt12, setRbt12 }}>
      {children}
    </TaxContext.Provider>
  )
}

export function useTax() {
  return useContext(TaxContext)
}
