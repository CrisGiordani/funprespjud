import type { EvolucaoAnualDTO } from './EvolucaoAnualDTO.type'

export type EvolucaoMensalDTO = EvolucaoAnualDTO & {
  mes?: string
}
