import { useCallback, useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const useCountTotalParticipantes = () => {
  const [totalParticipantes, setTotalParticipantes] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const getTotalParticipantes = useCallback(async (campanha: CampanhaType) => {
    try {
      const response = await CampanhaService.getTotalParticipantes(campanha)


      setTotalParticipantes(response.totalParticipantes)
    } catch (error) {
      setError(error as string)

      // throw error
    }
  }, [])

  return { totalParticipantes, error, getTotalParticipantes }
}
