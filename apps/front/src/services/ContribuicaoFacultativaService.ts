/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  ContribuicaoFacultativaBoletoResponseType,
  ContribuicaoFacultativaHistoricoResponseType,
  ContribuicaoFacultativaPixResponseType
} from '@/types/contribuicao-facultativa/contribuicao-facultativa.type'
import type { PaginationIrisType } from '@/types/paginacao/pagination-iris.type'

const mockHistoricoContribuicoes: ContribuicaoFacultativaHistoricoResponseType[] = [
  {
    id: 1,
    valor: 500,
    data: '01/03/2025',
    vencimento: '30/05/2025',
    status: 'vencido',
    meio: 'PIX'
  },
  {
    id: 2,
    valor: 500,
    data: '01/03/2025',
    vencimento: '30/05/2025',
    status: 'cancelado',
    meio: 'Boleto'
  },
  {
    id: 3,
    valor: 500,
    data: '01/03/2025',
    vencimento: '30/05/2025',
    status: 'vencido',
    meio: 'Boleto'
  },
  {
    id: 4,
    valor: 100,
    data: '01/03/2025',
    vencimento: '30/05/2025',
    status: 'aguardando_pagamento',
    meio: 'PIX'
  },
  {
    id: 5,
    valor: 450.5,
    data: '01/03/2025',
    vencimento: '30/05/2025',
    status: 'pago',
    meio: 'PIX'
  }
]

const mockQrCodePix: ContribuicaoFacultativaPixResponseType = {
  qrCode: 'https://qrcode.com/1234567890',
  chave: 'https://www.funprespjud.com.br'
}

const mockBoleto: ContribuicaoFacultativaBoletoResponseType = {
  link: 'https://www.funprespjud.com.br',
  codigo: 'qzJr4AN97EL6Il4GSSMlnhqzJr4AN97EL6Il4GSSMlnhqzJr4AN97EL6Il4GSSMlnh'
}

// TODO validar retornos do backend, por enquanto essas chamadas estão mockadas
export const ContribuicaoFacultativaService = {
  getHistoricoContribuicoes: async (
    participantId: string
  ): Promise<{ contribuicoes: ContribuicaoFacultativaHistoricoResponseType[]; paginacao: PaginationIrisType }> => {
    try {
      // const response = await api.get<ContribuicaoFacultativaHistoricoResponseType[]>(
      //   `/contribuicao-facultativa/historico/${participantId}`
      // )

      // return response.data

      return {
        contribuicoes: mockHistoricoContribuicoes,
        paginacao: {
          totalPaginas: 2,
          page: 1,
          handleChange: () => {}
        }
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  gerarQrCodePix: async (valor: number, participantId: string): Promise<ContribuicaoFacultativaPixResponseType> => {
    try {
      // const response = await api.post<ContribuicaoFacultativaPixResponseType>(
      //   `/contribuicao-facultativa/pix/${participantId}`,
      //   {
      //     valor
      //   }
      // )

      // return response.data

      return mockQrCodePix
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  verificarPagamentoPix: async (chave: string, participantId: string): Promise<{ status: string }> => {
    try {
      // const response = await api.get<{ status: string }>(`/contribuicao-facultativa/pix/${participantId}/${chave}`)
      console.log('chave', chave, participantId)

      return {
        status: 'PAGO'
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  gerarBoleto: async (valor: number, participantId: string): Promise<ContribuicaoFacultativaBoletoResponseType> => {
    try {
      // const response = await api.post<ContribuicaoFacultativaBoletoResponseType>(
      //   `/contribuicao-facultativa/boleto/${participantId}`,
      //   {
      //     valor
      //   }
      // )

      // return response.data

      return mockBoleto
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
