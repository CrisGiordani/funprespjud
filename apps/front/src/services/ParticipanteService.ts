import { api } from '@/lib/api'
import type { ParticipanteFormData } from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'
import { formatarDataISO } from '@/app/utils/formatters'
import { FotoPerfilService } from './FotoPerfilService'
import type { ServiceResponse } from '@/types/ServiceResponseType'

import {
  partipanteResponseToParticipanteDTO,
  type ParticipanteResponseType
} from '@/types/participante/ParticipanteResponse.type'

export const ParticipanteService = {
  getParticipante: async (
    participantId: string,
    comPatrocinadores: boolean = false
  ): Promise<ServiceResponse<ParticipanteFormData>> => {
    try {
      const response = await api.get<ParticipanteResponseType>(`/participantes/${participantId}/perfil`, {
        params: {
          ['com-patrocinadores']: comPatrocinadores
        }
      })

      return {
        success: true,
        data: partipanteResponseToParticipanteDTO(response.data)
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
        message: 'Erro ao buscar dados do participante'
      }
    }
  },

  atualizarParticipante: async (
    participantId: string,
    data: ParticipanteFormData
  ): Promise<ServiceResponse<ParticipanteFormData>> => {
    try {
      const apiData = {
        nome: data.nome,
        dtNascimento: formatarDataISO(data.dataNascimento),
        sexo: data.sexo === 'Masculino' ? 'M' : data.sexo === 'Feminino' ? 'F' : 'N',
        estadoCivil: data.estadoCivil,
        rg: data.rg,
        nmMae: data.nomeMae,
        nmPai: data.nomePai,
        nacionalidade: data.nacionalidade,
        emissorRg: data.emissorRg,
        ufRg: data.ufRg,
        naturalidade: data.naturalidade,
        ufNaturalidade: data.ufNaturalidade,
        dtExpedicaoRg: formatarDataISO(data.dataExpedicao),
        cep: data.cep.replace(/\D/g, ''),
        bairro: data.bairro,
        numero: data.numero,
        enderecoUf: data.uf,
        logradouro: data.logradouro,
        enderecoComplemento: data.complemento,
        cidade: data.cidade,
        email: data.emailPrincipal,
        telefone: String(data.telefoneResidencial || '').replace(/\D/g, '') || '0',
        celular: String(data.telefoneCelular || '').replace(/\D/g, '') || '0',
        emailAdicional1: data.emailAlternativo1 || '',
        emailAdicional2: data.emailAlternativo2 || ''
      }

      // Salva foto de perfil se fornecida
      if (data.fotoPerfil && data.fotoPerfil instanceof File) {
        const formData = new FormData()

        formData.append('avatar', data.fotoPerfil)
        await FotoPerfilService.salvarFotoPerfil(participantId, formData)
      }

      await api.put(`/participantes/${participantId}/perfil`, apiData)

      return {
        success: true,
        data: data,
        message: 'Dados do participante atualizados com sucesso'
      }
    } catch (error: any) {
      if (error.unauthorized) {
        return error
      }

      return {
        success: false,
        message: 'Erro ao atualizar dados do participante'
      }
    }
  },

  atualizarCargoEfetivo: async (cpf: string, cargos: Record<string, string>): Promise<ServiceResponse<void>> => {
    try {
      const apiData = {
        data: Object.entries(cargos).map(([idPessoa, cargoId]) => ({
          idPessoa: idPessoa,
          idCargo: cargoId
        }))
      }

      await api.put(`/participantes/${cpf}/cargos`, apiData)

      return {
        success: true,
        message: 'Cargos efetivos atualizados com sucesso'
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
        message: 'Erro ao atualizar cargos efetivos'
      }
    }
  }
}
