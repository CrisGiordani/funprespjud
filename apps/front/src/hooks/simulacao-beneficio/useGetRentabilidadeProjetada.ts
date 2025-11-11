import { useState, useCallback } from 'react'

import { SimuladorService } from '@/services/SimuladorService'

export const useGetRentabilidadeProjetada = () => {
  const [rentabilidadeProjetada, setRentabilidadeProjetada] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getRentabilidadeProjetada = useCallback(async (cpf: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await SimuladorService.getRentabilidadeProjetada(cpf)

      setRentabilidadeProjetada(response)

      return response
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao buscar rentabilidade projetada'

      setError(errorMessage)
      setRentabilidadeProjetada(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { rentabilidadeProjetada, error, isLoading, getRentabilidadeProjetada }
}

