import { useState } from 'react'

import { checkSenha as checkSenhaService } from '@/services/userService'

export const useCheckSenha = () => {
  const [error, setError] = useState<string | null>(null)

  const checkSenha = async (cpf: string, senha: string) => {
    setError(null)

    try {
      const response = await checkSenhaService(cpf, senha)

      if (response.success) {
        return { success: true, message: response.message }
      } else {
        setError(response.message)

        return { success: false, message: response.message }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro interno do servidor'

      setError(errorMessage)

      return { success: false, message: errorMessage }
    }
  }

  return { checkSenha, error }
}
