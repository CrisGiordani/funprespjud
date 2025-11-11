import { useCallback, useState } from 'react'

import { PatrimonioService } from '@/services/PatrimonioService'
import type { EvolucaoAnualDTO } from '@/types/patrimonio/EvolucaoAnualDTO.type'

export default function useGetEvolucaoAnual() {
  const [evolucaoAnual, setEvolucaoAnual] = useState<EvolucaoAnualDTO[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getEvolucaoAnual = useCallback(async (cpf: string) => {
    try {
      const response = await PatrimonioService.getEvolucaoAnual(cpf)

      setEvolucaoAnual(response)
    } catch (error) {
      setError(error as string)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { evolucaoAnual, getEvolucaoAnual, isLoading, error }
}
