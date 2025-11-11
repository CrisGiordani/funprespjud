import { useState, useCallback } from 'react'

import type { UrpResponseType } from '@/types/urp/urps.types'
import { UrpService } from '@/services/UrpService'

export default function useGetUrp() {
  const [urp, setUrp] = useState<UrpResponseType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUrp = useCallback(async (cpf: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await UrpService.getUrp(cpf)

      setUrp(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao gerar a chave para acessar a plataforma de empréstimos'

      setError(errorMessage)
      setUrp(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    urp,
    isLoading,
    error,
    getUrp
  }
}
