export enum PeriodoEnum {
  PRIMEIRO_ANO = 'primeiro-ano',
}

export type DatasetsDataType = {
  periodo: number[] | string[]
  totalRentabilizado: number[] | string[]
}

export type ChartDatasetCustomType = {
  label: string
  backgroundColor: string
  borderRadius?: number
  stack: string
  data: number[] | string[]
  description?: string
  hiddenData?: boolean
}
