import { useCallback, useState } from 'react'

import { BeneficiarioService } from '@/services/BeneficiarioService'
import type { BeneficiarioCreatePayload } from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'

export default function useCreateBeneficiario() {
  const [error, setError] = useState<string | null>(null)

  const createBeneficiario = useCallback(async (participanteId: string, data: BeneficiarioCreatePayload) => {
    try {
      const result = await BeneficiarioService.criarBeneficiario(participanteId, data)

      return result
    } catch (error) {
      const errorMessage = (error as any).message || 'Erro ao criar beneficiário'

      setError(errorMessage)
      throw error
    }
  }, [])

  return { error, createBeneficiario }
}
