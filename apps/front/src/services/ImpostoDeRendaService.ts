import { api } from '@/lib/api'

export const ImpostoDeRendaService = {
  getImpostoDeRendaRelatorio: async (cpf: string, ano: string | number, patrocinador: string) => {
    try {
      const response = await api.get(
        `/participantes/imposto-renda/relatorio/${cpf}/${ano}/${patrocinador}`,

        // {
        //   ano: ano,
        //   patrocinador: patrocinador
        // },
        {
          responseType: 'blob',
          headers: {
            Accept: 'application/pdf',
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response) {
        throw new Error('Nenhum dado recebido do servidor')
      }

      const pdfBlob = new Blob([response as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(pdfBlob)

      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw error
    }
  },

  getContribuicoesComplementares: async (cpf: string, ano: string | number, patrocinador: string) => {
    try {
      const response = await api.get(
        `/participantes/imposto-renda/contribuicoes-complementares/${cpf}/${ano}/${patrocinador}`
      )

      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  getDemonstrativoAnaliticoImpostoRenda: async (cpf: string, ano: string | number, patrocinador: string) => {
    try {
      const response = await api.get(`/participantes/${cpf}/imposto-renda/contribuicoes`, {
        params: {
          ano: ano,
          patrocinador: patrocinador
        }
      })

      return response.data
    } catch (error: any) {
      if (error.unauthorized) {
        return error
      }

      return {
        success: false,
        message: 'Erro ao gerar demonstrativo analítico'
      }
    }
  }
}
