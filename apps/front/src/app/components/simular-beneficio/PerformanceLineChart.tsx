import React from 'react'

import { Box, Typography } from '@mui/material'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'

import type { PerformanceLineChartPropsType } from '@/types/simulacao-beneficio/PerformanceLineChartPropsTypes'
import { formatCurrency } from '@/app/utils/formatters'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

export function PerformanceLineChart({ simulacao }: PerformanceLineChartPropsType) {
  const labels = simulacao.performance.anos.map((ano: any) => ano.toString())

  const data = {
    labels,
    datasets: [
      {
        label: 'Evolução patrimonial simulada',
        data: simulacao.performance.performance_simulada,
        borderColor: '#0578BE',
        backgroundColor: '#0578BE',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0578BE',
        pointRadius: 5,
        fill: false,
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            if (typeof value === 'number') {
              return value === 0 ? '0' : value.toLocaleString('pt-BR')
            }

            return value
          }
        }
      }
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        p: { xs: 1, sm: 3 },
        mb: 2,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Line
        data={data}
        options={options}
        style={{ borderRadius: 10, border: '1px solid #e0e0e0', padding: 20, margin: 10, width: '100%' }}
      />

      <div className='sm:flex sm:flex-row sm:gap-12 sm:justify-center'>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}
          className='items-center sm:items-start'
        >
          <div className='bg-[#0578BE] w-[50px] h-[10px] rounded-xl'></div>
          <Typography variant='body1'>Evolução patrimonial simulada</Typography>
          <Typography variant='h5' sx={{ color: 'var(--mui-palette-text-primary) !important', fontSize: '1.25rem' }}>
            {formatCurrency(simulacao.performance.total_simulada)}
          </Typography>
        </Box>
      </div>
    </Box>
  )
}
