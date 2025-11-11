import { useCallback, useState } from 'react'

import type { CotasType } from '@/types/cotas/CotasType'
import { CotasService } from '@/services/CotasService'

export const useUltimaCota = () => {
  const [ultimaCota, setUltimaCota] = useState<CotasType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getUltimaCota = useCallback(async (cpf: string) => {
    try {
      const response = await CotasService.getUltimaCota(cpf)

      setUltimaCota(response)
    } catch (error: any) {
      setError(error.message)
    }
  }, [])

  return { ultimaCota, error, getUltimaCota }
}
