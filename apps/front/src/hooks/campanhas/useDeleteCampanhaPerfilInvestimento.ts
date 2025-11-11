import { useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const useDeleteCampanhaPerfilInvestimento = () => {
  const [error, setError] = useState<string | null>(null)

  const deleteCampanhaPerfilInvestimento = async (campanha: CampanhaType) => {
    try {
      const response = await CampanhaService.deleteCampanhaPerfilInvestimento(campanha)

      return response
    } catch (error) {
      setError(error as string)

      //   throw e
    }
  }

  return { error, deleteCampanhaPerfilInvestimento }
}
