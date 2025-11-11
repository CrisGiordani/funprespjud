import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { AppStatusType } from '@/types/perfilInvestimento/AppStatusType'

export default function useGetAppStatus() {
  const [appStatus, setAppStatus] = useState<AppStatusType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getAppStatus = useCallback(async (cpf: string) => {
    try {
      const response = await PerfilInvestimentoService.getStatusApp(cpf)

      setAppStatus(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { appStatus, error, getAppStatus }
}
