export type AccordionPropsType = {
  simulacao: any
  expanded: boolean
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void
  subtitle?: React.ReactNode
}
