import { useCallback, useState } from 'react'

import { ImpostoDeRendaService } from '@/services/ImpostoDeRendaService'

export const useGetImpostoDeRendaRelatorio = () => {
  const [relatorio, setRelatorio] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getImpostoDeRendaRelatorio = useCallback(async (cpf: string, ano: string | number, patrocinador: string) => {
    try {
      setIsLoading(true)
      const result = await ImpostoDeRendaService.getImpostoDeRendaRelatorio(cpf, ano, patrocinador)

      setRelatorio(result)

      return result
    } catch (error) {
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { relatorio, error, getImpostoDeRendaRelatorio, isLoading }
}
