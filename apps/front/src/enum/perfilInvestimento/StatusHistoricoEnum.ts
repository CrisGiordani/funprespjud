export enum StatusHistoricoEnum {
  PREENCHIDO = 1,
  NAO_PREENCHIDO_OPCAO_PARTICIPANTE = 2,
  NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR = 3
}

export enum StatusHistoricoAPPEnum {
  NUNCA_PREENCHIDO = 0,
  PREENCHIDO = 1,
  NAO_PREENCHIDO_OPCAO_PARTICIPANTE = 2,
  NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR = 3,
  PREENCHIDO_APTO_ALTERAR_PERFIL = 4,
  PREENCHIDO_MAS_AINDA_VALIDO = 5,
  PREENCHIDO_MAS_NAO_VALIDO = 6
}

export const statusMessageMap = new Map<StatusHistoricoAPPEnum, { message: string; icon: string; variant: string }>([
  [
    StatusHistoricoAPPEnum.NUNCA_PREENCHIDO,
    {
      message: 'Aguardando uma resposta à Análise de perfil do participante...',
      icon: 'fa-regular fa-clock',
      variant: 'warning'
    }
  ],
  [
    StatusHistoricoAPPEnum.PREENCHIDO,
    {
      message: 'Preenchido.',
      icon: 'fa-regular fa-circle-check',
      variant: 'success'
    }
  ],
  [
    StatusHistoricoAPPEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE,
    {
      message: 'Não respondido.',
      icon: 'fa-regular fa-ban',
      variant: 'error'
    }
  ],
  [
    StatusHistoricoAPPEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR,
    {
      message: 'Não respondido e desejo de não ser notificado.',
      icon: 'fa-kit fa-no-notification',
      variant: 'error'
    }
  ],
  [
    StatusHistoricoAPPEnum.PREENCHIDO_APTO_ALTERAR_PERFIL,
    {
      message: 'Preenchido novamente.',
      icon: 'fa-regular fa-circle-check',
      variant: 'success'
    }
  ]
])
