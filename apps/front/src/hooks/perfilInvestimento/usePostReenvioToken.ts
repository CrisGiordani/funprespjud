import { useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'

export const usePostReenvioToken = () => {
  const [error, setError] = useState<string | null>(null)

  const postReenvioToken = async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getGerarNovoToken(cpf)

      await PerfilInvestimentoService.postDispatchEmail(cpf, response.token)

      return response
    } catch (error) {
      setError(error as string)
    }
  }

  return { error, postReenvioToken }
}
