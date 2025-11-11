import type { PerguntaType } from './PerguntaType'

export type BlocoType = {
  id: string
  nomeBloco: string
  descricao: string
  perguntas: PerguntaType[]
}
