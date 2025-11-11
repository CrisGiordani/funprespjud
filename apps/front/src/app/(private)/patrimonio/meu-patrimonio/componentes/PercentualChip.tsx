import { Chip } from '@mui/material'

import { formatPercentage } from '@/app/utils/formatters'

export function PercentualChip({ percentualCrescimento }: { percentualCrescimento: number }) {
  return (
    <Chip
      icon={
        <i
          className={`${percentualCrescimento >= 0 ? 'fa-thin fa-arrow-up' : 'fa-thin fa-arrow-down'} font-thin text-sm`}
        ></i>
      }
      label={
        percentualCrescimento >= 0
          ? `${formatPercentage(percentualCrescimento)}`
          : formatPercentage(percentualCrescimento)
      }
      color={percentualCrescimento >= 0 ? 'success' : 'error'}
      sx={{
        fontSize: '1rem',
        padding: '1.3rem 0.5rem',
        fontWeight: 600,
        borderRadius: '100px'
      }}
    />
  )
}
