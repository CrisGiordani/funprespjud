import { apiNode } from '@/lib/api'
import type { UserType } from '@/types/UserType'

export const getUserFromToken = async (): Promise<UserType | null> => {
  try {
    const token = localStorage.getItem('token')

    if (!token) return null

    const response = await fetch('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    return null
  }
}

export const checkSenha = async (cpf: string, senha: string) => {
  try {
    const response = await apiNode.post('/users/check-senha', { cpf, senha })

    if (response.status === 200) {
      return { success: true, message: 'Senha correta' }
    }

    return { success: false, message: response.data?.error || 'Erro ao verificar senha' }
  } catch (error: any) {
    // Se foi bloqueado pelo interceptor (viewerMode)
    if (error.unauthorized) {
      return { success: false, message: 'Esta ação é apenas para consulta e não altera informações do participante.' }
    }

    if (error.response?.status === 401) {
      return { success: false, message: 'Senha incorreta' }
    }

    if (error.response?.status === 404) {
      return { success: false, message: 'Usuário não encontrado' }
    }

    return { success: false, message: 'Erro interno do servidor' }
  }
}
