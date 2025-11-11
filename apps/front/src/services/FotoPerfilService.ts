import { api } from '@/lib/api'

export const FotoPerfilService = {
  getFotoPerfil: async (participantId: string) => {
    try {
      const response = await api.get<{ urlAvatar: string }>(`/participantes/${participantId}/avatar`)

      return response.data?.urlAvatar
    } catch (error: any) {
      // Se for 404 (No Content) ou 204, significa que não há avatar - retorna null
      // Isso é um caso normal, não um erro
      if (error?.response?.status === 404 || error?.response?.status === 204) {
        return null
      }
      
      // Para outros erros (como 500), apenas loga mas não quebra o fluxo
      // Retorna null para que o componente mostre as iniciais
      console.error('Erro ao buscar foto de perfil:', error)
      return null
    }
  },
  salvarFotoPerfil: async (participantId: string, formData: FormData) => {
    try {
      const response = await api.post(`/participantes/${participantId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data.url
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
