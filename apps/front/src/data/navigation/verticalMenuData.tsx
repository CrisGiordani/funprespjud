// Type Imports
import { PermissoesEnum } from '@/services/PapeisEPermissoesService'
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Início',
    href: '/inicio',
    icon: 'fa-regular fa-house'
  },
  {
    label: 'Financeiro'
  },
  {
    label: 'Meu patrimônio',
    href: '/patrimonio/meu-patrimonio',
    icon: 'fa-kit fa-regular-sack-dollar-user'
  },
  {
    label: 'Extrato',
    href: '/patrimonio/extrato',
    icon: 'fa-regular fa-receipt'
  },
  {
    label: 'Perfil de investimento',
    href: '/patrimonio/investimento',
    icon: 'fa-kit fa-solid-chart-mixed-user'
  },

  // {
  //   label: 'Contribuição facultativa',
  //   href: '/patrimonio/contribuicao-facultativa',
  //   icon: 'fa-kit fa-pay-ras text-2xl'
  // },
  {
    label: 'Pessoal'
  },
  {
    label: 'Perfil',
    href: '/pessoal/perfil',
    icon: 'fa-regular fa-user'
  },
  {
    label: 'Imposto de Renda',
    href: '/pessoal/dirf',
    icon: 'fa-regular fa-calculator'
  },
  {
    label: 'Serviços'
  },

  // {
  //   label: 'CAR',
  //   href: '/servicos/car',
  //   icon: 'fa-regular fa-calculator'
  // },
  {
    label: 'Empréstimo',
    href: '/servicos/emprestimo',
    icon: 'fa-regular fa-hand-holding-dollar',
    permissoes: [PermissoesEnum.VER_EMPRESTIMO]
  },
  {
    label: 'Simular benefícios',
    href: '/servicos/simular-beneficios',
    icon: 'fa-regular fa-sliders-up',
    permissoes: [PermissoesEnum.FAZER_SIMULACAO]
  },
  {
    label: 'Clube de Vantagens',
    href: '/servicos/clube-vantagens',
    icon: 'fa-regular fa-gift'
  },
  {
    label: 'Outros'
  },
  {
    label: 'Documentos',
    href: '/outros/documentos',
    icon: 'fa-regular fa-file-lines'
  },
  {
    label: 'Políticas',
    href: '/outros/politicas',
    icon: 'fa-regular fa-book-section'
  }
]

export default verticalMenuData
