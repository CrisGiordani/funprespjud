export const statusContribuicao = {
  aguardando_pagamento: {
    label: 'Aguardando pagamento',
    color: 'warning'
  },
  pago: {
    label: 'Pago',
    color: 'success'
  },
  vencido: {
    label: 'Vencido',
    color: 'error'
  },
  cancelado: {
    label: 'Cancelado',
    color: 'default'
  }
}

export type ContribuicaoFacultativaHistoricoResponseType = {
  id: number
  valor: number
  data: string
  vencimento: string
  status: keyof typeof statusContribuicao
  meio: string
}

export type ContribuicaoFacultativaPixResponseType = {
  qrCode: string
  chave: string
}

export type ContribuicaoFacultativaBoletoResponseType = {
  link: string
  codigo: string
}
