import { Card, Typography, Grid } from '@mui/material'

import TextWithLegend from '@/components/ui/TextWithLegend'

type CardShowInternalInfoProps = {
  title: string
  subtitle?: string
  internalInfos: { legend: string; text: string; className?: string }[]
  actions?: React.ReactNode
}

export function CardShowInternalInfo({ title, subtitle, internalInfos, actions }: CardShowInternalInfoProps) {
  return (
    <Card
      variant='outlined'
      className='flex flex-col lg:flex-row items-end lg:items-center justify-between gap-4 p-4 lg:px-8 px-4'
    >
      <div className='flex-1 w-full'>
        <div>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant='body1'
              sx={{
                color: 'primary.dark',
                fontWeight: 700,
                textTransform: 'capitalize'
              }}
            >
              {subtitle}
            </Typography>
          )}
        </div>
        <Grid container spacing={{ xs: 2, md: 4 }} columns={12} sx={{ mt: 4 }}>
          {internalInfos.map(({ legend, text, className }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={legend}>
              <TextWithLegend legend={legend} text={text} className={className} />
            </Grid>
          ))}
        </Grid>
      </div>
      {actions && <div className='w-[230px] flex flex-col items-end justify-center gap-4'>{actions}</div>}
    </Card>
  )
}
