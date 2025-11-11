// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Início',
    href: '/inicio',
    icon: 'ri-home-smile-line'
  },
  {
    label: 'Meu patrimônio',
    href: '/patrimonio',
    icon: 'ri-information-line'
  },
  {
    label: 'Extrato',
    href: '/extrato',
    icon: 'ri-information-line'
  },
  {
    label: 'Investimentos',
    href: '/investimentos',
    icon: 'ri-information-line'
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: 'ri-information-line'
  },
  {
    label: 'DIRF',
    href: '/dirf',
    icon: 'ri-information-line'
  },
  {
    label: 'CAR',
    href: '/car',
    icon: 'ri-information-line'
  },
  {
    label: 'Simular benefícios',
    href: '/simular_beneficios',
    icon: 'ri-information-line'
  },
  {
    label: 'Clube de Vantagens',
    href: '/clube_de_vantagens',
    icon: 'ri-information-line'
  },
  {
    label: 'Documentos',
    href: '/documentos',
    icon: 'ri-information-line'
  },
  {
    label: 'Políticas',
    href: '/politicas',
    icon: 'ri-information-line'
  }
]

export default horizontalMenuData
