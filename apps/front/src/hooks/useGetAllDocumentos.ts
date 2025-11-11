import { useCallback, useState } from 'react'

import { DocumentoService } from '../services/DocumentoService'
import type { DocumentoDTOType } from '../types/documentos/DocumentoDTOType'
import type { FilterAtaDocumentosType } from '../types/documentos/FilterAtaDocumentosType'

export default function useGetAllDocumentos() {
  const [documentos, setDocumentos] = useState<DocumentoDTOType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getAllDocumentos = useCallback(async ({ tipo, ano, pageIndex = 0, pageSize = 10 }: FilterAtaDocumentosType) => {
    try {
      setIsLoading(true)
      const response = await DocumentoService.getAll({ tipo, ano, pageIndex, pageSize })

      setDocumentos(response as unknown as DocumentoDTOType)
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar documentos')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { documentos, error, getAllDocumentos, isLoading }
}
