import { useCallback, useState } from 'react'

import { SimuladorService } from '@/services/SimuladorService'
import type { SimulacaoSimplificadaNormalResponse } from '@/types/simulacao-beneficio/SimulacaoSimplificadaNormalType'

export const useSimulacaoBeneficioSimplificadaNormal = () => {
  const [simulacao, setSimulacao] = useState<SimulacaoSimplificadaNormalResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSimulacaoSimplificadaNormal = useCallback(async (cpf: string) => {
    try {
      if (!cpf) {
        throw new Error('CPF não fornecido')
      }

      setIsLoading(true)
      setError(null)

      const response = await SimuladorService.getSimulacaoSimplificadaNormal(cpf)

      setSimulacao(response)

      return response
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar simulação simplificada normal'

      setError(errorMessage)
      setSimulacao(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setSimulacao(null)
    setIsLoading(false)
  }, [])

  return {
    simulacao,
    isLoading,
    error,
    getSimulacaoSimplificadaNormal,
    reset
  }
}
