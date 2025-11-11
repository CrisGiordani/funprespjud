import { useCallback, useState } from 'react'

import { SimularBeneficioService } from '@/services/SimularBeneficioService'
import type { ParametrosSimulacaoType } from '@/types/simulacao-beneficio/ParametrosSimulacaoType'
import type { SimulacaoResponseType } from '@/types/simulacao-beneficio/ParametrosSimulacaoResponseType'

export default function useGetParametrosSimulacao() {
  const [simulacao, setSimulacao] = useState<SimulacaoResponseType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const simularBeneficio = useCallback(async (parametros: ParametrosSimulacaoType) => {
    try {
      if (!parametros) {
        throw new Error('Parâmetros de simulação não fornecidos')
      }

      setIsLoading(true)
      setError(null)
      const result = await SimularBeneficioService.simularBeneficio(parametros)

      setSimulacao(result)

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar parâmetros de simulação'

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
  }, [])

  return {
    simulacao,
    isLoading,
    error,
    simularBeneficio,
    reset
  }
}
