import { PerfilInvestimentoEnum } from '@/enum/perfilInvestimento/PerfilInvestimentoEnum'
import { StatusHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusHistoricoAlteracaoPerfilInvestimentoEnum'
import { StatusIdHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusIdHistoricoAlteracaoPerfilInvestimentoEnum'

export type PerfilData = {
  nomePerfil: string
  benchmark: string
  limiteRisco: string
  dataAposentadoria: string
  dataPorcentagem: number[]
  alocacaoObjetiva: number[]
  idPerfil: PerfilInvestimentoEnum
  icon: string
}

const PERFIS_DATA: PerfilData[] = [
  {
    nomePerfil: 'Horizonte 2040',
    benchmark: 'IPCA + 4,25%',
    limiteRisco: '9,00%',
    dataAposentadoria: 'entre 2031 e 2046',
    dataPorcentagem: [97.4, 0.0, 0.8, 1.3, 0.6, 0.0],
    alocacaoObjetiva: [97.4, 0.0, 0.8, 1.3, 0.6, 0.0],
    idPerfil: PerfilInvestimentoEnum.HORIZONTE_2040,
    icon: 'fa-regular fa-hourglass-half'
  },
  {
    nomePerfil: 'Horizonte 2050',
    benchmark: 'IPCA + 5,00%',
    limiteRisco: '10,00%',
    dataAposentadoria: 'a partir de 2047',
    dataPorcentagem: [73.1, 13.7, 5.0, 1.3, 8.2, 0.0],
    alocacaoObjetiva: [73.1, 13.7, 5.0, 1.3, 8.2, 0.0],
    idPerfil: PerfilInvestimentoEnum.HORIZONTE_2050,
    icon: 'fa-regular fa-hourglass-start'
  },
  {
    nomePerfil: 'Horizonte Protegido',
    benchmark: '90% IMA-B5 + 10%',
    limiteRisco: 'gestão passiva',
    dataAposentadoria: 'até 2030',
    dataPorcentagem: [100.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    alocacaoObjetiva: [100.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    idPerfil: PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO,
    icon: 'fa-regular fa-hourglass-end'
  }
]

/**
 * Retorna os dados do perfil baseado no idPerfil
 * @param idPerfil - ID do perfil de investimento
 * @returns Dados do perfil ou null se não encontrado
 */
export const getPerfilDataById = (idPerfil: number | string): PerfilData | null => {
  // Converte string para número se necessário
  const idPerfilNumber = typeof idPerfil === 'string' ? parseInt(idPerfil, 10) : idPerfil

  return PERFIS_DATA.find(perfil => perfil.idPerfil === idPerfilNumber) || null
}

/**
 * Retorna apenas os dados básicos do perfil (benchmark, limiteRisco, dataAposentadoria)
 * @param idPerfil - ID do perfil de investimento
 * @returns Objeto com benchmark, limiteRisco e dataAposentadoria ou null se não encontrado
 */
export const getPerfilBasicDataById = (
  idPerfil: number | string
): { benchmark: string; limiteRisco: string; dataAposentadoria: string } | null => {
  const perfil = getPerfilDataById(idPerfil)

  if (!perfil) return null

  return {
    benchmark: perfil.benchmark,
    limiteRisco: perfil.limiteRisco,
    dataAposentadoria: perfil.dataAposentadoria
  }
}

export const getStatusHistoricoAlteracaoPerfilInvestimentoLabel = (
  status: StatusHistoricoAlteracaoPerfilInvestimentoEnum | StatusIdHistoricoAlteracaoPerfilInvestimentoEnum | string
) => {
  // Se é string vazia, retorna string vazia
  if (typeof status === 'string' && status === '') {
    return ''
  }

  const statusFullNameMap = {
    'Confirmação Pendente: Valide seu Token': StatusHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE,
    'Solicitação Processada': StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_PROCESSADA,
    'Solicitação Recebida': StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_RECEBIDA,
    'Cancelado - Por Solicitação do Participante':
      StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE,
    'Cancelado - Nova Solicitação Registrada':
      StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA,
    'Erro no Processamento': StatusHistoricoAlteracaoPerfilInvestimentoEnum.ERRO_NO_PROCESSAMENTO
  } as Record<string, StatusHistoricoAlteracaoPerfilInvestimentoEnum>

  const mappedStatus = statusFullNameMap[status as string]

  if (mappedStatus !== undefined) {
    status = mappedStatus
  }

  switch (status) {
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE:
      return 'Aguardando confirmação'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_PROCESSADA:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_PROCESSADA:
      return 'Solicitação processada'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_RECEBIDA:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_RECEBIDA:
      return 'Solicitação recebida'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE:
      return 'Solicitação cancelada'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA:
      return 'Solicitação substituída'
    default:
      return status || ''
  }
}

export const getStatusHistoricoAlteracaoPerfilInvestimentoColor = (
  status: StatusHistoricoAlteracaoPerfilInvestimentoEnum | StatusIdHistoricoAlteracaoPerfilInvestimentoEnum | string
) => {
  // Se o status é uma string (descrição do backend), mapeia para cor
  if (typeof status === 'string') {
    if (status.includes('Confirmação Pendente') || status.includes('Aguardando confirmação')) {
      return 'warning'
    }

    if (
      status.includes('Solicitação Processada') ||
      status.includes('Solicitação processada') ||
      status.includes('Solicitação Recebida') ||
      status.includes('Solicitação recebida')
    ) {
      return 'success'
    }

    if (status.includes('Cancelado') || status.includes('Erro')) {
      return 'error'
    }

    return 'default'
  }

  switch (status) {
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE:
      return 'warning'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_PROCESSADA:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_PROCESSADA:
      return 'success'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_RECEBIDA:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_RECEBIDA:
      return 'success'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA:
      return 'error'
    case StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE:
    case StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE:
      return 'error'
    default:
      return 'default'
  }
}

export const showButtonToken = (
  status: StatusHistoricoAlteracaoPerfilInvestimentoEnum | StatusIdHistoricoAlteracaoPerfilInvestimentoEnum
) => {
  return (
    status === StatusHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE ||
    status === StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE
  )
}

export const showButtonCancelarSolicitacao = (
  status: StatusHistoricoAlteracaoPerfilInvestimentoEnum | StatusIdHistoricoAlteracaoPerfilInvestimentoEnum
) => {
  return (
    status !== StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA &&
    status !== StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_NOVA_SOLICITACAO_REGISTRADA &&
    status !== StatusHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE &&
    status !== StatusIdHistoricoAlteracaoPerfilInvestimentoEnum.CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE
  )
}
