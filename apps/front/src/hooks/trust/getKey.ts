import { useState, useCallback, useEffect } from 'react'

import { APITrustService } from '@/services/APITrustService'
import { useAuth } from '@/contexts/AuthContext'
import useGetParticipante from '../participante/useGetParticipante'

export default function useGetKey() {
  const [key, setKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const { participante, isLoading: isLoadingParticipante, getParticipante } = useGetParticipante()

  const getKey = useCallback(async (idPessoa: string, idPessoaParticipante: string, idPlano: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await APITrustService.getKey({ idPessoa, idPessoaParticipante, idPlano })

      setKey(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao gerar a chave para acessar a plataforma de empréstimos'

      setError(errorMessage)
      setKey(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (participante) {
      getKey(participante?.id, participante?.id, '1')
    }
  }, [participante, getKey])

  useEffect(() => {
    if (user?.cpf) {
      getParticipante(user.cpf)
    }
  }, [user])

  return {
    key,
    isLoading: isLoading || isLoadingParticipante,
    error,
    getKey
  }
}
