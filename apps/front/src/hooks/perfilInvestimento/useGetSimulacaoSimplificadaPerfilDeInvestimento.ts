import { useCallback, useState } from 'react'

import { SimuladorService } from '../../services/SimuladorService'

export const useGetSimulacaoSimplificadaPerfilDeInvestimento = () => {
  const [dadosSimulacao, setDadosSimulacao] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const getSimulacaoSimplificadaPerfilDeInvestimento = useCallback(
    async (cpf: string, idPerfil:  number | null = null) => {
      try {
        const response = await SimuladorService.getSimulacaoSimplificadaPerfilDeInvestimento(cpf, idPerfil)

        setDadosSimulacao(response)
   
      } catch (error) {
        setError(error as string)
        throw error
      }
    },
    []
  )

  return { dadosSimulacao, getSimulacaoSimplificadaPerfilDeInvestimento, error }
}
