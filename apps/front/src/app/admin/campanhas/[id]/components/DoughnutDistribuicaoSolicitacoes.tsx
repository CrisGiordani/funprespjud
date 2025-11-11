import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import type {
  DistribuicaoSolicitacoesType} from '@/types/campanhas/TotalDistribuicaoSolicitacoesType';


ChartJS.register(ArcElement, Tooltip, Legend)

function LegendItem({
  label,
  value,
  percentage,
  color
}: {
  label: string
  value: number | DistribuicaoSolicitacoesType
  percentage: string
  color: string
}) {
  const valueNumber = typeof value === 'number' ? value : value.total

  
return (
    <div className='flex items-center gap-2 mb-2'>
      <div className='w-3 h-3 rounded-full' style={{ backgroundColor: color }} />
      <span className='text-sm'>
        {label}: <span style={{ color, fontWeight: 'bold' }}>{percentage}%</span> ({valueNumber})
      </span>
    </div>
  )
}

export function DoughnutDistribuicaoSolicitacoes({
  title,
  className,
  data
}: {
  title: React.ReactNode
  className?: string
  data: DistribuicaoSolicitacoesType | null | undefined
}) {
  const labels = ['Horizonte Protegido', 'Horizonte 2040', 'Horizonte 2050']
  const colors = ['rgba(5, 120, 190, 1)', 'rgba(247, 168, 51, 1)', 'rgba(203, 46, 140, 1)']
  const total = data?.total || 0

  // Se não há dados, não renderiza o componente
  if (!data) {
    return (
      <div className={className}>
        {title}
        <div className='flex items-center justify-center h-[300px]'>
          <div className='text-gray-500'>Carregando dados...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {title}
      <div className='flex  md:justify-start md:flex-row flex-col'>
        <div className='relative w-[300px] h-[300px] mt-6'>
          <Doughnut
            data={{
              labels: labels,
              datasets: [
                {
                  label: '',
                  data: [data?.horizonteProtegido, data?.horizonte2040, data?.horizonte2050],
                  backgroundColor: colors,
                  borderColor: colors,
                  borderWidth: 1
                }
              ]
            }}
            options={{
              responsive: true,
              cutout: '70%',
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: false
                }
              }
            }}
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-lg text-gray-700'>Total de solicitações</div>
              <div className='text-3xl font-bold text-gray-700'>{total}</div>
            </div>
          </div>
        </div>
        <div className='ml-4 md:mt-32 sm:mt-16'>
          {labels.map((label, i) => {
            const key = label === 'Horizonte Protegido' ? 'horizonteProtegido' : 
                       label === 'Horizonte 2040' ? 'horizonte2040' : 'horizonte2050'

            const value = (data[key as keyof DistribuicaoSolicitacoesType] as number) || 0
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
            
            return (
              <LegendItem
                key={i}
                label={label}
                value={value}
                percentage={percentage}
                color={colors[i] as string}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
