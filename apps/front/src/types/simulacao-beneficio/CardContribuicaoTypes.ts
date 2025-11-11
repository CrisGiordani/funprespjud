import type { ReactNode } from 'react'

export type CardContribuicaoType = {
  simulacao: any
  iconClass: string
  title: ReactNode
  value: string
  percent: string
  colorClass?: string
  primary?: boolean
}
