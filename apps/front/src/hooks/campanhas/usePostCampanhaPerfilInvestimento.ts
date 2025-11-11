import { useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

export const usePostCampanhaPerfilInvestimento = () => {
  const [error, setError] = useState<string | null>(null)

  const postCampanhaPerfilInvestimento = async (campanha: CampanhaType) => {
    try {
      const response = await CampanhaService.postCampanhaPerfilInvestimento(campanha)

      return response
    } catch (error: any) {
      setError(error.message as string)

      // throw error
    }
  }

  return { error, postCampanhaPerfilInvestimento }
}
