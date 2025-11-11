import { useCallback, useState } from 'react'

import { PatrimonioService } from '@/services/PatrimonioService'
import { type PatrimonioDTO } from '@/types/patrimonio/PatrimonioDTO.type'

export default function useGetPatrimonio() {
  const [patrimonio, setPatrimonio] = useState<PatrimonioDTO | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getPatrimonio = useCallback(async (cpf: string) => {
    try {
      const response = await PatrimonioService.getPatrimonio(cpf)

      setPatrimonio(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { patrimonio, getPatrimonio, error }
}
