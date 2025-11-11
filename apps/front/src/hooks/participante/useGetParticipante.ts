import { useState, useCallback } from 'react'

import { ParticipanteService } from '@/services/ParticipanteService'
import type { ParticipanteFormData } from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'
import { FotoPerfilService } from '@/services/FotoPerfilService'

export type ParticipanteType = ParticipanteFormData & {
  fotoPerfil?: string
}

export default function useGetParticipante() {
  const [participante, setParticipante] = useState<ParticipanteType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getParticipante = useCallback(async (cpf: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ParticipanteService.getParticipante(cpf)

      // getFotoPerfil retorna null se não houver avatar (caso normal)
      const fotoPerfilRaw = await FotoPerfilService.getFotoPerfil(cpf)

      setParticipante({ ...data.data, fotoPerfil: fotoPerfilRaw || undefined } as ParticipanteType)

      return { ...data.data, fotoPerfil: fotoPerfilRaw || undefined } as ParticipanteType
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do participante'

      setError(errorMessage)
      setParticipante(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setParticipante(null)
  }, [])

  return {
    participante,
    isLoading,
    error,
    getParticipante,
    reset
  }
}
