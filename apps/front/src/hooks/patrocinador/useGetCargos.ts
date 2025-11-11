import { useCallback, useState } from 'react'

import { PatrocinadorService } from '@/services/PatrocinadorService'
import type { CargosDTOType } from '@/types/patrocinador/CargosDTOType'

export default function useGetCargos() {
  const [cargos, setCargos] = useState<CargosDTOType[]>([])
  const [error, setError] = useState<string | null>(null)

  const getCargos = useCallback(async (cpf: string) => {
    try {
      const response = await PatrocinadorService.getCargos(cpf)

      setCargos(response)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { cargos, error, getCargos }
}
