import { useCallback, useState } from 'react'

import { PatrocinadorService } from '@/services/PatrocinadorService'
import type { PatrocinadoresDTOType } from '@/types/patrocinador/PatrocinadoresDTOType'

export default function useGetPatrocinador() {
  const [listPatrocinadores, setListPatrocinadores] = useState<PatrocinadoresDTOType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getPatrocinadores = useCallback(async (cpf: string) => {
    try {
      setIsLoading(true)
      const result = await PatrocinadorService.getPatrocinador(cpf)

      setListPatrocinadores(result.data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados dos patrocinadores'

      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { listPatrocinadores, error, getPatrocinadores, isLoading }
}
