export type CoberturaType = {
  tipoContribuicao: string
  valorSeguro: number
  mensalidade: number
}

export type CoberturaResponseType = {
  morte: CoberturaType
  invalidez: CoberturaType
}
