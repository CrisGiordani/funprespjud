import type { AlternativasType } from './AlternativasType'

export type PerguntaType = {
  id: string
  descricao: string
  ativo: boolean
  alternativas: AlternativasType[]
}
