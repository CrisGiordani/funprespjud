import { useCallback, useState } from 'react'

import { SaldoTotalService } from '@/services/SaldoTotalService'

export default function useSaldoTotal() {
  const [saldoTotal, setSaldoTotal] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getSaldoTotal = useCallback(async (cpf: string) => {
    try {
      const response = await SaldoTotalService.getSaldoTotal(cpf)

      setSaldoTotal(response)
    } catch (error) {
      setError(error as string)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { saldoTotal, getSaldoTotal, isLoading, error }
}
