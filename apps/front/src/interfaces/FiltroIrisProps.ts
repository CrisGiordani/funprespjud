export default interface FiltroIrisProps {
  className?: string
  filtrosConfig: {
    key: string
    label: string
    type: string
    options: any[]
    placeholder: string
    fullWidth?: boolean
    group?: string
  }[]
  filtros?: Record<string, string>
  setFiltros?: React.Dispatch<React.SetStateAction<Record<string, string>>>
}
