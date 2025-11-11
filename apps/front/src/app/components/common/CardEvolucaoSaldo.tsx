'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Skeleton, Typography } from '@mui/material'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

import Link from '@/components/Link'
import { formatCurrency } from '@/app/utils/formatters'
import useGetEvolucaoAnual from '@/hooks/patrimonio/useGetEvolucaoAnual'
import type { EvolucaoMensalDTO } from '@/types/patrimonio/EvolucaoMensalDTO.type'
import { TooltipCustomized } from '@/components/ui/TooltipCustomized'
import { useAuth } from '@/contexts/AuthContext'
import {
  PeriodoEnum,
  type ChartDatasetCustomType,
  type DatasetsDataType
} from '@/types/patrimonio/EvolucaoDoSaldoGrafico.type'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function getPeriodo(data: EvolucaoMensalDTO[]): Map<PeriodoEnum, DatasetsDataType> {
  const periodoMap = new Map<PeriodoEnum, DatasetsDataType>()

  periodoMap.set(PeriodoEnum.PRIMEIRO_ANO, {
    periodo: data.map(item => Number(item.ano)),
    totalRentabilizado: data.map(item => Number(item.totalRentabilizado))
  })

  return periodoMap
}

const datasetsDataDefault = {
  periodo: [],
  totalRentabilizado: []
}

export function CardEvolucaoSaldo({ showVerDetalhesDoPatrimonio }: { showVerDetalhesDoPatrimonio?: boolean }) {
  const [periodo] = useState<PeriodoEnum>(PeriodoEnum.PRIMEIRO_ANO)

  const [datasetsData, setDatasetsData] = useState<DatasetsDataType>(datasetsDataDefault)
  const [datasets, setDatasets] = useState<ChartDatasetCustomType[]>([])

  const { user } = useAuth()
  const { evolucaoAnual, isLoading: isLoadingAnual, getEvolucaoAnual } = useGetEvolucaoAnual()

  const isLoading = isLoadingAnual

  useEffect(() => {
    if (user?.cpf) {
      getEvolucaoAnual(user.cpf)
    }
  }, [getEvolucaoAnual, user])

  useEffect(() => {
    if (periodo === PeriodoEnum.PRIMEIRO_ANO && evolucaoAnual) {
      setDatasetsData(getPeriodo(evolucaoAnual).get(periodo) || datasetsDataDefault)

      return
    }
  }, [evolucaoAnual, periodo])

  useEffect(() => {
    setDatasets([
      {
        label: 'Valor total rentabilizado',
        backgroundColor: '#0E4F9A',
        borderRadius: 5,
        stack: 'Stack 0',
        data: datasetsData.totalRentabilizado,
        description: 'Valor total aportado e rentabilizado durante cada período.'
      }
    ])
  }, [datasetsData])

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Evolução do saldo'
        subheader={
          <>
            <Typography variant='body1'>
              No gráfico abaixo, você pode acompanhar a evolução do seu saldo ao longo do tempo, considerando saldo
              inicial, aportes e rentabilidade do ano.
            </Typography>
          </>
        }
      />
      <CardCustomized.Content>
        {isLoading ? (
          <Skeleton variant='rectangular' width='100%' height={256} sx={{ borderRadius: '5px' }} />
        ) : datasetsData.periodo.length > 0 ? (
          <div className='h-64 border border-gray-400 rounded-lg p-4 mt-6 relative'>
            <Bar
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.parsed.y

                        return `${context.dataset.label}: ${formatCurrency(value)}`
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false
                    },
                    border: {
                      display: true,
                      color: '#e5e7eb'
                    }
                  },
                  y: {
                    grid: {
                      color: '#f3f4f6'
                    },
                    border: {
                      display: true,
                      color: '#e5e7eb'
                    },
                    ticks: {
                      callback: function (value) {
                        return formatCurrency(Number(value))
                      }
                    }
                  }
                }
              }}
              data={{
                labels: datasetsData.periodo as string[],
                datasets: datasets.filter(dataset => !dataset.hiddenData)
              }}
            />
          </div>
        ) : (
          <div className='h-64 border border-gray-100 rounded-lg p-4 mt-6 flex flex-col items-center justify-center gap-4'>
            <Image
              src={'/images/iris/verificar-valores.svg'}
              alt='Você ainda não realizou aporte na Funpresp-jud ou não há dados suficientes para exibir o gráfico.'
              width={100}
              height={100}
            />
            <Typography variant='body1'>
              Você ainda não realizou aporte na Funpresp-jud ou não há dados suficientes para exibir o gráfico.
            </Typography>
          </div>
        )}

        {datasetsData.periodo.length > 0 && (
          <div className='w-full flex justify-center flex-wrap gap-6 mt-2 p-4'>
            {datasets.map(({ label, backgroundColor, description, hiddenData }, index) => (
              <div key={index} className='flex flex-col items-center'>
                <div
                  className={`w-8 h-2 rounded`}
                  style={{
                    backgroundColor
                  }}
                ></div>
                <div className='flex items-center gap-2'>
                  <Typography
                    variant='body1'
                    className='cursor-pointer'
                    style={{
                      textDecoration: hiddenData ? 'line-through' : 'none'
                    }}
                    onClick={() => {
                      const newDatasets = datasets.map(dataset => {
                        if (dataset.label === label) {
                          return { ...dataset, hiddenData: !dataset.hiddenData }
                        }

                        return dataset
                      })

                      setDatasets(newDatasets)
                    }}
                  >
                    {label}
                  </Typography>
                  {description && (
                    <TooltipCustomized title={description}>
                      <i
                        className={`fa-duotone fa-regular fa-circle-question text-xl cursor-pointer`}
                        style={
                          {
                            // @ts-ignore
                            '--fa-primary-color': 'var(--mui-palette-primary-main)',

                            // @ts-ignore
                            '--fa-secondary-color':
                              'color-mix(in srgb, var(--mui-palette-primary-main) 25%, transparent)'
                          } as React.CSSProperties
                        }
                      ></i>
                    </TooltipCustomized>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardCustomized.Content>
      {showVerDetalhesDoPatrimonio && (
        <CardCustomized.Footer>
          <div className='w-full mt-[-1rem]'>
            <div className='max-w-[310px] flex flex-col text-center gap-4 m-auto'>
              <Link href='/patrimonio/meu-patrimonio'>
                <ButtonCustomized fullWidth variant='outlined' type='button'>
                  Ver detalhes do seu patrimônio
                </ButtonCustomized>
              </Link>
            </div>
          </div>
        </CardCustomized.Footer>
      )}
    </CardCustomized.Root>
  )
}
