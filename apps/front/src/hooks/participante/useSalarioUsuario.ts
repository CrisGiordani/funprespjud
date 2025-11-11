import { useCallback, useState } from 'react'

import { PatrocinadorService } from '@/services/PatrocinadorService'

export const useSalarioUsuario = () => {
  const [salario, setSalario] = useState<number | null>(null)
  const [salariosSomados, setSalariosSomados] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getSalarioUsuario = useCallback(async (cpf: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await PatrocinadorService.getPatrocinadorSalario(cpf)

      // Pega o primeiro patrocinador e seu salário
      const primeiroPatrocinador = response.patrocinadores?.[0]
      const salarioUsuario = primeiroPatrocinador?.salario || 0

      setSalario(salarioUsuario)

      setSalariosSomados(
        response.patrocinadores?.reduce((acc, patrocinador) => acc + (patrocinador.salario || 0), 0) || 0
      )

      return salarioUsuario
    } catch (error) {
      setError(error as string)
      setSalario(0) // Fallback para 0 em caso de erro

      return 0
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { salario, salariosSomados, error, isLoading, getSalarioUsuario }
}
