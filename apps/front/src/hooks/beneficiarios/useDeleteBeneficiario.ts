import { useCallback, useState } from 'react'

import { BeneficiarioService } from '@/services/BeneficiarioService'

export default function useDeleteBeneficiario() {
  const [error, setError] = useState<string | null>(null)

  const deleteBeneficiario = useCallback(async (participanteId: string, beneficiarioId: string) => {
    try {
      const result = await BeneficiarioService.excluirBeneficiario(participanteId, beneficiarioId)

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar beneficiário'

      setError(errorMessage)
      throw error
    }
  }, [])

  return { error, deleteBeneficiario }
}
