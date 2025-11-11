import { useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const usePutCampanhaPerfilInvestimento = () => {
  const [error, setError] = useState<string | null>(null)

  const putCampanhaPerfilInvestimento = async (campanha: CampanhaType) => {
    try {
      setError(null) // Limpa erros anteriores
      const response = await CampanhaService.putCampanhaPerfilInvestimento(campanha)

      
return response
    } catch (error: any) {
      setError(error.message || 'Erro ao editar campanha')
      throw error
    }
  }

  return { error, putCampanhaPerfilInvestimento }
}
