import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { HistoricoType } from '@/types/perfilInvestimento/HistoricoType'

export default function useGetHistoricoUltimaResposta() {
  const [ultimaResposta, setUltimaResposta] = useState<HistoricoType | null>(null)
  const [semResposta, setSemResposta] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getUltimaResposta = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getUltimaRespostaHistorico(cpf)

      if (response) {
        setUltimaResposta(response as HistoricoType)
      } else {
        setSemResposta(true)
      }
    } catch (error: any) {
      setError(error.message)

      return { success: false, message: error.message }
    }
  }, [])

  return { ultimaResposta, error, getUltimaResposta, semResposta }
}
