import { Typography } from '@mui/material'

export function LabelValueItemAccortion({
  title,
  values
}: {
  title: string
  values: { label: string; value: React.ReactNode }[]
}) {
  return (
    <div className='flex flex-col gap-1'>
      <Typography
        variant='body1'
        sx={{
          fontWeight: 'bold !important',
          color: 'var(--mui-palette-text-primary) !important',
          marginBottom: '-0.25rem'
        }}
      >
        {title}
      </Typography>

      {values.map(({ label, value }) => (
        <div className='flex justify-between' key={label}>
          <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary) !important' }}>
            {label}
          </Typography>
          <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary) !important' }}>
            {value}
          </Typography>
        </div>
      ))}
    </div>
  )
}
