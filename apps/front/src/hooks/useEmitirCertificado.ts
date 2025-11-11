import { useState, useCallback } from 'react'

import { DocumentoService } from '@/services/DocumentoService'
import type { EmitirCertificadoType } from '@/types/documentos/EmitirCertificadoType'
import type { UseEmitirCertificadoReturnType } from '@/types/documentos/UseEmitirCertificadoReturnType'

export default function useEmitirCertificado(): UseEmitirCertificadoReturnType {
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const emitirCertificado = useCallback(async (params: EmitirCertificadoType) => {
    setError(null)
    setData(null)

    try {
      const result = await DocumentoService.emitirCertificado(params.cpf)

      setData(result)

      return result
    } catch (err: any) {
      setError(err.message || 'Erro ao emitir certificado')
      throw err
    }
  }, [])

  const reset = () => {
    setError(null)
    setData(null)
  }

  return { emitirCertificado, error, data, reset }
}
