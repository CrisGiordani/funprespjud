import { useCallback, useState } from 'react'

import { PlanoService } from '@/services/PlanoService'
import type { PlanoDTOType } from '@/types/plano/PlanoDTOType'

export default function useGetPlanos() {
  const [listPlanos, setListPlanos] = useState<PlanoDTOType[]>([])
  const [error, setError] = useState<string | null>(null)

  const getPlanos = useCallback(async (participanteId: string, todosPlanos: boolean = false) => {
    try {
      const result = await PlanoService.getPlanos(participanteId, todosPlanos)

      setListPlanos(result.data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados dos planos'

      setError(errorMessage)
      throw error
    }
  }, [])

  return { listPlanos, error, getPlanos }
}
