import type { EmitirCertificadoType } from './EmitirCertificadoType'

export type UseEmitirCertificadoReturnType = {
  emitirCertificado: (params: EmitirCertificadoType) => Promise<any>
  error: string | null
  data: any
  reset: () => void
}
