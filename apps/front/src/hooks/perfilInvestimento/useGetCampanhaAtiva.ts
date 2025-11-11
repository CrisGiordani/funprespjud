import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const useGetCampanhaAtiva = () => {
  const [campanhaAtiva, setCampanhaAtiva] = useState<CampanhaType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getCampanhaAtiva = useCallback(async () => {
    try {
      const response = await PerfilInvestimentoService.getCampanhaAtiva()

      // Se não há campanha ativa, define como null (não é erro)
      setCampanhaAtiva(response || null)
      setError(null) // Limpa erros anteriores
    } catch (error) {
      // Só define erro se for um erro real (não 404 de campanha inexistente)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        
        if (axiosError.response?.status === 404) {

          // 404 significa que não há campanha ativa - não é erro
          setCampanhaAtiva(null)
          setError(null)
        } else {
          setError(axiosError.response?.data?.message || 'Erro desconhecido')
          throw error
        }
      } else {
        setError(error instanceof Error ? error.message : 'Erro desconhecido')
        throw error
      }
    }
  }, [])

  return { campanhaAtiva, error, getCampanhaAtiva }
}
