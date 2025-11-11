import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { FilterHistoricoRespostasType } from '@/types/perfilInvestimento/FilterHistoricoRespostasType'

export default function useGetHistorico() {
  const [listHistorico, setListHistorico] = useState<FilterHistoricoRespostasType>({
    historico: [],
    pageIndex: 0,
    pageSize: 0,
    totalPages: 0,
    totalItems: 0
  })

  const [error, setError] = useState<string | null>(null)

  const getHistorico = useCallback(async (cpf: string, pageIndex: number = 0, pageSize: number = 4) => {
    try {
      const response = await PerfilInvestimentoService.getHistorico(cpf, pageIndex, pageSize)

      setListHistorico(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { listHistorico, error, getHistorico }
}
