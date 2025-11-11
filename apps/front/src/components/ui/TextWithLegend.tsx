import { Typography } from '@mui/material'

type TextWithLegendProps = {
  text?: string
  legend: string
  legendPosition?: 'top' | 'bottom' | 'right' | 'left'
  className?: string
}

const positionLegend = (text: string, legend: string, className?: string) => {
  return {
    top: (
      <div className={`flex flex-col ${className}`}>
        <Typography variant='body1'>{legend}</Typography>
        <Typography
          variant='body1'
          sx={{
            color: 'var(--mui-palette-text-primary) !important',
            fontWeight: 700
          }}
        >
          {text}
        </Typography>
      </div>
    ),
    bottom: (
      <div className={`flex flex-col ${className}`}>
        <Typography
          variant='body1'
          sx={{
            color: 'var(--mui-palette-text-primary) !important',
            fontWeight: 700
          }}
        >
          {text}
        </Typography>
        <Typography variant='body1'>{legend}</Typography>
      </div>
    ),
    right: (
      <div className={`flex flex-row items-center gap-1 ${className}`}>
        <Typography
          variant='body1'
          sx={{
            color: 'var(--mui-palette-text-primary) !important',
            fontWeight: 700
          }}
        >
          {text}:
        </Typography>
        <Typography variant='body1'>{legend}</Typography>
      </div>
    ),
    left: (
      <div className={`flex flex-row items-center gap-1 ${className}`}>
        <Typography variant='body1' sx={{ textWrap: 'nowrap' }}>
          {legend}:
        </Typography>
        <Typography
          variant='body1'
          sx={{
            color: 'var(--mui-palette-text-primary) !important',
            fontWeight: 700
          }}
        >
          {text}
        </Typography>
      </div>
    )
  }
}

export default function TextWithLegend({ text, legend, legendPosition = 'top', className }: TextWithLegendProps) {
  if (!text || text === '') {
    return null
  }

  return <>{positionLegend(text, legend, className)[legendPosition]}</>
}
