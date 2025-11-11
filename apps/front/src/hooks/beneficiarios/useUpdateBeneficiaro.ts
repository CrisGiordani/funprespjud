import { useCallback, useState } from 'react'

import { BeneficiarioService } from '@/services/BeneficiarioService'
import type { BeneficiarioUpdatePayload } from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'

export default function useUpdateBeneficiario() {
  const [error, setError] = useState<string | null>(null)

  const updateBeneficiario = useCallback(
    async (participanteId: string, beneficiarioId: string, data: BeneficiarioUpdatePayload) => {
      try {
        const result = await BeneficiarioService.atualizarBeneficiario(participanteId, beneficiarioId, data)

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar beneficiário'

        setError(errorMessage)
        throw error
      }
    },
    []
  )

  return { error, updateBeneficiario }
}
