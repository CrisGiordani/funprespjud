import { api } from '@/lib/api'

import type {
  BeneficiarioFormData,
  BeneficiarioUpdatePayload,
  BeneficiarioCreatePayload
} from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'
import type { ServiceResponse } from '@/types/ServiceResponseType'

export const BeneficiarioService = {
  listarBeneficiarios: async (participanteId: string): Promise<ServiceResponse<any>> => {
    try {
      const response = await api.get(`/participantes/${participanteId}/beneficiarios`)

      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        return {
          success: false,
          unauthorized: true
        }
      }

      return {
        success: false,
        message: 'Erro ao listar beneficiários'
      }
    }
  },

  atualizarBeneficiario: async (
    participanteId: string,
    beneficiarioId: string,
    data: BeneficiarioUpdatePayload
  ): Promise<ServiceResponse<BeneficiarioFormData>> => {
    try {
      const response = await api.put(`/participantes/${participanteId}/beneficiario/${beneficiarioId}`, data)

      return {
        success: true,
        data: response.data as BeneficiarioFormData
      }
    } catch (error: any) {
      if (error.unauthorized) {
        return error
      }

      // Se for erro 422 com erros de validação, retorna a estrutura completa
      if (error.response?.status === 422 && error.response?.data?.errors) {
        return {
          success: false,
          message: error.response.data.message,
          errors: error.response.data.errors
        }
      }

      return {
        success: false,
        message: error.message || error.response?.data?.message || 'Erro ao atualizar beneficiário'
      }
    }
  },

  criarBeneficiario: async (
    participanteId: string,
    data: BeneficiarioCreatePayload
  ): Promise<ServiceResponse<BeneficiarioFormData>> => {
    try {
      const response = await api.post(`/participantes/${participanteId}/beneficiarios`, data)

      return {
        success: true,
        data: response.data as BeneficiarioFormData
      }
    } catch (error: any) {
      if (error.unauthorized) {
        return error
      }

      // Se for erro 422 com erros de validação, retorna a estrutura completa
      if (error.response?.status === 422 && error.response?.data?.errors) {
        return {
          success: false,
          message: error.response.data.message,
          errors: error.response.data.errors
        }
      }

      return {
        success: false,
        message: error.message || error.response?.data?.message || 'Erro ao criar beneficiário'
      }
    }
  },

  excluirBeneficiario: async (participanteId: string, beneficiarioId: string): Promise<ServiceResponse<void>> => {
    try {
      await api.delete(`/participantes/${participanteId}/beneficiario/${beneficiarioId}`)

      return {
        success: true,
        message: 'Beneficiário excluído com sucesso'
      }
    } catch (error: any) {
      if (error.unauthorized) {
        return error
      }

      return {
        success: false,
        message: 'Erro ao excluir beneficiário'
      }
    }
  }
}
