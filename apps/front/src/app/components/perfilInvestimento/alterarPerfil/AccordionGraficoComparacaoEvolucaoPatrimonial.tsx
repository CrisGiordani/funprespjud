import { useState } from 'react'

import { AccordionDetails, AccordionSummary, Box, styled, Typography } from '@mui/material'
import type { AccordionProps } from '@mui/material/Accordion'
import MuiAccordion from '@mui/material/Accordion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import { capitalize } from '@/utils/string'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function AccordionGraficoComparacaoEvolucaoPatrimonial({
  anos,
  performanceAtual,
  performanceSimulada,
  nomePerfilAtual,
  nomePerfilSolicitado
}: {
  anos: string[]
  performanceAtual: number[]
  performanceSimulada: number[]
  nomePerfilAtual: string
  nomePerfilSolicitado: string
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    border: 'none !important',
    boxShadow: 'none !important',
    '&:not(:last-child)': {
      borderBottom: 0,
      border: 'none !important',

      borderTop: 0
    },
    '&:first-child': {
      border: 'none !important',
      borderTop: 0,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    },
    '&:before': {
      border: 'none !important',
      boxShadow: 'none !important',
      backgroundColor: 'transparent !important'
    }
  }))

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    },

    plugins: {
      legend: {
        display: false //! Esconde a legenda do gráfico
      }
    }
  }

  const data = {
    labels: anos,
    datasets: [
      {
        label: capitalize(nomePerfilAtual),
        data: performanceAtual,
        borderColor: '#ca8023', // laranja
        backgroundColor: 'rgba(245, 158, 66, 0.1)',
        pointBackgroundColor: 'white',
        pointBorderColor: '#f59e42',
        pointBorderWidth: 3,
        pointRadius: 6,
        tension: 0.4
      },
      {
        label: capitalize(nomePerfilSolicitado),
        data: performanceSimulada,
        borderColor: '#0578be', // azul
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        pointBackgroundColor: 'white',
        pointBorderColor: '#0ea5e9',
        pointBorderWidth: 3,
        pointRadius: 6,
        tension: 0.4
      }
    ]
  }

  return (
    <Accordion expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)}>
      <AccordionSummary
        sx={{
          '& .MuiAccordionSummary-content': {
            flexDirection: 'column',
            alignItems: 'flex-start',
            border: 'none !important',
            boxShadow: 'none !important'
          }
        }}
      >
        <Typography variant='h5' sx={{ fontSize: '1.25rem', fontWeight: '400 !important' }}>
          Gráfico de comparação de evoluções patrimoniais
        </Typography>
        <Typography variant='body1' sx={{ fontWeight: '400 !important' }}>
          Veja no gráfico abaixo a diferença de evolução patrimonial projetada para ambos os perfis.
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className='flex justify-center items-center border rounded-lg border-gray-200 md:p-8'>
          <Line options={options} data={data} height={350} width={1000} />
        </div>

        <div className='sm:flex sm:flex-row sm:gap-12 sm:justify-center'>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}
            className='items-center sm:items-start'
          >
            <div className=' bg-yellow-700 w-[50px] h-[10px] rounded-xl'></div>
            <Typography variant='body1'>{capitalize(nomePerfilAtual)}</Typography>
            <Typography variant='h5' sx={{ color: 'var(--mui-palette-text-primary) !important', fontSize: '1.25rem' }}>
              {performanceAtual?.at(-1)?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}
            className='items-center sm:items-start'
          >
            <div className='bg-primary-main w-[50px] h-[10px] rounded-xl'></div>
            <Typography variant='body1'>{capitalize(nomePerfilSolicitado)}</Typography>
            <Typography variant='h5' sx={{ color: 'var(--mui-palette-text-primary) !important', fontSize: '1.25rem' }}>
              {performanceSimulada?.at(-1)?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </Typography>
          </Box>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
