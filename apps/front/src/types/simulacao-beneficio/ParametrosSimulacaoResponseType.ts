export interface SimulacaoResponseType {
  saldosEBeneficios: {
    saldo_normal_total: number
    beneficio_normal_mensal: number
    saldo_suplementar_total: number
    beneficio_suplementar_mensal: number
    saldo_total: number
    beneficio_mensal_total: number
  }
  contribuicoesMensaisParticipante: {
    normal: ValorPercentual
    facultativa: ValorPercentual
    total: ValorPercentual
  }
  beneficios: {
    beneficio_especial: number
    beneficio_rpps: number
    beneficios_funpresp_jud: number
    beneficio_previdenciario_bruto: number
    beneficio_previdenciario_liquido: number
    beneficio_suplementar_mensal: number
  }
  dadosParticipante: {
    data_nascimento: string
    tipo_participante: string
    data_adesao: string
    regime_tributacao: string
    data_opcao_regime_tributario: string
    idade_provavel_aposentadoria: string
    prazo_recebimento_aposentadoria_normal: string
    prazo_recebimento_aposentadoria_suplementar: string
  }
  informacoesAdicionais: {
    base_contribuicao_funpresp: string
    rentabilidade_real_anual: string
    aporte_extraordinario_ou_portabilidade: string
    prazo_certo: string
    percentual_saque: string
    percentual_comparativo: string
  }
  planoCusteioVigente: {
    patrocinada: {
      RAN: number
      RAS: number
      FCBE: number
      taxa_carregamento: number
    }
    vinculada: {
      RAN: string
      RAS: string
      FCBE: string
      taxa_carregamento: string
    }
    facultativa: {
      RAN: string
      RAS: string
      FCBE: string
      taxa_carregamento: string
    }
  }
  performance: {
    anos: number[]
    performance_atual: number[]
    performance_simulada: number[]
    total_atual: number
    total_simulada: number
  }
  beneficioLiquido: {
    beneficio_bruto: number
    irpf_regressivo: ValorPercentual
    contribuicao_administrativa: ValorPercentual
    beneficio_liquido: number
  }
  dadosSimulacao: DadosSimulacao
  tetoRPPS: string
  contribuicoesSimuladas: ContribuicaoSimulada[]
  saldoRentabilizado: {
    saldoRanRentabilizado: number
    beneficioNormalBruto: number
    saldoRasRentabilizado: number
    beneficioSuplementarBruto: number
  }
  saldoProjetado: {
    saldoProjetadoCotasRanParticipante: number
    saldoProjetadoCotasRanPatrocinador: number
    saldoProjetadoCotasRasParticipante: number
    valorCotaProjetado: number
    saldoProjetadoRanParticipante: number
    saldoProjetadoRanPatrocinador: number
    saldoProjetadoRasParticipante: number
  }
  totalRentabilizado: {
    totalRentabilizadoRanParticipante: number
    totalRentabilizadoRanPatrocinador: number
    totalRentabilizadoRasParticipante: number
  }
  beneficioAposentadoriaNormal: {
    saldoTotalRan: number
    fatorSobrevida: number
    valorBeneficioMensalBruto: number
  }
  beneficioSuplementar: {
    saldoRasTotal: number
    prazo: number
    percentualSaque: number
    valorSaque: number
    valorBeneficioSumplementarMensal: number
  }
  urp: {
    valorUrp: number
    urps: number
    tetoUrp: number
  }
}

export interface ValorPercentual {
  valor: number
  percentual: number
}

export interface ContribuicaoSimulada {
  referencia: string // ex: "10/2025"
  conta: string // ex: "RAN_NORMAL_PARTIC" | "RAN_NORMAL_PATROC" | "RAS_FACULTATIVA"
  valorContribuicao: number
  valorCota: number
  quantidadeCotasAtual: number
  saldoCotaTotal: number
  valorSaldoTotal: number
}

export interface DadosSimulacao {
  nome: string
  dataNascimento: string
  sexo: string // "M" | "F"
  dtInscricaoPlano: string | null
  idParticipante: string
  inscricao: string
  matricula: string
  rg: string
  emissorRg: string
  ufRg: string
  dataExpedicaoRg: string
  estadoCivil: string
  email: string
  id_situacao: string
  dataAdmissao: string
  idTrust: string
  dadosParticipante: DadosSimulacaoParticipante
  planoSituacao: string
  planoSituacaoConsiderada: string
  dataSaldoConta: {
    dataIndexador: string // datetime
  }
  saldoRanParticipante: number
  saldoRanPatrocinador: number
  saldoRasParticipante: number
  regimeTributacao: string
  fatorTabuaAtuarial: number
  fatorSobrevida: number
  fatorSobrevidaRas: number
  salarioParticipante: number
  percentualContribuicaoNormal: number
  percentualContribuicaoVinculada: number
  percentualContribuicaoFacultativa: number
  novoPercentualContribuicaoNormal: number
  novoPercentualContribuicaoVinculada: number
  novoPercentualContribuicaoFacultativa: number
  valorContribuicaoNormal: number
  valorContribuicaoVinculada: number
  novoValorContribuicaoNormal: number
  novoValorContribuicaoVinculada: number
  valorContribuicaoFacultativa: number
  novoValorContribuicaoFacultativa: number
  fcbe: number
  pga: number
  valorCotaAtual: number
  valorCotaProjetado: number
  totalRentabilizadoCotasRanParticipante: number
  totalRentabilizadoCotasRanPatrocinador: number
  totalRentabilizadoCotasRasParticipante: number
  qtCotaAtualRanParticipante: number
  qtCotaProjetadoRanParticipante: number
  qtCotaAtualRanPatrocinador: number
  qtCotaProjetadoRanPatrocinador: number
  qtCotaAtualRasParticipante: number
  qtCotaProjetadoRasParticipante: number
  aporteExtraordinario: number
  rentabilidadeProjetada: number
  idadeAposentadoria: number
  saqueReserva: number
  prazoRecebimento: number
  dataPrevistaAposentadoria: string // ISO
  percentualSaque: number
  novoSalarioParticipante: number
  novoAporteExtraordinario: number
  novaRentabilidadeProjetada: number
  novaIdadeAposentadoria: number
  novaDataPrevistaAposentadoria: string // ISO
  novoPrazoRecebimento: number
  novoSaqueReserva: number
}

export interface DadosSimulacaoParticipante {
  id: string
  nome: string
  dtNascimento: string
  sexo: string // "M" | "F"
  inscricao: string
  matricula: string
  rg: string
  emissorRg: string
  ufRg: string
  dtExpedicaoRg: string
  nmEstadoCivil: string
  politicamenteExposto: string
  nmMae: string
  nmPai: string
  logradouro: string
  numero: string | null
  enderecoComplemento: string | null
  bairro: string
  cidade: string
  enderecoUf: string
  cep: string
  telefone: string
  telefoneComercial: string
  celular: string
  dtExercicio: string
  dtInscricaoPlano: string | null
  idCargo: string
  nmCargo: string
  idEmpresa: number
  naturalidade: string
  ufNaturalidade: string
  nacionalidade: string
  nmNacionalidade: string
  estadoCivil: string
  email: string
  emailAdicional1: string
  emailAdicional2: string
  beneficiarios: unknown[]
}
