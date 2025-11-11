import { useCallback, useState } from 'react'

import { PatrocinadorService } from '@/services/PatrocinadorService'
import type { PatrocinadoresDTOType } from '@/types/patrocinador/PatrocinadoresDTOType'

export const useGetPatrocinadoresSalario = () => {
  const [listPatrocinadoresSalario, setListPatrocinadoresSalario] = useState<PatrocinadoresDTOType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getPatrocinadoresSalario = useCallback(async (cpf: string) => {
    try {
      const response = await PatrocinadorService.getPatrocinadorSalario(cpf)

      setListPatrocinadoresSalario(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { listPatrocinadoresSalario, error, getPatrocinadoresSalario }
}
