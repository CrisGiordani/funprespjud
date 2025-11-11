import { useCallback, useState } from 'react'

import type { TipoDocumentoType } from '@/types/documentos/TipoDocumentoType'
import { DocumentoService } from '@/services/DocumentoService'

export default function useGetAllTiposDocumento() {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoType[]>([])
  const [error, setError] = useState<string | null>(null)

  const getAllTiposDocumento = useCallback(async () => {
    try {
      const result = await DocumentoService.getTipoDocumento()

      setTiposDocumento(result as unknown as TipoDocumentoType[])
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { tiposDocumento, error, getAllTiposDocumento }
}
