import { useState } from 'react'

import type { StatusHistoricoEnum } from '@/enum/perfilInvestimento/StatusHistoricoEnum'
import { PerfilInvestimentoService } from '../../services/PerfilInvestimentoService'

export const usePostGerarTermos = () => {
  const [error, setError] = useState<string | null>(null)

  const postGerarTermos = async (cpf: string, status: StatusHistoricoEnum) => {
    try {
      const response = await PerfilInvestimentoService.postGerarTermos(cpf, status)

      return response
    } catch (error) {
      setError(error as string)
    }
  }

  return { error, postGerarTermos }
}
