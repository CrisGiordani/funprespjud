import { useState, useCallback } from 'react'

import { PatrimonioService } from '@/services/PatrimonioService'

export const useGetVariacaoPatrimonioRetornoInvestimento = () => {
  const [variacaoPatrimonioRetornoInvestimento, setVariacaoPatrimonioRetornoInvestimento] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const getVariacaoPatrimonioRetornoInvestimento = useCallback(async (cpf: string) => {
    try {
      const response = await PatrimonioService.getVariacaoPatrimonioRetornoInvestimento(cpf)

      if (response) {
        setVariacaoPatrimonioRetornoInvestimento(response)

        return { success: true, message: 'Variacao patrimonio retorno investimento encontrado com sucesso' }
      }

      
return { success: false, message: 'Variacao patrimonio retorno investimento nao encontrado' }
    } catch (error) {
      setError(error as string)
      
return { success: false, message: 'Erro ao buscar variacao patrimonio retorno investimento' }
    }
  }, [])

  return { variacaoPatrimonioRetornoInvestimento, getVariacaoPatrimonioRetornoInvestimento, error }
}
