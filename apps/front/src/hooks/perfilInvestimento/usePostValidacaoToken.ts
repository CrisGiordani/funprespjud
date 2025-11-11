import { useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'

export const usePostValidacaoToken = () => {
  const [error, setError] = useState<string | null>(null)
  const [tokenVerificado, setTokenVerificado] = useState<boolean | null>(null)

  const postValidacaoToken = async (cpf: string, token: string) => {
    try {
      const response = await PerfilInvestimentoService.postVerificarToken(cpf, token)

      response?.verificado ? setTokenVerificado(true) : setTokenVerificado(false)

      return tokenVerificado
    } catch (error) {
      setError(error as string)
    }

    return null
  }

  return { error, postValidacaoToken, tokenVerificado }
}
