import { useState } from 'react'

import { ParticipanteService } from '@/services/ParticipanteService'
import type { ServiceResponse } from '@/types/ServiceResponseType'

export const useUpdateCargoEfetivo = () => {
  const [error, setError] = useState<string | null>(null)

  const updateCargoEfetivo = async (
    participanteId: string,
    cargos: Record<string, string>
  ): Promise<ServiceResponse<void>> => {
    setError(null)

    try {
      const response = await ParticipanteService.atualizarCargoEfetivo(participanteId, cargos)

      if (!response.success) {
        setError(response.message || 'Erro ao atualizar cargos efetivos')
      }

      return response
    } catch (err: any) {
      const errorMessage = 'Erro inesperado ao atualizar cargos efetivos'

      setError(errorMessage)

      return {
        success: false,
        message: errorMessage
      }
    }
  }

  return {
    updateCargoEfetivo,
    error
  }
}
