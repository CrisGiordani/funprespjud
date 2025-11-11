import { Typography } from '@mui/material'

export function TitleSubtitleSection({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className='mt-8 mb-4'>
      <Typography variant='h5' sx={{ fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}>
        {title}
      </Typography>
      {subtitle && <Typography variant='body1'>{subtitle}</Typography>}
    </div>
  )
}
