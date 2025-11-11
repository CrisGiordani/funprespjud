'use client'

import { createContext, useContext, useState } from 'react'

import type { SimulacaoResponseType } from '@/types/simulacao-beneficio/ParametrosSimulacaoResponseType'

type SimuladorDefaultContextType = {
  simuladorDefault: SimulacaoResponseType | null
  setSimuladorDefault: (simuladorDefault: SimulacaoResponseType) => void
}

const SimuladorDefaultContext = createContext<SimuladorDefaultContextType | null>(null)

export const useSimuladorDefault = () => {
  const context = useContext(SimuladorDefaultContext)

  if (!context) {
    throw new Error('useSimuladorDefault must be used within an SimuladorDefaultProvider')
  }

  return context
}

export const SimuladorDefaultProvider = ({ children }: { children: React.ReactNode }) => {
  const [simuladorDefault, setSimuladorDefault] = useState<SimulacaoResponseType | null>(null)

  return (
    <SimuladorDefaultContext.Provider value={{ simuladorDefault, setSimuladorDefault }}>
      {children}
    </SimuladorDefaultContext.Provider>
  )
}
