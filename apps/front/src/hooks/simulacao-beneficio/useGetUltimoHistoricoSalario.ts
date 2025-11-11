import { useCallback, useState } from 'react'

import { SimuladorService } from '@/services/SimuladorService'

export const useGetUltimoHistoricoSalario = () => {
  const [ultimoHistoricoSalario, setUltimoHistoricoSalario] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getUltimoHistoricoSalario = useCallback(async (cpf: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await SimuladorService.getUltimoHistoricoSalario(cpf)

      setUltimoHistoricoSalario(response.data.ultimoHistoricoSalario)

      return response
    } catch (error) {
      setError(error as string)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { ultimoHistoricoSalario, error, isLoading, getUltimoHistoricoSalario }
}
