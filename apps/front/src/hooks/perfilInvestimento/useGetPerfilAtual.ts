import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { PerfilInvestimentoType } from '@/types/perfilInvestimento/PerfilInvestimentoType'

export const useGetPerfilAtual = () => {
  const [perfilAtual, setPerfilAtual] = useState<PerfilInvestimentoType | null>(null)
  const [semPerfil, setSemPerfil] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getPerfilAtual = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getPerfilAtual(cpf)

      if (response) {
        setPerfilAtual(response as PerfilInvestimentoType)
      } else {
        setSemPerfil(true)
      }
    } catch (error: any) {
      setError(error.message)

      return { success: false, message: error.message }
    }
  }, [])

  return { perfilAtual, getPerfilAtual, error, semPerfil }
}
