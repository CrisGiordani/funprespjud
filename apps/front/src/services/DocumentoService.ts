import { api } from '@/lib/api'
import type { DocumentoDTOType } from '@/types/documentos/DocumentoDTOType'
import type { FilterAtaDocumentosType } from '@/types/documentos/FilterAtaDocumentosType'
import type { TipoDocumentoType } from '@/types/documentos/TipoDocumentoType'

export const DocumentoService = {
  emitirCertificado: async (cpf: string) => {
    const blob = await api.get(`/documentos/${cpf}/emitir-certificado`, { responseType: 'blob' })
    const pdfBlob = new Blob([blob as unknown as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(pdfBlob)

    window.open(url, '_blank')
  },

  getAll: async ({ tipo, ano, pageIndex = 0, pageSize = 10 }: FilterAtaDocumentosType) => {
    try {
      const data = await api.get<DocumentoDTOType>('/documentos/', {
        params: {
          tipo: tipo || null,
          ano: ano || null,
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      })

      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  getTipoDocumento: async () => {
    try {
      const response = await api.get<TipoDocumentoType[]>('/documentos/tipo-documento')

      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
