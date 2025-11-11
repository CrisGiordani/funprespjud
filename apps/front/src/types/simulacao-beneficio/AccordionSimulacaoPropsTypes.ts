import type { AccordionPropsType } from './AccordionPropsTypes'

export type AccordionSimulacaoPropsType = AccordionPropsType & {
  simulacao: any
  title: string
  children: React.ReactNode
  summaryVariant?: any
  summaryClass?: string
}

export type AccordionSimulacaoFilterPropsType = AccordionPropsType & {
  title: string
  children: React.ReactNode
}
