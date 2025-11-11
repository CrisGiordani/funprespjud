import type {
  EstadoCivil,
  Nacionalidade,
  ParticipanteFormData,
  UF
} from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'
import { ESTADO_CIVIL, NACIONALIDADE } from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'
import { formatarDataBR, formatarTelefoneBR } from '@/app/utils/formatters'

export type ParticipanteResponseType = {
  id: string
  nome: string
  dtNascimento: string
  sexo: string
  inscricao?: string | null
  matricula?: string | null
  rg: string
  emissorRg: string
  ufRg: string
  dtExpedicaoRg?: string | null
  nmEstadoCivil?: string | null
  politicamenteExposto: string | null
  nmMae: string
  nmPai?: string | null
  logradouro: string
  numero: string
  enderecoComplemento?: string | null
  bairro: string
  cidade: string
  enderecoUf?: string | null
  cep?: string | null
  telefone?: string | null
  telefoneComercial: string | null
  celular?: string | null
  dtExercicio?: string | null
  dtInscricaoPlano: string | null
  idCargo?: string | null
  nmCargo?: string | null
  naturalidade: string
  ufNaturalidade: string
  nacionalidade: string
  nmNacionalidade?: string | null
  estadoCivil: string
  email: string
  emailAdicional1?: string | null
  emailAdicional2?: string | null
  beneficiarios?: any[] | null
  planoSituacao?: string | null
  planoCategoria?: string | null
  patrocinadores?: any[] | null
}

export function partipanteResponseToParticipanteDTO(
  data: ParticipanteResponseType
): ParticipanteFormData & { patrocinadores?: any[] | null } {
  return {
    id: data.id,
    estadoCivil: (data.estadoCivil as EstadoCivil) || ESTADO_CIVIL.OUTROS,
    rg: data.rg,
    nomeMae: data.nmMae,
    nomePai: data.nmPai || '',
    nome: data.nome,
    dataNascimento: formatarDataBR(data.dtNascimento),
    nacionalidade: (data.nacionalidade as Nacionalidade) || NACIONALIDADE.NAO_INFORMADA,
    emissorRg: data.emissorRg,
    ufRg: (data.ufRg as UF) || 'DF',
    sexo: data.sexo === 'M' ? 'Masculino' : data.sexo === 'F' ? 'Feminino' : 'Não informado',
    naturalidade: data.naturalidade,
    ufNaturalidade: (data.ufNaturalidade as UF) || 'DF',
    dataExpedicao: data.dtExpedicaoRg ? formatarDataBR(data.dtExpedicaoRg) : '',
    cep: data.cep ? data.cep.replace(/(\d{5})(\d{3})/, '$1-$2') : '',
    bairro: data.bairro,
    numero: data.numero,
    uf: (data.enderecoUf as UF) || 'DF',
    logradouro: data.logradouro,
    complemento: data.enderecoComplemento || undefined,
    cidade: data.cidade,
    emailPrincipal: data.email,
    telefoneResidencial: data.telefone ? formatarTelefoneBR(data.telefone) : undefined,
    telefoneCelular: data.celular ? formatarTelefoneBR(data.celular) : undefined,
    emailAlternativo1: data.emailAdicional1 || undefined,
    emailAlternativo2: data.emailAdicional2 || undefined,
    planoSituacao: data.planoSituacao || undefined,
    planoCategoria: data.planoCategoria || undefined,
    patrocinadores: data.patrocinadores || undefined
  }
}
