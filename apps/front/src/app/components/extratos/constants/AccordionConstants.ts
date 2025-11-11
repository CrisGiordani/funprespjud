import { generateMeses } from '@/app/utils/formatters'

// Constantes para tipos de contribuição
export const CONTRIBUICAO_TYPES = {
  NORMAL: 'NORMAL',
  VINCULADA: 'VINCULADA',
  FACULTATIVA: 'FACULTATIVA',
  BENEFICIO_CONCEDIDO: 'BENEFÍCIO CONCEDIDO',
  PAGTO: 'PAGTO',
  DEVOL: 'DEVOL',
  TRANSFERENCIA_PERFIL: 'TRANSFERÊNCIA DE PERFIL',
  TRANSFERENCIA_PERFIL_ALT: 'TRANSFERENCIA DE PERFIL'
} as const

// Constantes para tipos de contribuidor
export const CONTRIBUIDOR_TYPES = {
  PARTICIPANTE: 'PARTICIPANTE',
  PATROCINADOR: 'PATROCINADOR',
  AUTOPATROCINADO: 'AUTOPATROCINADO',
  SEGURO: 'SEGURO'
} as const

// Constantes para meses (usando formatters.ts)
export const MESES = generateMeses().map(mes => mes.label)

// Constantes para paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 0
} as const

// Constantes para estilos
export const STYLES = {
  ICON_SIZE: 'text-3xl',
  FONT_SIZES: {
    TITLE: 'text-base',
    SUBTITLE: 'text-sm',
    CAPTION: 'text-xs'
  },
  COLORS: {
    PRIMARY: 'var(--mui-palette-primary-main)',
    SECONDARY: 'var(--mui-palette-text-secondary)',
    DISABLED: 'var(--mui-palette-text-disabled)'
  }
} as const
