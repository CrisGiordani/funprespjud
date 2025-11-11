import { useState } from 'react'

import { ImpostoDeRendaService } from '@/services/ImpostoDeRendaService'

export default function useDemonstrativoAnaliticoImpostoRenda() {
  const [demonstrativoAnaliticoImpostoRenda, setDemonstrativoAnaliticoImpostoRenda] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  const getDemonstrativoAnaliticoImpostoRenda = async (cpf: string, ano: string | number, patrocinador: string) => {
    try {
      const response = await ImpostoDeRendaService.getDemonstrativoAnaliticoImpostoRenda(cpf, ano, patrocinador)

      setDemonstrativoAnaliticoImpostoRenda(response)
    } catch (error) {
      setError(error)
      throw error
    }
  }

  return {
    demonstrativoAnaliticoImpostoRenda,
    error,
    getDemonstrativoAnaliticoImpostoRenda
  }
}
