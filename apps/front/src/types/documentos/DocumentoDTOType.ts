import type { DocumentosType } from './DocumentosType'

export type DocumentoDTOType = {
  pagina: number
  total_paginas: number
  total_itens: number
  itens_por_pagina: number
  dados: DocumentosType[]
}
