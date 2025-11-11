import { useCallback, useState } from 'react'

import { BeneficiarioService } from '@/services/BeneficiarioService'
import type { BeneficiarioFormData } from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'

export default function useGetBeneficiarios(participanteId: string) {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioFormData[]>([])

  const [error, setError] = useState<string | null>(null)

  const getBeneficiarios = useCallback(async () => {
    try {
      setError(null)
      const result = await BeneficiarioService.listarBeneficiarios(participanteId)

      setBeneficiarios(result.data as unknown as BeneficiarioFormData[])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados dos beneficiários'

      setError(errorMessage)
      throw error
    }
  }, [participanteId])

  return { beneficiarios, error, getBeneficiarios }
}
