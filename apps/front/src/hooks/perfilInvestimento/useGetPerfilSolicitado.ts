import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { PerfilInvestimentoType } from '@/types/perfilInvestimento/PerfilInvestimentoType'

export const useGetPerfilSolicitado = () => {
  const [perfilSolicitado, setPerfilSolicitado] = useState<PerfilInvestimentoType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getPerfilSolicitado = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getPerfilSolicitado(cpf)

      setPerfilSolicitado(response as PerfilInvestimentoType)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { perfilSolicitado, getPerfilSolicitado, error }
}
