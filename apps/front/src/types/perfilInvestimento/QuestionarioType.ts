import type { BlocoType } from './BlocoType'

export type QuestionarioType = {
  id: string
  descricao: string
  ativo: boolean
  blocos: BlocoType[]
}
