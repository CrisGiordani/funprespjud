import { useState } from 'react'

import { ImpostoDeRendaService } from '@/services/ImpostoDeRendaService'
import type { ContribuicoesComplementaresType } from '@/types/dirf/ContribuicoesComplementaresType'

export default function useGetContribuicoesComplementares() {
  const [contribuicoesComplementares, setContribuicoesComplementares] =
    useState<ContribuicoesComplementaresType | null>(null)

  const [error, setError] = useState<any>(null)

  const getContribuicoesComplementares = async (cpf: string, ano: string | number, patrocinador: string) => {
    try {
      const result = await ImpostoDeRendaService.getContribuicoesComplementares(cpf, ano, patrocinador)

      setContribuicoesComplementares(result as unknown as ContribuicoesComplementaresType)
    } catch (error) {
      setError(error)
      throw error
    }
  }

  return {
    contribuicoesComplementares,
    error,
    getContribuicoesComplementares
  }
}
