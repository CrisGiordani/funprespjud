export default interface FiltroChipsProps {
  filtros: Record<string, string>
  filtrosConfig: {
    key: string
    label: string
    type: string
    options: { label: string; value: string | number }[]
    group?: string
  }[]
  restaurarFiltro: (key: string) => void
}
