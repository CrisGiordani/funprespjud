export interface BeneficioAposentadoriaNormal {
    saldoTotalRan: number
    fatorSobrevida: number
    valorBeneficioMensalBruto: number
  }
  
  export interface SimulacaoSimplificadaNormalData {
    beneficio_aposentadoria_normal: BeneficioAposentadoriaNormal
  }
  
  export interface SimulacaoSimplificadaNormalMetadata {
    timestamp: string
    version: string
    endpoint: string
    method: string
  }
  
  export interface SimulacaoSimplificadaNormalResponse {
    success: boolean
    message: string
    data: SimulacaoSimplificadaNormalData
    metadata: SimulacaoSimplificadaNormalMetadata
  }
