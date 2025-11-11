import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { PerfilInvestimentoType } from '@/types/perfilInvestimento/PerfilInvestimentoType'

export const useGetPerfilIndicado = () => {
  const [perfilIndicado, setPerfilIndicado] = useState<PerfilInvestimentoType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getPerfilIndicado = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getPerfilIndicado(cpf)

      setPerfilIndicado(response as PerfilInvestimentoType | null)
    } catch (error: any) {
      setError(error.message)

      return { success: false, message: error.message }
    }
  }, [])

  return { perfilIndicado, getPerfilIndicado, error }
}
