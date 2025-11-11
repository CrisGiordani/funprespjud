import { Card, CardContent, Typography } from '@mui/material'

export default function BoxConsideracaoPerfil({
  icon,
  title,
  description
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <Card
      variant='outlined'
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '0.5rem'
        }}
      >
        <div className='rounded-full bg-primary-main/10 p-2 flex items-center justify-center w-14 h-14'>
          <i className={`${icon} text-primary-main text-xl`}></i>
        </div>
        <Typography variant='h5' sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant='body1'>{description}</Typography>
      </CardContent>
    </Card>
  )
}
