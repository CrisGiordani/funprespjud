import { useState, useCallback } from 'react'

import { ParticipanteService } from '@/services/ParticipanteService'
import type { ParticipanteFormData } from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'
import { FotoPerfilService } from '@/services/FotoPerfilService'
import { useProfile } from '@/contexts/ProfileContext'

export default function useUpdateParticipante() {
  const [error, setError] = useState<string | null>(null)

  const { profile, setProfile } = useProfile()

  const updateParticipante = useCallback(
    async (cpf: string, data: ParticipanteFormData) => {
      try {
        setError(null)
        const response = await ParticipanteService.atualizarParticipante(cpf, data)

        const fotoPerfil = await FotoPerfilService.getFotoPerfil(cpf)

        setProfile({
          nome: response.data?.nome || profile.nome,
          email: response.data?.emailPrincipal || profile.email,
          fotoPerfil: fotoPerfil || ''
        })

        if (response.success) {
          return {
            success: true,
            data: response.data,
            message: response.message
          }
        } else {
          return {
            success: false,
            data: response.data,
            message: response.message
          }
        }
      } catch (err: any) {
        if (err.unauthorized) {
          return {
            success: false,
            data: null,
            message: 'Sessão expirada. Por favor, faça login novamente.'
          }
        }

        if (err.notFound) {
          return {
            success: false,
            data: null,
            message: 'Participante não encontrado.'
          }
        }
      }
    },
    [profile, setProfile]
  )

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    updateParticipante,
    reset
  }
}
